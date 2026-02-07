import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ ensure Node runtime (not Edge)

export async function GET(request: NextRequest) {
  const wpBase = process.env.WP_URL;

  if (!wpBase) {
    return NextResponse.json({ error: "WP_URL is not set" }, { status: 500 });
  }

  const path = request.nextUrl.searchParams.get("path");
  if (!path || !path.startsWith("/")) {
    return NextResponse.json(
      { error: "Invalid path (must start with /)" },
      { status: 400 }
    );
  }

  const upstream = new URL(path, wpBase).toString();

  try {
    const res = await fetch(upstream, {
      headers: {
        Accept: "application/json",
        // ✅ some hosts block “unknown” clients; a UA helps
        "User-Agent": "Mozilla/5.0 (NextProxy)",
      },
      cache: "no-store",
    });

    const body = await res.text();
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `WordPress returned ${res.status}`,
          upstream,
          preview: body.slice(0, 400),
        },
        { status: res.status }
      );
    }

    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": contentType.includes("application/json")
          ? "application/json; charset=utf-8"
          : contentType || "text/plain; charset=utf-8",
      },
    });
  } catch (e: any) {
    // ✅ THIS is the key: show the real network/TLS error
    return NextResponse.json(
      {
        error: "Proxy fetch failed",
        upstream,
        name: e?.name,
        message: e?.message,
        code: e?.code,
        cause: e?.cause ? String(e.cause) : undefined,
      },
      { status: 502 }
    );
  }
}
