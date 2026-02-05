// components/YouTubeEmbed.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type YouTubeEmbedProps = {
  /** YouTube URL or video ID */
  urlOrId: string;
  /** Optional start time in seconds */
  start?: number;
  /** Optional className for size/position tweaks */
  className?: string;
};

/**
 * Extracts 11-char YouTube video ID from URL or direct ID
 */
function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.slice(1);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch?.[1]) return embedMatch[1];
    return null;
  } catch {
    return null;
  }
}

export default function YouTubeEmbed({
  urlOrId,
  start,
  className,
}: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const videoId = useMemo(() => extractVideoId(urlOrId), [urlOrId]);

  const thumbnail = useMemo(() => {
    if (!videoId) return null;
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }, [videoId]);

  const embedUrl = useMemo(() => {
    if (!videoId) return "";

    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      autoplay: "1", // only when user clicks
    });

    if (start != null && start >= 0) {
      params.set("start", start.toString());
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, start]);

  if (!videoId) {
    return null; // silent fail — no broken UI
  }

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-zinc-950 shadow-xl ring-1 ring-zinc-800/80
        transition-all duration-500 hover:ring-[#968e68]/30
        ${className}
      `}
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* Thumbnail (shown before play) */}
      {!playing && thumbnail && (
        <>
          <Image
            src={thumbnail}
            alt="Video thumbnail"
            fill
            className="object-cover opacity-90 transition-opacity duration-700 group-hover:opacity-100"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

          {/* Subtle play icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-black/60">
              <Play className="h-10 w-10 text-white/90 transition-transform group-hover:scale-110" fill="white" />
            </div>
          </div>
        </>
      )}

      {/* Iframe (only after click) */}
      {playing && (
        <iframe
          src={embedUrl}
          title="Embedded YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
        />
      )}

      {/* Click area */}
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Play embedded video"
      />
    </div>
  );
}