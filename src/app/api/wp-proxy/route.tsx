// app/api/wp-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const wpBase = process.env.WP_URL || "https://www.daddieshinor.com";
    const path = request.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
    }

    const fullWpUrl = new URL(path, wpBase).toString();
    console.log("[WP Proxy] Original URL:", fullWpUrl);

    // Try multiple public proxies in sequence until one works
    const proxyOptions = [
      (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
      (url: string) => `https://cors.sh/${url}`,
      (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    ];

    let lastError = "";

    for (const createProxyUrl of proxyOptions) {
      const proxyUrl = createProxyUrl(fullWpUrl);
      console.log("[WP Proxy] Trying:", proxyUrl);

      try {
        const res = await fetch(proxyUrl, {
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            Referer: request.headers.get("referer") || "https://cda0-102-89-85-84.ngrok-free.app/",
          },
          cache: "no-store",
          redirect: "follow",
        });

        console.log("[WP Proxy] Status from proxy:", res.status);

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }

        const text = await res.text().catch(() => "");
        lastError = `Proxy ${proxyUrl} failed: ${res.status} - ${text.slice(0, 200)}`;
        console.warn(lastError);
      } catch (err) {
        lastError = `Proxy fetch error: ${err.message}`;
        console.warn(lastError);
      }
    }

    // If all proxies failed
    return NextResponse.json(
      { error: "All proxies failed", details: lastError },
      { status: 502 }
    );
  } catch (err: any) {
    console.error("[WP Proxy] Server-side error:", err);
    return NextResponse.json(
      { error: "Internal proxy error", details: err.message || "Unknown" },
      { status: 500 }
    );
  }
}