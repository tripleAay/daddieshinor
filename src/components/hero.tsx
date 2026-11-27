"use client";
import { fetchPostsReliably } from "@/lib/reliablePosts";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { useGlobalLoader } from "@/components/global-loader";
import ThoughtItem from "@/components/thoughtItem";
import styles from "./hero.module.css";

const FALLBACK_IMAGE = "/fallback-image.jpg";

type Slide = {
  tag: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  alt: string;
  featured?: boolean;
};

type Thought = {
  tag: string;
  title: string;
  image: string;
  href: string;
};

type WordPressPost = {
  id: number;
  slug: string;
  title?: {
    rendered?: string;
  };
  excerpt?: {
    rendered?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url?: string;
      media_details?: {
        sizes?: Record<
          string,
          {
            source_url?: string;
          }
        >;
      };
    }[];
    "wp:term"?: {
      taxonomy?: string;
      name?: string;
    }[][];
  };
};

const fallbackSlides: Slide[] = [
  {
    tag: "Tech",
    title: "Why AI will reward thinkers, not hustlers",
    excerpt:
      "The era of loud hustle is fading. The winners will be the ones who can think clearly, synthesize fast, and ship with depth.",
    href: "/essays/why-ai-will-reward-thinkers-not-hustlers",
    image: FALLBACK_IMAGE,
    alt: "Abstract AI visual representing deep thinking",
    featured: true,
  },
];

const fallbackThoughts: Thought[] = [
  {
    tag: "Tech",
    title:
      "Why most African tech products don’t fail because of technology",
    image: FALLBACK_IMAGE,
    href: "/essays/why-most-african-tech-products-dont-fail-because-of-technology",
  },
];

/* Shared tokens: same palette as EditorialIntro */
const ACCENT_TEXT =
  "text-[#6b6547] dark:text-[#c3bb61]";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#827c5b]";

function isPost(value: unknown): value is WordPressPost {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const post = value as Record<string, unknown>;

  return (
    typeof post.id === "number" &&
    typeof post.slug === "string" &&
    post.slug.length > 0
  );
}

function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  const document = new DOMParser().parseFromString(
    input,
    "text/html",
  );

  document
    .querySelectorAll("script, style, noscript")
    .forEach((element) => element.remove());

  document
    .querySelectorAll(
      "p, div, br, li, blockquote, section, article, h1, h2, h3, h4, h5, h6",
    )
    .forEach((element) => {
      element.appendChild(document.createTextNode(" "));
    });

  return (document.body.textContent ?? "")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const sliced = text.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");

  return `${
    lastSpace > maxChars / 2
      ? sliced.slice(0, lastSpace)
      : sliced
  }…`;
}

function getWpCategoryName(post: WordPressPost) {
  const categories = (
    post._embedded?.["wp:term"] ?? []
  ).flat();

  const category = categories.find(
    (term) => term.taxonomy === "category",
  );

  return (
    cleanWpText(category?.name ?? categories[0]?.name) ||
    "Uncategorized"
  );
}

function getFeaturedImage(
  post: WordPressPost,
  size: "large" | "medium" | "thumbnail" = "large",
) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return (
    media?.media_details?.sizes?.[size]?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url ||
    FALLBACK_IMAGE
  );
}

function ArrowIcon({
  left = false,
}: {
  left?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path
        d={
          left
            ? "M19 12H5m7 7-7-7 7-7"
            : "M5 12h14m-7-7 7 7-7 7"
        }
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Matches the loaded layout so nothing jumps when content arrives */
function HeroSkeleton() {
  const block =
    "animate-pulse rounded-xl bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]";

  return (
    <div
      role="status"
      aria-label="Loading latest stories"
      className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-6 xl:gap-9"
    >
      <div className="space-y-6 lg:col-span-6">
        <div className={`${block} h-10 w-48 rounded-full`} />
        <div className={`${block} h-28`} />
        <div className={`${block} h-16`} />
        <div className={`${block} aspect-[16/10] rounded-[26px]`} />
      </div>

      <div className="space-y-6 lg:col-span-4">
        <div className={`${block} h-14 w-48`} />

        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex gap-4">
            <div className={`${block} h-20 w-20 shrink-0`} />

            <div className="flex-1 space-y-3 py-2">
              <div className={`${block} h-3 w-16`} />
              <div className={`${block} h-4`} />
              <div className={`${block} h-4 w-3/4`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:flex lg:flex-col">
        <div
          className={`${block} aspect-[4/3] rounded-[20px] lg:aspect-[4/5]`}
        />
        <div
          className={`${block} aspect-[4/3] rounded-[20px] lg:aspect-[4/5]`}
        />
      </div>

      <span className="sr-only">Loading latest stories…</span>
    </div>
  );
}

/* Compact on mobile and tablet, tall portrait on desktop */
function EditorialImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="group min-w-0 overflow-hidden rounded-[18px] border border-black/10 bg-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 lg:rounded-[24px]">
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1023px) 45vw, 220px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </div>
    </div>
  );
}

/* "Thoughtful brand visibility." split into words so each can
   take its turn in the highlight cadence. */
function CadenceHeadline({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((word, position) => (
          <span key={`${word}-${position}`}>
            <span
              className={styles.word}
              style={{ "--w": position } as CSSProperties}
            >
              {word}
            </span>
            {position < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

export default function Hero() {
  const loader = useGlobalLoader();
  const loaderRef = useRef(loader);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    const controller = new AbortController();

    let cancelled = false;
    let released = false;

    const { start, stop } = loaderRef.current;

    function releaseLoader() {
      if (released) return;
      released = true;
      stop();
    }


    start();
    setLoading(true);
    setError("");

    async function fetchPosts() {
      try {
        const path =
          "/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed=1";

        const data: unknown = await fetchPostsReliably(path, controller.signal);

        if (!Array.isArray(data)) {
          throw new Error("Invalid WordPress response.");
        }

        const posts = data.filter(isPost);

        if (!posts.length) {
          throw new Error("No posts returned.");
        }

        const mappedSlides: Slide[] = posts
          .slice(0, 4)
          .map((post, position) => {
            const title =
              cleanWpText(post.title?.rendered) || "Untitled";

            return {
              tag: getWpCategoryName(post),
              title,
              excerpt: truncateText(
                cleanWpText(post.excerpt?.rendered),
                180,
              ),
              href: `/essays/${encodeURIComponent(post.slug)}`,
              image: getFeaturedImage(post, "large"),
              alt: title,
              featured: position === 0,
            };
          });

        const recentPosts =
          posts.length > 4
            ? posts.slice(4, 10)
            : posts.slice(1);

        const mappedThoughts: Thought[] = recentPosts.map(
          (post) => ({
            tag: getWpCategoryName(post),
            title:
              cleanWpText(post.title?.rendered) || "Untitled",
            image: getFeaturedImage(post, "medium"),
            href: `/essays/${encodeURIComponent(post.slug)}`,
          }),
        );

        if (cancelled) return;

        setSlides(mappedSlides);
        setThoughts(mappedThoughts);
        setIndex(0);
      } catch (requestError) {
        if (cancelled || controller.signal.aborted) return;

        console.error(
          "[HERO]",
          requestError instanceof Error
            ? requestError.message
            : "Unable to load stories.",
        );

        setError(
          "Latest stories are temporarily unavailable. Showing selected reading.",
        );

        setSlides(fallbackSlides);
        setThoughts(fallbackThoughts);
        setIndex(0);
      } finally {
        releaseLoader();

        if (!cancelled) setLoading(false);
      }
    }

    void fetchPosts();

    return () => {
      cancelled = true;
      controller.abort();
      releaseLoader();
    };
  }, [attempt]);

  const ordered = useMemo(() => {
    const featured =
      slides.find((slide) => slide.featured) ?? slides[0];

    if (!featured) return fallbackSlides;

    return [
      featured,
      ...slides.filter((slide) => slide !== featured),
    ];
  }, [slides]);

  useEffect(() => {
    if (loading || !playing || ordered.length <= 1) return;

    const timer = window.setInterval(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (
        reducedMotion ||
        document.hidden ||
        hoveringRef.current ||
        focusedRef.current
      ) {
        return;
      }

      setIndex((current) => (current + 1) % ordered.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [loading, playing, ordered.length]);

  const active = ordered[index] ?? ordered[0];

  function chooseSlide(position: number) {
    setIndex(position);
    setPlaying(false);
  }

  function moveSlide(direction: -1 | 1) {
    setIndex(
      (current) =>
        (current + direction + ordered.length) %
        ordered.length,
    );

    setPlaying(false);
  }

  const controlClass = `flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white/70 text-[#191b19] transition hover:border-[#827c5b] hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/15 dark:bg-[#101210]/60 dark:text-[#e7e9df] dark:hover:bg-[#1b1e1a] ${FOCUS}`;

  return (
    <section
      id="journal"
      aria-labelledby="journal-heading"
      className="relative isolate scroll-mt-20 overflow-hidden bg-[#eeeee7] text-[#191b19] dark:bg-[#101210] dark:text-[#e7e9df]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 md:py-12 lg:px-12 lg:py-16">
        <header className="mb-9 grid min-w-0 gap-5 border-b border-black/15 pb-7 dark:border-white/15 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:items-end lg:pb-10">
          <div className="min-w-0">
            <p className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] ${ACCENT_TEXT}`}>
              Daddieshinor Journal
            </p>
            <h2 id="journal-heading" className="text-[clamp(2rem,9vw,5rem)] font-semibold leading-[1.06] tracking-[-0.055em]">
              <span className="block sm:inline">Read. Think.</span>{" "}
              <span className={`block sm:inline ${ACCENT_TEXT}`}>Grow.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-sm leading-7 text-black/65 dark:text-white/65 sm:text-base">
            Independent perspectives on technology, culture, branding and life.
          </p>
        </header>

        {loading ? (
          <HeroSkeleton />
        ) : (
          <>
            {error && (
              <div
                role="status"
                className="mb-7 flex flex-col justify-between gap-3 rounded-xl border border-[#827c5b]/30 bg-white/70 px-4 py-3 text-xs leading-6 text-black/65 dark:bg-[#101210]/70 dark:text-white/70 sm:flex-row sm:items-center"
              >
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    setAttempt((current) => current + 1)
                  }
                  className={`w-fit shrink-0 rounded-full bg-[#c3bb61] px-5 py-2.5 font-bold text-[#171913] shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 ${FOCUS}`}
                >
                  Try again
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-6 xl:gap-9">
              {/* LEFT: Featured story */}
              <div
                className="min-w-0 lg:col-span-6"
                onMouseEnter={() => {
                  hoveringRef.current = true;
                }}
                onMouseLeave={() => {
                  hoveringRef.current = false;
                }}
                onFocusCapture={() => {
                  focusedRef.current = true;
                }}
                onBlurCapture={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget,
                    )
                  ) {
                    focusedRef.current = false;
                  }
                }}
              >
                <div className="mb-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex max-w-full flex-wrap items-center gap-2.5 rounded-full border border-black/10 bg-white/75 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] dark:border-white/15 dark:bg-[#101210]/70">
                    Featured story

                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#827c5b]"
                    />

                    <span className={ACCENT_TEXT}>
                      {active.tag}
                    </span>
                  </span>

                  {ordered.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSlide(-1)}
                        className={controlClass}
                        aria-label="Previous featured story"
                      >
                        <ArrowIcon left />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveSlide(1)}
                        className={controlClass}
                        aria-label="Next featured story"
                      >
                        <ArrowIcon />
                      </button>
                    </div>
                  )}
                </div>

                {/* key remounts on slide change so the text settles in */}
                <div
                  key={active.href}
                  className={styles.settle}
                  aria-live={playing ? "off" : "polite"}
                >
                  <Link
                    href={active.href}
                    className={`group block rounded-sm focus-visible:outline-offset-4 ${FOCUS}`}
                  >
                    <h2
                      id="featured-heading"
                      className="text-[clamp(1.85rem,7.6vw,2.8rem)] font-semibold leading-[1.1] tracking-[-0.045em] [overflow-wrap:anywhere] transition-colors group-hover:text-[#827c5b] dark:group-hover:text-[#c3bb61] sm:text-[2.8rem] lg:text-[3rem] xl:text-[3.65rem]"
                    >
                      {active.title}
                    </h2>

                    {active.excerpt && (
                      <p className="mt-5 max-w-[56ch] text-[15px] leading-7 text-black/70 dark:text-white/70 sm:text-base sm:leading-8">
                        {active.excerpt}
                      </p>
                    )}
                  </Link>
                </div>

                <div className="relative mt-7 overflow-hidden rounded-[22px] border border-black/10 bg-[#c9ccc5] shadow-[0_14px_40px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-[#181b17] dark:shadow-[0_14px_40px_rgba(0,0,0,0.3)] sm:rounded-[26px]">
                  <Link
                    href={active.href}
                    aria-label={`Read ${active.title}`}
                    className="group relative block aspect-[16/10] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                  >
                    <Image
                      key={active.image}
                      src={active.image}
                      alt={active.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1023px) 100vw, (max-width: 1400px) 50vw, 660px"
                      className={`object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none ${styles.settle}`}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"
                    />

                    <div className={`absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 p-4 text-white sm:p-6 ${ordered.length > 1 ? "pb-24 sm:pb-24" : ""}`}>
                      <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">
                        {active.tag}
                      </span>

                      <span className="inline-flex items-center gap-2 text-xs font-medium">
                        Read full story
                        <ArrowIcon />
                      </span>
                    </div>
                  </Link>

                  {/* Controls sit outside the story link */}
                  {ordered.length > 1 && (
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/50 px-3 py-1.5 text-white backdrop-blur-md sm:inset-x-5 sm:bottom-5">
                      <div
                        role="group"
                        aria-label="Choose featured story"
                        className="flex items-center"
                      >
                        {ordered.map((slide, position) => (
                          <button
                            key={slide.href}
                            type="button"
                            onClick={() => chooseSlide(position)}
                            aria-label={`Show ${slide.title}`}
                            aria-pressed={position === index}
                            className="flex h-11 min-w-8 items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                          >
                            <span
                              aria-hidden="true"
                              className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${
                                position === index
                                  ? "w-6 bg-[#c3bb61]"
                                  : "w-1.5 bg-white/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPlaying((current) => !current)
                        }
                        aria-label={
                          playing
                            ? "Pause featured story rotation"
                            : "Play featured story rotation"
                        }
                        className="min-h-11 shrink-0 rounded-lg px-2 text-[11px] font-medium text-white/85 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                      >
                        {playing ? "Pause" : "Play"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: Recent Thoughts */}
              <div className="min-w-0 lg:col-span-4">
                <div className="mb-6 flex min-h-11 items-end justify-between gap-3">
                  <div>
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${ACCENT_TEXT}`}
                    >
                      Fresh reading
                    </p>

                    <h2 className="mt-2 text-[27px] font-semibold leading-tight tracking-[-0.035em] xl:text-[30px]">
                      Recent thoughts
                    </h2>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mb-2 h-[3px] w-9 shrink-0 rounded-full bg-[#827c5b]/70"
                  />
                </div>

                <div className="border-y border-black/10 py-2 dark:border-white/10 lg:py-3">
                  <div
                    role="region"
                    aria-label="Recent thoughts"
                    tabIndex={0}
                    className={`outline-none lg:overflow-y-auto lg:overscroll-y-contain lg:pr-2 [scrollbar-color:#827c5b80_transparent] [scrollbar-width:thin] lg:max-h-[640px] ${FOCUS}`}
                  >
                    {thoughts.length ? (
                      <div className="divide-y divide-black/10 dark:divide-white/10">
                        {thoughts.map((thought) => (
                          <div
                            key={thought.href}
                            className="min-w-0 py-5 first:pt-1 last:pb-1"
                          >
                            <ThoughtItem
                              tag={thought.tag}
                              title={thought.title}
                              image={thought.image}
                              href={thought.href}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-5 text-sm leading-7 text-black/55 dark:text-white/55">
                        More thoughts will appear here as they are
                        published.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: partnership first on mobile, then a compact
                  image pair. On desktop: image, card, image. */}
              <aside
                aria-label="Daddieshinor and partnerships"
                className="grid min-w-0 grid-cols-2 gap-4 sm:gap-5 lg:col-span-2 lg:flex lg:flex-col"
              >
                <div
                  className={`${styles.partner} relative order-first col-span-2 min-w-0 overflow-hidden rounded-[20px] border border-[#827c5b]/30 bg-white/75 p-5 shadow-[0_8px_26px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-[#827c5b]/40 dark:bg-[#101210]/75 lg:order-none lg:col-span-1 lg:rounded-[24px] lg:p-4 xl:p-5`}
                >
                  <span
                    aria-hidden="true"
                    className={styles.sweep}
                  />

                  <p
                    className={`flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${ACCENT_TEXT}`}
                  >
                    <span
                      aria-hidden="true"
                      className={styles.beacon}
                    />
                    Partnership
                  </p>

                  <h3 className="mt-4 text-lg font-semibold leading-[1.25] tracking-[-0.025em]">
                    <CadenceHeadline text="Thoughtful brand visibility." />
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-black/65 dark:text-white/65">
                    Reach readers through considered placements
                    and collaborations.
                  </p>

                  <Link
                    href="/partnerships"
                    className={`mt-5 inline-flex min-h-10 items-center gap-2 rounded-sm text-xs font-semibold leading-5 transition hover:text-black dark:hover:text-white ${ACCENT_TEXT} ${FOCUS} focus-visible:outline-offset-4`}
                  >
                    <span>Explore partnerships</span>
                    <span className={styles.nudge}>
                      <ArrowIcon />
                    </span>
                  </Link>
                </div>

                <EditorialImage
                  src="/images/daddieshinor.jpg"
                  alt="Daddieshinor editorial visual"
                />

                <EditorialImage
                  src="/images/premium_photo-1742995782977-ee4b53fecad.png"
                  alt="Daddieshinor editorial photography"
                />
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
