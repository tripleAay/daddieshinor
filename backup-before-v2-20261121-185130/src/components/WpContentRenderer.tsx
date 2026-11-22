"use client";

import { useEffect, useRef } from "react";

type Props = {
  html: string;
  /** Set to true temporarily to log raw HTML to console for debugging */
  debug?: boolean;
};

// ─── Sanitise: strips dangerous tags but KEEPS iframes, images, video ────────
function sanitize(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*(?:\/?>|>[\s\S]*?<\/embed>)/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "");
}

// ─── Fix image URLs: make relative URLs absolute ──────────────────────────────
function fixImageUrls(html: string): string {
  const base =
  process.env.NEXT_PUBLIC_WP_URL || "https://api.daddieshinor.com";
  // Fix src="//..." → src="https://..."
  return html
    .replace(/src="\/\/([^"]+)"/g, `src="https://$1"`)
    .replace(/src='\/\/([^']+)'/g, `src='https://$1'`)
    // Fix src="/wp-content/..." → absolute
    .replace(/src="(\/wp-[^"]+)"/g, `src="${base}$1"`)
    .replace(/src='(\/wp-[^']+)'/g, `src='${base}$1'`);
}

export default function WpContentRenderer({ html, debug = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const cleanHtml = fixImageUrls(sanitize(html));

  // Debug: log the raw HTML so you can inspect what WP actually sends
  useEffect(() => {
    if (debug) {
      console.group("WpContentRenderer — raw HTML");
      console.log(cleanHtml);
      console.groupEnd();
    }
  }, [cleanHtml, debug]);

  useEffect(() => {
    if (!ref.current) return;

    // ── 1. Fix Jetpack / lazy-load: move data-src → src on images ────────────
    ref.current.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((img) => {
      const real = img.getAttribute("data-src");
      if (real) {
        img.src = real;
        img.removeAttribute("data-src");
        img.removeAttribute("data-load-mode");
        img.classList.remove("lazyload", "lazyloading", "lazyloaded");
      }
    });

    // ── 2. Fix Jetpack lazy-load iframes: data-src → src ─────────────────────
    ref.current.querySelectorAll<HTMLIFrameElement>("iframe[data-src]").forEach((iframe) => {
      const real = iframe.getAttribute("data-src");
      if (real) {
        iframe.src = real;
        iframe.removeAttribute("data-src");
      }
    });

    // ── 3. Make video iframes responsive 16:9 ────────────────────────────────
    ref.current.querySelectorAll<HTMLIFrameElement>("iframe").forEach((iframe) => {
      // Skip if already wrapped
      if (iframe.parentElement?.dataset.videoWrapped) return;

      const src = iframe.src || iframe.getAttribute("data-src") || "";
      const isVideoEmbed =
        src.includes("youtube.com") ||
        src.includes("youtu.be") ||
        src.includes("vimeo.com") ||
        src.includes("dailymotion.com") ||
        !!iframe.closest(".wp-block-embed, .jetpack-video-wrapper");

      if (!isVideoEmbed) return;

      const wrap = document.createElement("div");
      wrap.dataset.videoWrapped = "true";
      wrap.style.cssText =
        "position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:2rem 0;";
      iframe.parentNode?.insertBefore(wrap, iframe);
      wrap.appendChild(iframe);
      iframe.style.cssText =
        "position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:12px;";
    });

    // ── 4. Handle WP embed block wrappers ────────────────────────────────────
    ref.current
      .querySelectorAll<HTMLElement>(".wp-block-embed__wrapper")
      .forEach((wrapper) => {
        if (wrapper.dataset.videoWrapped) return;
        wrapper.dataset.videoWrapped = "true";
        wrapper.style.cssText =
          "position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;";
        const iframe = wrapper.querySelector("iframe");
        if (iframe) {
          iframe.style.cssText =
            "position:absolute;top:0;left:0;width:100%;height:100%;border:none;";
        }
      });
  }, [cleanHtml]);

  return (
    <>
      <style>{`
        /* ── Base prose container ── */
        .wp-post-body {
          font-size: 1rem;
          line-height: 1.75;
          color: inherit;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        /* ── Paragraphs ── */
        .wp-post-body p {
          margin: 0 0 1.5em;
          text-align: justify;
        }

        /* ── Drop cap on first paragraph ── */
        .wp-post-body > p:first-of-type::first-letter {
          float: left;
          font-size: 3.8rem;
          font-weight: 900;
          line-height: 0.8;
          margin-right: 0.1em;
          margin-top: 0.08em;
          color: #ea580c;
        }
        .dark .wp-post-body > p:first-of-type::first-letter {
          color: #fb923c;
        }

        /* ── Headings ── */
        .wp-post-body h1,
        .wp-post-body h2,
        .wp-post-body h3,
        .wp-post-body h4,
        .wp-post-body h5,
        .wp-post-body h6 {
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin: 2em 0 0.6em;
        }
        .wp-post-body h2 { font-size: 1.6rem; }
        .wp-post-body h3 { font-size: 1.3rem; }
        .wp-post-body h4 { font-size: 1.1rem; }

        /* ── Links ── */
        .wp-post-body a {
          color: #ea580c;
          text-decoration: none;
        }
        .wp-post-body a:hover { text-decoration: underline; }
        .dark .wp-post-body a { color: #fb923c; }

        /* ── ALL images — the key rules ── */
        .wp-post-body img {
          display: block;
          max-width: 100% !important;
          width: 100% !important;
          height: auto !important;
          border-radius: 12px;
          margin: 2rem auto;
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
          object-fit: cover;
        }

        /* ── WP block image figure ── */
        .wp-post-body figure,
        .wp-post-body .wp-block-image {
          margin: 2rem 0;
          width: 100% !important;
          max-width: 100% !important;
        }
        .wp-post-body figure img,
        .wp-post-body .wp-block-image img {
          margin: 0 auto 0.5rem;
        }
        .wp-post-body figcaption {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(0,0,0,0.5);
          margin-top: 0.5rem;
        }
        .dark .wp-post-body figcaption { color: rgba(255,255,255,0.45); }

        /* ── Kill WP float layouts — stack on all screens ── */
        .wp-post-body .alignleft,
        .wp-post-body .alignright,
        .wp-post-body .aligncenter,
        .wp-post-body .alignwide,
        .wp-post-body .alignfull {
          float: none !important;
          margin-left: auto !important;
          margin-right: auto !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        /* ── Blockquote ── */
        .wp-post-body blockquote,
        .wp-post-body .wp-block-quote {
          border-left: 4px solid #ea580c;
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          background: rgba(234,88,12,0.05);
          border-radius: 0 8px 8px 0;
        }

        /* ── Code ── */
        .wp-post-body pre { overflow-x: auto; border-radius: 8px; }
        .wp-post-body code { font-size: 0.875em; border-radius: 4px; }

        /* ── Lists ── */
        .wp-post-body ul { list-style: disc; padding-left: 1.5rem; margin: 1em 0; }
        .wp-post-body ol { list-style: decimal; padding-left: 1.5rem; margin: 1em 0; }
        .wp-post-body li { margin-bottom: 0.4em; }

        /* ── WP embed / video wrapper ── */
        .wp-post-body .wp-block-embed {
          margin: 2rem 0;
        }

        /* ── Horizontal rule ── */
        .wp-post-body hr {
          border: none;
          border-top: 1px solid rgba(0,0,0,0.1);
          margin: 2.5rem 0;
        }
        .dark .wp-post-body hr { border-color: rgba(255,255,255,0.1); }
      `}</style>

      <div
        ref={ref}
        className="wp-post-body"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
        suppressHydrationWarning
      />
    </>
  );
}
