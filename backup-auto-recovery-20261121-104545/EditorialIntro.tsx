"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import styles from "./EditorialIntro.module.css";

/* One place to control how many stories the panel shows. */
const MAX_POSTS = 5;

type WordPressPost = {
  id: number;
  slug: string;
  title?: {
    rendered?: string;
  };
  _embedded?: {
    "wp:term"?: {
      taxonomy?: string;
      name?: string;
    }[][];
  };
};

type Headline = {
  id: number;
  number: string;
  title: string;
  category: string;
  href: string;
};

const pad = (value: number) => String(value).padStart(2, "0");

function cleanWpText(value: unknown): string {
  if (typeof value !== "string") return "";

  const document = new DOMParser().parseFromString(
    value,
    "text/html"
  );

  document
    .querySelectorAll("script, style, noscript")
    .forEach((element) => element.remove());

  return (document.body.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

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
    post.slug.trim().length > 0
  );
}

function getCategory(post: WordPressPost): string {
  const terms = (
    post._embedded?.["wp:term"] ?? []
  ).flat();

  const category = terms.find(
    (term) => term.taxonomy === "category"
  );

  return cleanWpText(category?.name) || "Journal";
}

function mapHeadline(
  post: WordPressPost,
  index: number
): Headline {
  return {
    id: post.id,
    number: pad(index + 1),
    title:
      cleanWpText(post.title?.rendered) || "Untitled",
    category: getCategory(post),
    href: `/essays/${encodeURIComponent(post.slug)}`,
  };
}

/* Splits text into words > characters so CSS can stagger each letter.
   Words stay unbroken, so the title still wraps naturally. */
function Chars({ text }: { text: string }) {
  const words = text.split(" ");
  let index = 0;

  return (
    <>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className={styles.word} aria-hidden="true">
            {Array.from(word).map((char) => {
              const i = index++;

              return (
                <span
                  key={i}
                  className={styles.char}
                  style={{ "--i": i } as CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

function EditorialHeadlines() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    let cancelled = false;

    const timeout = window.setTimeout(
      () => controller.abort(),
      20000
    );

    async function fetchHeadlines() {
      try {
        setLoading(true);
        setError("");

        const path = `/wp-json/wp/v2/posts?per_page=${MAX_POSTS}&orderby=date&order=desc&_embed=1`;

        const response = await fetch(
          `/api/wp-proxy?path=${encodeURIComponent(path)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `WordPress request failed: ${response.status}`
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid WordPress response.");
        }

        const mapped = data
          .filter(isPost)
          .slice(0, MAX_POSTS)
          .map(mapHeadline);

        if (cancelled) return;

        setHeadlines(mapped);
      } catch (requestError) {
        if (cancelled) return;

        console.error(
          "[EDITORIAL HEADLINES]",
          requestError instanceof Error
            ? requestError.message
            : "Unable to load headlines."
        );

        setError(
          "Our latest stories are temporarily unavailable."
        );
      } finally {
        window.clearTimeout(timeout);

        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchHeadlines();

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt]);

  return (
    <aside
      className={styles.headlines}
      aria-label="Latest Daddieshinor stories"
    >
      <div className={styles.headlinesHeader}>
        <div>
          <span className={styles.headlinesEyebrow}>
            The journal
          </span>

          <h2 className={styles.headlinesTitle}>
            Worth your attention.
          </h2>
        </div>

        <span className={styles.headlinesCount}>
          {loading
            ? "..."
            : `${pad(headlines.length)} / ${pad(MAX_POSTS)}`}
        </span>
      </div>

      {loading ? (
        <div
          className={styles.headlinesList}
          role="status"
          aria-label="Loading latest stories"
        >
          {Array.from({ length: MAX_POSTS }).map((_, index) => (
            <div
              className={styles.headlineSkeleton}
              key={index}
            >
              <span />
              <div>
                <span />
                <span />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.headlinesError}>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again <span aria-hidden="true">↗</span>
          </button>
        </div>
      ) : headlines.length > 0 ? (
        <>
          <ol className={styles.headlinesList}>
            {headlines.map((headline, index) => (
              <li
                className={styles.headlineItem}
                key={headline.id}
                style={{ "--i": index } as CSSProperties}
              >
                <Link
                  href={headline.href}
                  className={styles.headlineLink}
                >
                  <span className={styles.headlineNumber}>
                    {headline.number}
                  </span>

                  <span className={styles.headlineContent}>
                    <span className={styles.headlineCategory}>
                      {headline.category}
                    </span>

                    <span className={styles.headlineText}>
                      {headline.title}
                    </span>
                  </span>

                  <span
                    className={styles.headlineArrow}
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            href="/essays"
            className={styles.exploreJournal}
          >
            <span>Explore the journal</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </>
      ) : (
        <div className={styles.headlinesEmpty}>
          <p>New perspectives are on the way.</p>
          <span>Published stories will appear here.</span>
        </div>
      )}
    </aside>
  );
}

export default function EditorialIntro() {
  return (
    <section
      aria-labelledby="editorial-intro-title"
      className={styles.intro}
    >
      <div
        aria-hidden="true"
        className={styles.background}
      >
        <Image
          src="/images/136708882ecde7327741ae9ac1310694.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.backgroundImage}
        />
      </div>

      <div aria-hidden="true" className={styles.overlay} />
      <div aria-hidden="true" className={styles.grain} />
      <div aria-hidden="true" className={styles.grid} />
      <div aria-hidden="true" className={styles.glow} />

      <div className={styles.inner}>
        <div className={styles.edition}>
          <span>Daddieshinor / Independent thinking</span>
          <span>Tech. Culture. Branding. Life.</span>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.statement}>
            <p className={styles.eyebrow}>
              A different point of view
            </p>

            <h1
              id="editorial-intro-title"
              className={styles.title}
              aria-label="Look closer. Think deeper."
            >
              <span className={styles.line}>
                <span className={styles.lookCloser}>
                  <Chars text="LOOK CLOSER." />
                </span>
              </span>

              <span className={styles.line}>
                <span className={styles.outline}>
                  <Chars text="THINK DEEPER." />
                  <span
                    className={styles.caret}
                    aria-hidden="true"
                  />
                </span>
              </span>
            </h1>

            <p className={styles.description}>
              Technology, culture, brands, and the lives we build
              around them. Stories with something to say.
            </p>
          </div>

          <EditorialHeadlines />
        </div>

        <a href="#journal" className={styles.invitation}>
          <span className={styles.invitationText}>
            <span className={styles.read}>
              Start reading
            </span>

            <span className={styles.scroll}>
              Scroll down. Find your perspective.
            </span>
          </span>

          <span className={styles.arrow}>
            <svg
              viewBox="0 0 120 120"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M60 8v98M17 63l43 43 43-43"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}