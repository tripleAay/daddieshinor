// components/SongsSection.tsx
import Image from "next/image";
import Link from "next/link";

type SongDrop = {
  slug: string;
  title: string;
  angle: string; // Daddieshinor-style “what this song means”
  artist: string;
  mood: "Hype" | "Soft" | "Street" | "Late Night" | "Classic";
  cover: string;
  alt: string;
  featured?: boolean;
};

const songs: SongDrop[] = [
  {
    slug: "/songs/eri-ama-elizzy",
    title: "Afrobeats Meets Edo Culture on “Eri Ama”",
    angle: "A reminder that sound is identity — tradition can still move like a hit.",
    artist: "Elizzy",
    mood: "Hype",
    cover: "/songs/elizy-eri-ama.jpg",
    alt: "Elizzy cover image for Eri Ama — afrobeats with Edo cultural vibe",
    featured: true,
  },
  {
    slug: "/songs/come-chop-keltony",
    title: "Keltony’s “Come Chop” is the kind of groove your bills can’t disturb",
    angle: "Playful, hungry, and clean — it sounds like small wins stacking up.",
    artist: "Keltony",
    mood: "Street",
    cover: "/songs/keltony-come-chop.jpg",
    alt: "Keltony cover image for Come Chop",
  },
  {
    slug: "/songs/igboro-boy-spyce",
    title: "Boy Spyce opens the year with “Igboro” — calm confidence, no shouting",
    angle: "This is what quiet swagger sounds like: soft, steady, and sure.",
    artist: "Boy Spyce",
    mood: "Late Night",
    cover: "/songs/boy-spyce-igboro.jpg",
    alt: "Boy Spyce cover image for Igboro",
  },
  {
    slug: "/songs/motho-waka-ladipoe-maglera",
    title: "LADIPOE x Maglera: “Motho Waka” sounds like ambition with teeth",
    angle: "Pen-to-paper energy — the type of record that makes you sit up straight.",
    artist: "LADIPOE & Maglera Doe Boy",
    mood: "Hype",
    cover: "/songs/ladipoe-motho-waka.jpg",
    alt: "LADIPOE and Maglera Doe Boy cover image for Motho Waka",
  },
  {
    slug: "/songs/where-you-dey-simi-chike",
    title: "Simi & Chike on “Where You Dey” — love with grown-up honesty",
    angle: "Not dramatic. Not needy. Just two voices telling the truth gently.",
    artist: "Simi & Chike",
    mood: "Soft",
    cover: "/songs/simi-chike-where-you-dey.jpg",
    alt: "Simi and Chike cover image for Where You Dey",
  },
  {
    slug: "/songs/my-healer-seyi-vibez-omah-lay",
    title: "Seyi Vibez x Omah Lay: “MY HEALER” feels like pain turning into power",
    angle: "This is the sound of healing — but still keeping your edge.",
    artist: "Seyi Vibez & Omah Lay",
    mood: "Street",
    cover: "/songs/seyi-vibez-omah-lay-my-healer.jpg",
    alt: "Seyi Vibez and Omah Lay cover image for MY HEALER",
  },
];

function MoodPill({ mood }: { mood: SongDrop["mood"] }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur">
      {mood}
    </span>
  );
}

export default function SongsSection() {
  const featured = songs.find((s) => s.featured) ?? songs[0];
  const rest = songs.filter((s) => s.slug !== featured.slug);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-black dark:text-white md:text-5xl">
              Songs
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Not just “new music” — the feeling behind the sound. What it says about us.
            </p>
          </div>

          <Link
            href="/songs"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-bold text-black transition
                       hover:border-zinc-300 hover:bg-zinc-50
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                       dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-950
                       dark:focus-visible:ring-offset-black"
          >
            More
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mb-10 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Featured */}
          <article className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition hover:shadow-[0_18px_55px_rgba(0,0,0,0.14)]
                             dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <Link
              href={featured.slug}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
              aria-label={featured.title}
            >
              <div className="relative aspect-[4/5] overflow-hidden md:aspect-[3/4] lg:aspect-[4/5]">
                <Image
                  src={featured.cover}
                  alt={featured.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Subtle sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none">
                  <div className="absolute -top-24 left-1/2 h-48 w-[140%] -translate-x-1/2 rotate-6 bg-white/10 blur-2xl" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <MoodPill mood={featured.mood} />
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/90">
                    {featured.artist}
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-3 text-2xl font-extrabold leading-tight text-white transition-colors group-hover:text-orange-300 md:text-3xl">
                  {featured.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm font-medium text-zinc-200/90">
                  {featured.angle}
                </p>

                <p className="mt-4 text-sm font-bold text-white/90">
                  Tap to read the breakdown <span aria-hidden>→</span>
                </p>
              </div>
            </Link>
          </article>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-6">
            {rest.map((item) => (
              <article
                key={item.slug}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-lg
                           dark:border-zinc-800 dark:bg-zinc-950"
              >
                <Link
                  href={item.slug}
                  className="flex flex-col gap-5 md:flex-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black"
                  aria-label={item.title}
                >
                  <div className="relative h-52 w-full shrink-0 overflow-hidden md:h-auto md:w-1/2 lg:w-2/5">
                    <Image
                      src={item.cover}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-100" />
                  </div>

                  <div className="flex flex-1 flex-col justify-center p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <MoodPill mood={item.mood} />
                        <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-zinc-800
                                         dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
                          {item.artist}
                        </span>
                      </div>

                      <span className="hidden text-xs font-semibold text-zinc-500 dark:text-zinc-500 sm:inline">
                        Daddieshinor
                      </span>
                    </div>

                    <h4 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-black transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400 md:text-xl">
                      {item.title}
                    </h4>

                    <p className="mt-2 line-clamp-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      {item.angle}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-zinc-700 transition group-hover:text-black dark:text-zinc-300 dark:group-hover:text-white">
                      Read
                      <span
                        aria-hidden
                        className="transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
