"use client";

const ITEMS = [
  "I’m not here to shout — I’m here to make meaning.",
  "If it touched your mind, it deserves your time.",
  "Small moves. Deep thoughts. Quiet consistency.",
  "Daddieshinor Letters: when a thought is worth keeping.",
  "If you read this far, you’re already part of the story.",
];

export default function MarqueeNote() {
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div
      className="
        sticky
        top-[var(--header-height,64px)]
        z-40
        w-full
        border-b border-black/5
        bg-zinc-50/90
        backdrop-blur-md
        dark:border-white/10
        dark:bg-black/70
      "
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative h-10 overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-zinc-50 to-transparent dark:from-black/70" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-zinc-50 to-transparent dark:from-black/70" />

          <div className="flex h-full items-center">
            <div className="marquee flex items-center gap-8 whitespace-nowrap will-change-transform">
              {loop.map((text, i) => (
                <span
                  key={i}
                  className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200"
                >
                  <span className="mx-2 inline-block h-1.5 w-1.5 rounded-full bg-[#968e68] align-middle" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
