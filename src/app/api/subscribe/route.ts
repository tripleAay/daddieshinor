import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAppCheck, adminDb } from "@/app/lib/firebaseAdmin";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeSubscriberDocId(email: string) {
    return encodeURIComponent(email.trim().toLowerCase());
}

export async function POST(req: NextRequest) {
    try {

        const isDev = process.env.NODE_ENV !== "production";

        if (!isDev) {
            const appCheckToken = req.headers.get("X-Firebase-AppCheck");

            if (!appCheckToken) {
                return NextResponse.json(
                    { ok: false, message: "Missing App Check token." },
                    { status: 401 }
                );
            }

            try {
                await adminAppCheck.verifyToken(appCheckToken);
            } catch {
                return NextResponse.json(
                    { ok: false, message: "Invalid App Check token." },
                    { status: 401 }
                );
            }
        }
        const body = await req.json();

        const email = String(body?.email || "").trim().toLowerCase();
        const name = String(body?.name || "").trim();
        const source = String(body?.source || "daddieshinor_modal").trim();

        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { ok: false, message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        const docId = makeSubscriberDocId(email);
        const subscriberRef = adminDb.collection("subscribers").doc(docId);
        const existingDoc = await subscriberRef.get();

        if (existingDoc.exists) {
            return NextResponse.json({
                ok: true,
                duplicate: true,
                message: "This email is already subscribed.",
            });
        }

        await subscriberRef.set({
            email,
            name,
            source,
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            ok: true,
            duplicate: false,
            message: "Thank you! You've been subscribed.",
        });
    } catch (error) {
        console.error("Subscribe API error:", error);

        return NextResponse.json(
            { ok: false, message: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}