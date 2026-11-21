import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const WP_ORIGIN = (process.env.WP_URL || "https://api.daddieshinor.com").replace(/\/+$/, "");
const TIMEOUT_MS = 10000;

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

  let target: URL;
  try {
    // Only permit public, read-only WordPress REST endpoints.
    if (!path.startsWith("/wp-json/wp/v2/") || path.startsWith("//") || path.includes("\\")) {
      throw new Error("Invalid endpoint");
    }
    target = new URL(path, WP_ORIGIN);
    if (target.origin !== new URL(WP_ORIGIN).origin ||
        !target.pathname.startsWith("/wp-json/wp/v2/")) {
      throw new Error("Invalid origin or path");
    }
    const resource = target.pathname.slice("/wp-json/wp/v2/".length);
    if (!/^(posts|categories|tags|media)(\/\d+)?\/?$/.test(resource)) {
      throw new Error("Endpoint not permitted");
    }
    if (target.searchParams.has("context") && target.searchParams.get("context") !== "view") {
      throw new Error("Private context not permitted");
    }
  } catch {
    return NextResponse.json({ error: "Invalid WordPress path" }, { status: 400 });
  }

  try {
    const res = await fetch(target.toString(), {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: 60 },
    });
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      console.error("WP proxy received non-JSON", res.status, target.pathname);
      return NextResponse.json({ error: "Invalid upstream response" }, { status: 502 });
    }
    const body = await res.text();
    const headers = new Headers({ "Content-Type": "application/json; charset=utf-8" });
    if (res.ok) headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    // WordPress pagination metadata is needed for Load More.
    for (const name of ["X-WP-Total", "X-WP-TotalPages"]) {
      const value = res.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new NextResponse(body, { status: res.status, headers });
  } catch (error) {
    console.error("WP proxy upstream error", error);
    return NextResponse.json({ error: "WordPress temporarily unavailable" }, { status: 502 });
  }
}
