// components/NewsSection.tsx
import Image from "next/image";
import Link from "next/link";

type NewsItem = {
  slug: string;
  title: string;
  category: "News" | "Editor’s Pick";
  cover: string;
  alt: string;
  featured?: boolean;
};

const news: NewsItem[] = [
  {
    // Matches your existing post: https://daddieshinor.com/speed-stops-impressing-you/
    slug: "/speed-stops-impressing-you",
    title: "Speed Stops Impressing You: When Growth Starts Looking Quiet",
    category: "Editor’s Pick",
    cover: "/news/speed-stops-impressing-you.jpg",
    alt: "A calm, cinematic image representing slowing down and choosing depth over speed",
    featured: true,
  },
  {
    // Matches your existing post: https://daddieshinor.com/whatsapp-username-vs-phone-number-2025/
    slug: "/whatsapp-username-vs-phone-number-2025",
    title: "WhatsApp Wants Usernames: What We Gain — And What We Lose",
    category: "News",
    cover: "/news/whatsapp-usernames.jpg",
    alt: "A phone screen concept image representing WhatsApp usernames replacing phone numbers",
  },
  {
    // Matches your existing post: https://daddieshinor.com/why-most-african-tech-products-dont-fail-because-of-technology/
    slug: "/why-most-african-tech-products-dont-fail-because-of-technology",
    title: "Why Most African Tech Products Don’t Fail Because of Technology",
    category: "Editor’s Pick",
    cover: "/news/african-tech-products.jpg",
    alt: "A modern African city/tech workspace image representing product building and reality checks",
  },
  {
    slug: "/why-ai-will-reward-thinkers-not-hustlers",
    title: "Why AI Will Reward Thinkers, Not Hustlers",
    category: "News",
    cover: "/news/ai-thinkers.jpg",
    alt: "An abstract AI + human thinking visual representing calm strategy and deep work",
  },
  {
    slug: "/the-real-cost-of-clout-in-africa",
    title: "The Real Cost of Clout: When Attention Becomes the Currency",
    category: "News",
    cover: "/news/clout-economy.jpg",
    alt: "A nightlife/spotlight style image representing clout, attention, and modern validation",
  },
  {
    slug: "/creativity-is-a-survival-skill",
    title: "Creativity Is a Survival Skill: How Africans Build With What They Have",
    category: "News",
    cover: "/news/creativity-survival.jpg",
    alt: "A hands-on maker/creative studio image representing building, grit, and invention",
  },
];

function Badge({ text }: { text: NewsItem["category"] }) {
  const isPick = text === "Editor’s Pick";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
        "border border-white/10 bg-black/60 text-white backdrop-blur",
        isPick ? "ring-1 ring-orange-500/40" : "",
      ].join(" ")}
    >
      {text}
    </span>
  );
}

export default function NewsSection() {
  const featured = news.find((n) => n.featured) ?? news[0];
  const rest = news.filter((n) => n.slug !== featured.slug);

  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-[1400px] px-5 py-10 md:py-12 lg:py-16">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-black dark:text-white md:text-5xl">
              News & Culture
            </h2>
            <p className="mt-2 max-w-xl text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Tech moves into thought moves — stories, context, and real-talk insight.
            </p>
          </div>

          <Link
            href="/news"
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
          {/* Featured Story */}
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

                {/* Readability overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                {/* Subtle top sheen */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 motion-reduce:transition-none">
                  <div className="absolute -top-24 left-1/2 h-48 w-[140%] -translate-x-1/2 rotate-6 bg-white/10 blur-2xl" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <Badge text={featured.category} />
                <h3 className="mt-4 line-clamp-3 text-2xl font-extrabold leading-tight text-white transition-colors group-hover:text-orange-300 md:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-3 text-sm font-medium text-zinc-200/90">
                  Tap to read the full story.
                </p>
              </div>
            </Link>
          </article>

          {/* Right Column: Cards */}
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
                    <div className="flex items-center justify-between gap-3">
                      <Badge text={item.category} />
                      <span className="hidden text-xs font-semibold text-zinc-500 dark:text-zinc-500 sm:inline">
                        Daddieshinor
                      </span>
                    </div>

                    <h4 className="mt-3 line-clamp-3 text-lg font-extrabold leading-snug text-black transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400 md:text-xl">
                      {item.title}
                    </h4>

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
