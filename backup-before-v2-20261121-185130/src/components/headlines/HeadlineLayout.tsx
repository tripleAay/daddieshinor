
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGlobalLoader } from "@/components/global-loader";

type HeadlinePost = {
  title: string;
  href: string;
};

type WordPressPost = {
  id: number;
  slug: string;
  title?: {
    rendered?: string;
  };
};

type Props = {
  title: string;
  description?: string;
  categoryId?: number;
};

const WP_BASE_URL = (
  process.env.NEXT_PUBLIC_WP_URL ||
  "https://api.daddieshinor.com"
).replace(/\/+$/, "");

const PER_PAGE = 15;
const REQUEST_TIMEOUT = 10000;
const MAX_RETRIES = 2;

function cleanText(input: unknown): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.name === "AbortError"
  );
}

function delay(
  milliseconds: number,
  signal: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, milliseconds);

    function onAbort() {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    }

    signal.addEventListener("abort", onAbort, {
      once: true,
    });
  });
}

async function fetchWithTimeout(
  url: string,
  signal: AbortSignal
): Promise<Response> {
  const controller = new AbortController();

  const abort = () => controller.abort();

  signal.addEventListener("abort", abort, {
    once: true,
  });

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    return await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", abort);
  }
}

async function fetchWithRetry(
  url: string,
  signal: AbortSignal
): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    try {
      const response = await fetchWithTimeout(url, signal);

      const retryable =
        response.status === 408 ||
        response.status === 429 ||
        response.status >= 500;

      if (
        retryable &&
        attempt < MAX_RETRIES
      ) {
        const retryAfter = response.headers.get(
          "Retry-After"
        );

        const retrySeconds = retryAfter
          ? Number(retryAfter)
          : NaN;

        const waitTime = Number.isFinite(retrySeconds)
          ? Math.min(retrySeconds * 1000, 5000)
          : 500 * Math.pow(2, attempt);

        await delay(waitTime, signal);
        continue;
      }

      return response;
    } catch (error) {
      if (signal.aborted) {
        throw error;
      }

      if (attempt === MAX_RETRIES) {
        throw error;
      }

      await delay(
        500 * Math.pow(2, attempt),
        signal
      );
    }
  }

  throw new Error("Unable to fetch posts.");
}

export default function HeadlineLayout({
  title,
  description,
  categoryId,
}: Props) {
  const [posts, setPosts] = useState<HeadlinePost[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const { start, stop } = useGlobalLoader();

  const loaderRef = useRef({ start, stop });
  const requestRef = useRef(0);

  useEffect(() => {
    loaderRef.current = { start, stop };
  }, [start, stop]);

  const categoryKey = categoryId ?? "all";

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestRef.current;

    let active = true;
    let loaderStarted = false;

    async function loadPosts() {
      setLoading(true);
      setError(null);

      if (page === 1) {
        setPosts([]);
        setHasMore(true);
        loaderRef.current.start();
        loaderStarted = true;
      }

      try {
        const params = new URLSearchParams({
          per_page: String(PER_PAGE),
          page: String(page),
          orderby: "date",
          order: "desc",
          status: "publish",
          _fields: "id,slug,title",
        });

        if (
          typeof categoryId === "number" &&
          categoryId > 0
        ) {
          params.set(
            "categories",
            String(categoryId)
          );
        }

        const url =
          `${WP_BASE_URL}/wp-json/wp/v2/posts?` +
          params.toString();

        const response = await fetchWithRetry(
          url,
          controller.signal
        );

        if (!active || requestId !== requestRef.current) {
          return;
        }

        // WordPress may return 400 for a page
        // beyond the available pagination range.
        if (response.status === 400 && page > 1) {
          const body = await response.json().catch(
            () => null
          );

          if (body?.code === "rest_post_invalid_page_number") {
            setHasMore(false);
            return;
          }
        }

        if (!response.ok) {
          throw new Error(
            `WordPress API returned ${response.status}`
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Unexpected WordPress response."
          );
        }

        const validPosts = data.filter(
          (post): post is WordPressPost =>
            post !== null &&
            typeof post === "object" &&
            typeof post.slug === "string" &&
            post.slug.length > 0
        );

        const newPosts: HeadlinePost[] =
          validPosts.map((post) => ({
            title:
              cleanText(post.title?.rendered) ||
              "Untitled",
            href: `/essays/${encodeURIComponent(
              post.slug
            )}`,
          }));

        if (!active || requestId !== requestRef.current) {
          return;
        }

        setPosts((previous) => {
          const existing = page === 1
            ? []
            : previous;

          const seen = new Set(
            existing.map((post) => post.href)
          );

          const unique = newPosts.filter(
            (post) => {
              if (seen.has(post.href)) {
                return false;
              }

              seen.add(post.href);
              return true;
            }
          );

          return [...existing, ...unique];
        });

        const totalPagesHeader =
          response.headers.get("X-WP-TotalPages");

        const totalPages = totalPagesHeader
          ? Number(totalPagesHeader)
          : NaN;

        if (Number.isFinite(totalPages)) {
          setHasMore(page < totalPages);
        } else {
          setHasMore(data.length === PER_PAGE);
        }
      } catch (err) {
        if (!active || controller.signal.aborted) {
          return;
        }

        console.error(
          "[Daddieshinor] Failed to load headlines:",
          err
        );

        setError(
          isAbortError(err)
            ? "The request timed out. Please try again."
            : "Unable to load essays right now. Please try again."
        );
      } finally {
        if (loaderStarted) {
          loaderRef.current.stop();
        }

        if (active && requestId === requestRef.current) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, categoryKey, retryKey]);

  function handleRetry() {
    setRetryKey((current) => current + 1);
  }

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-16 md:py-24">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black dark:text-white">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-6 h-1.5 w-32 mx-auto bg-black dark:bg-white rounded-full" />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-10 rounded-xl border border-red-200/50 bg-red-50/60 p-6 text-center text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-300 max-w-3xl mx-auto"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={handleRetry}
            disabled={loading}
            className="mt-4 rounded-full border border-current px-6 py-2 text-sm font-semibold transition-opacity hover:opacity-70 disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="space-y-5 max-w-3xl mx-auto">
        {posts.length === 0 ? (
          loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-800"
              />
            ))
          ) : error ? null : (
            <div className="py-20 text-center text-xl text-zinc-500 dark:text-zinc-400">
              No essays found yet.
            </div>
          )
        ) : (
          posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group block px-8 py-8 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 hover:bg-[#968e6814] hover:text-[#968e68] transition-all duration-300 text-center dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:text-[#a8a07a] shadow-sm hover:shadow-lg"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-tight text-black dark:text-white group-hover:text-[#968e68] dark:group-hover:text-[#a8a07a] transition-colors">
                {post.title}
              </h3>
            </Link>
          ))
        )}
      </div>

      {hasMore && posts.length > 0 && !error && (
        <div className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (!loading) {
                setPage((current) => current + 1);
              }
            }}
            disabled={loading}
            className="rounded-full border border-zinc-300 bg-white px-12 py-5 text-lg font-semibold text-black hover:bg-[#968e6814] hover:border-[#968e68] hover:text-[#968e68] active:scale-95 transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-[rgba(150,142,104,0.12)] dark:hover:border-[#968e68] dark:hover:text-[#a8a07a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Loading more..."
              : "Load More Essays"}
          </button>
        </div>
      )}

      {posts.length > 0 && (
        <p className="mt-10 text-center text-base text-zinc-500 dark:text-zinc-400">
          {posts.length} essays loaded
        </p>
      )}
    </section>
  );
}
