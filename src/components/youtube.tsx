"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Play, X } from "lucide-react";
import styles from "./youtube.module.css";

type YouTubeEmbedProps = {
  urlOrId: string;
  start?: number;
  title?: string;
  description?: string;
  className?: string;
};

function extractVideoId(input: string): string | null {
  const valid = (value: string | null) => value && /^[a-zA-Z0-9_-]{11}$/.test(value) ? value : null;
  if (valid(input.trim())) return input.trim();
  try {
    const url = new URL(input.trim());
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return valid(url.pathname.split("/")[1]);
    if (!["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) return null;
    return valid(url.searchParams.get("v")) || valid(url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null);
  } catch { return null; }
}

export default function YouTubeEmbed({
  urlOrId,
  start,
  title = "From the screen",
  description = "A pause from the page. Watch, listen, and take a different view.",
  className = "",
}: YouTubeEmbedProps) {
  const videoId = extractVideoId(urlOrId);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [failedThumbnail, setFailedThumbnail] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const playing = !!videoId && playingId === videoId;

  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);

  if (!videoId) return null;

  const params = new URLSearchParams({ rel: "0", playsinline: "1", autoplay: "1" });
  if (typeof start === "number" && Number.isFinite(start) && start >= 0) {
    params.set("start", String(Math.floor(start)));
  }
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const close = () => {
    setPlayingId(null);
    requestAnimationFrame(() => trigger.current?.focus());
  };

  return (
    <section className={`${styles.section} ${className}`} aria-label={title} data-editorial-reveal>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Daddieshinor / In motion</p>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        <a href={watchUrl} target="_blank" rel="noopener noreferrer" className={styles.external}>
          Open on YouTube <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <div className={styles.media}>
        <div className={styles.frame}>
          {playing ? (
            <iframe
              ref={player}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className={styles.iframe}
            />
          ) : (
            <button ref={trigger} type="button" onClick={() => setPlayingId(videoId)} className={styles.preview} aria-label={`Play ${title}`}>
              <Image
                src={failedThumbnail === videoId ? "/fallback.jpg" : `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                fill
                sizes="(max-width: 767px) 90vw, 500px"
                className={styles.thumbnail}
                onError={() => setFailedThumbnail(videoId)}
              />
              <span className={styles.shade} aria-hidden="true" />
              <span className={styles.play} aria-hidden="true"><Play size={22} fill="currentColor" /></span>
              <span className={styles.watch}>Press play <ArrowUpRight size={15} aria-hidden="true" /></span>
            </button>
          )}
        </div>
        <div className={styles.caption}>
          <span>{playing ? "Now playing" : "Watch on your own terms"}</span>
          {playing && <button type="button" onClick={close} className={styles.close}><X size={14} aria-hidden="true" /> Close player</button>}
        </div>
      </div>
    </section>
  );
}
