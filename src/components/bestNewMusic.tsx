// components/BestNewReads.tsx
import Image from "next/image";
import Link from "next/link";

type Entry = {
  rank: number;
  title: string;
  subtitle: string; // author, theme, or category
  image: string;
  link: string;
  external?: boolean;
};

const entries: Entry[] = [
  {
    rank: 1,
    title: "Speed Stops Impressing You",
    subtitle: "On ambition, patience, and quiet confidence",
    image: "/best-new/speed-stops-impressing-you.jpg",
    link: "/speed-stops-impressing-you",
  },
  {
    rank: 2,
    title: "WhatsApp Wants a Username",
    subtitle: "Identity, privacy, and the future of contact",
    image: "/best-new/whatsapp-username.jpg",
    link: "/whatsapp-username-vs-phone-number-2025",
  },
  {
    rank: 3,
    title: "Why AI Will Reward Thinkers, Not Hustlers",
    subtitle: "The end of noise-driven success",
    image: "/best-new/ai-reward-thinkers.jpg",
    link: "/ai-will-reward-thinkers-not-hustlers",
  },
  {
    rank: 4,
    title: "Your Phone Number Used to Be You",
    subtitle: "How tech quietly rewrites identity",
    image: "/best-new/digital-identity.jpg",
    link: "/digital-identity",
  },
  {
    rank: 5,
    title: "When Growth Becomes Silent",
    subtitle: "Why mature progress makes no noise",
    image: "/best-new/silent-growth.jpg",
    link: "/silent-growth",
  },
];

export default function BestNewReads() {
  return (
    <section className="bg-black text-white py-12 md:py-16">
      <div className="mx-auto max-w-[1440px] px-5">
        {/* Header */}
        <header className="mb-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
            Best New Reads
          </h2>
          <p className="mt-3 max-w-xl text-lg md:text-xl text-zinc-400">
            A weekly curation of essays shaping thought, not trends.
          </p>
          <p className="mt-1 text-sm uppercase tracking-widest text-zinc-500">
            Week of January 29, 2026
          </p>
          <div className="mt-6 h-[2px] w-full bg-white/90" />
        </header>

        {/* Horizontal list */}
        <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          <div className="flex gap-8 min-w-max">
            {entries.map((entry) => {
              const Wrapper = entry.external ? "a" : Link;

              return (
                <Wrapper
                  key={entry.rank}
                  href={entry.link}
                  {...(entry.external && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
                  className="group w-[280px] md:w-[320px] flex-shrink-0"
                >
                  {/* Visual */}
                  <div className="relative aspect-square overflow-hidden rounded-full border-4 border-zinc-800 transition-all duration-300 group-hover:border-orange-500">
                    <Image
                      src={entry.image}
                      alt={entry.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                  </div>

                  {/* Meta */}
                  <div className="mt-6 text-center">
                    <div className="text-6xl font-black leading-none text-zinc-700 transition-colors duration-300 group-hover:text-orange-500">
                      {entry.rank}
                    </div>
                    <h3 className="mt-2 text-xl md:text-2xl font-bold">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-base text-zinc-400">
                      {entry.subtitle}
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
