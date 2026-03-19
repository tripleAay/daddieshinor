"use client";

const ITEMS = [
  "Not here to shout — here to make meaning.",
  "If it touched your heart, give it your time.",
  "Small moves. Deep thoughts. Quiet fire.",
  "Daddieshinor Letters — thoughts worth keeping.",
  "You read this far — thank you for staying.",
  "Eid Mubarak to every Muslim reader today — may your celebration overflow with peace, love, family, laughter, good food, and endless barakah 🤍🕌🌙✨",
  "Happy Easter to everyone celebrating today! May your day be filled with renewal, joy, chocolate eggs, warm gatherings, and new beginnings 🐣🌸🥚✝️",
  "Grateful for every soul who passes through these words.",
];

export default function MarqueeNote() {
  const loop = [...ITEMS, ...ITEMS]; // duplicate for seamless infinite loop

  return (
    <div
      className="
        sticky
        top-[var(--header-height,64px)]
        z-40
        w-full
        border-b border-black/5
        bg-zinc-50/80              // lighter & more subtle (was zinc-60)
        backdrop-blur-md
        dark:border-white/10
        dark:bg-black/70
      "
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative h-10 overflow-hidden">
          {/* Softer fade edges – improved contrast */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-zinc-50/90 to-transparent dark:from-zinc-950/90" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-zinc-50/90 to-transparent dark:from-zinc-950/90" />

          <div className="flex h-full items-center">
            <div
              className="
                marquee flex items-center gap-12 md:gap-20 whitespace-nowrap 
                will-change-transform animate-marquee
              "
            >
              {loop.map((text, i) => (
                <span
                  key={i}
                  className="text-sm md:text-base font-medium tracking-tight text-zinc-800 dark:text-zinc-200"
                >
                  <span className="mx-2.5 inline-block h-1.5 w-1.5 rounded-full bg-[#968e68] align-middle" />
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