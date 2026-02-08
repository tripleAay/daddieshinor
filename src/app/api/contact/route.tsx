import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    // TODO: send email or store in DB here
    // For now, just respond success so the form works.

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
