"use client";

const ITEMS = [
  "Not here to be loud — here to leave something that stays with you.",
  "Some words are not meant to impress you; they are meant to return you to yourself.",
  "Small moves. Deep thoughts. Quiet fire. That is how real things are built.",
  "Daddieshinor Letters — for the ones who still believe meaning matters.",
  "This is a place for culture, hustle, memory, travel, and the truths we carry quietly.",
  "If something here touched your heart, stay with it a little longer — that is how perspective begins.",
  "Grateful for every soul who passes through these words; in a fast world, your attention means everything.",
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
        bg-zinc-50/80
        backdrop-blur-md
        dark:border-white/10
        dark:bg-black/70
      "
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative h-10 overflow-hidden">
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