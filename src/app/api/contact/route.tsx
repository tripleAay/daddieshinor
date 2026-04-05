import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getAdminDb } from "@/app/lib/firebaseAdmin";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      return NextResponse.json(
        { message: "Missing RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const message = String(body?.message || "").trim();
    const subject = "Contact Form Message";

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    let db;
    try {
      db = getAdminDb();
    } catch (error) {
      console.error("Firebase Admin init failed:", error);
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? `Firebase init failed: ${error.message}`
              : "Firebase init failed.",
        },
        { status: 500 }
      );
    }

    let docRef;
    try {
      docRef = await db.collection("messages").add({
        name,
        email,
        subject,
        message,
        source: "contact_page",
        createdAt: FieldValue.serverTimestamp(),
        emailStatus: "pending",
      });
    } catch (error) {
      console.error("Firestore write failed:", error);
      return NextResponse.json(
        {
          message:
            error instanceof Error
              ? `Firestore write failed: ${error.message}`
              : "Firestore write failed.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: "Daddieshinor <hello@daddieshinor.com>",
      to: ["shinordaddie@gmail.com"],
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      html: `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#f9f9f9; padding:40px;">
    
    <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; padding:32px; border:1px solid #eee;">
      
      <!-- Header -->
      <div style="margin-bottom:24px;">
        <h1 style="font-size:20px; margin:0; color:#111;">Daddieshinor</h1>
        <p style="font-size:13px; color:#666; margin-top:4px;">
          New message from your contact page
        </p>
      </div>

      <!-- Divider -->
      <div style="height:1px; background:#eee; margin:20px 0;"></div>

      <!-- Content -->
      <div style="font-size:14px; color:#111;">
        <p><strong>Name</strong><br/>${safeName}</p>
        <p><strong>Email</strong><br/>${safeEmail}</p>
        <p><strong>Message</strong></p>

        <div style="margin-top:8px; padding:16px; background:#f5f5f5; border-radius:10px; line-height:1.6;">
          ${safeMessage}
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top:30px; font-size:12px; color:#888;">
        <p>Sent from daddieshinor.com</p>
        <p>Firestore ID: ${docRef.id}</p>
      </div>

    </div>
  </div>
`
    });

    if (error) {
      await db.collection("messages").doc(docRef.id).update({
        emailStatus: "failed",
        emailError: error.message || "Resend failed",
      });

      return NextResponse.json(
        {
          message: `Resend failed: ${error.message || "Unknown error"}`,
          firestoreSaved: true,
          id: docRef.id,
        },
        { status: 500 }
      );
    }

    await db.collection("messages").doc(docRef.id).update({
      emailStatus: "sent",
      resendId: data?.id || null,
    });

    return NextResponse.json({
      ok: true,
      message: "Message sent successfully.",
      id: docRef.id,
    });
  } catch (error) {
    console.error("Contact route error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}