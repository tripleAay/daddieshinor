"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

type YouTubeEmbedProps = {
  /** YouTube URL or video ID */
  urlOrId: string;
  /** Optional start time in seconds */
  start?: number;
  /** Optional title for accessibility & tooltip */
  title?: string;
  /** Optional className for size/position tweaks */
  className?: string;
};

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1) || null;
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    return embedMatch?.[1] || null;
  } catch {
    return null;
  }
}

export default function YouTubeEmbed({
  urlOrId,
  start,
  title = "Embedded YouTube video",
  className,
}: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = useMemo(() => extractVideoId(urlOrId), [urlOrId]);

  if (!videoId) {
    return null;
  }

  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      autoplay: "1",
      enablejsapi: "1", // optional: allows future JS control if needed
    });

    if (start != null && start >= 0) {
      params.set("start", start.toString());
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  }, [videoId, start]);

  const handlePlay = () => setIsPlaying(true);
  const handleClose = () => setIsPlaying(false);

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-zinc-950 shadow-2xl ring-1 ring-zinc-800/60
        transition-all duration-500
        hover:ring-[#968e68]/40 hover:shadow-[#968e68]/10
        ${className}
      `}
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* Thumbnail + overlay - shown when not playing */}
      {!isPlaying && (
        <>
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover brightness-[0.85] transition-all duration-700 group-hover:brightness-100"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
            quality={85}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent/20 transition-opacity group-hover:opacity-90" />

          {/* Large centered play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlay}
              className="
                flex h-24 w-24 items-center justify-center rounded-full
                bg-black/50 backdrop-blur-md border border-white/20
                text-white transition-all duration-400
                hover:scale-110 hover:bg-[#968e68]/80 hover:border-[#968e68]/40
                active:scale-95
              "
              aria-label="Play video"
            >
              <Play className="h-14 w-14" fill="white" />
            </button>
          </div>
        </>
      )}

      {/* Video player + close button */}
      {isPlaying && (
        <>
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
          />

          {/* Close / Return to thumbnail button */}
          <button
            onClick={handleClose}
            className="
              absolute top-4 right-4 z-20
              flex h-10 w-10 items-center justify-center rounded-full
              bg-black/60 backdrop-blur-md border border-white/20 text-white
              transition-all hover:bg-black/80 hover:scale-110 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-[#968e68]/70
            "
            aria-label="Close video and return to thumbnail"
          >
            <X className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Invisible click layer when not playing */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label="Play video"
        />
      )}
    </div>
  );
}