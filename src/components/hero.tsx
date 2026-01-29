import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 md:py-14 lg:py-20">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">

        {/* LEFT — Primary Thought */}
        <div className="lg:col-span-5">
          <span className="inline-block rounded-full border border-black/20 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-black/80 dark:bg-black dark:text-white/80 dark:border-white/20">
            FEATURED ESSAY
          </span>

          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl xl:text-6xl">
            When speed stops impressing you,
            <span className="block text-black/60 dark:text-white/60">
              clarity quietly takes over.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-700 dark:text-zinc-400">
            A reflection on ambition, patience, and why slowing down often
            produces the most meaningful breakthroughs in life and work.
          </p>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10 dark:ring-white/10">
            <Image
              src="/hero-main.jpg"
              alt="Abstract visual representing clarity and patience"
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* CENTER — Recent Thoughts (scrollable) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-6 flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-semibold tracking-tight">
              Recent Thoughts
            </h2>
            <div className="h-px w-24 bg-black/30 dark:bg-white/30" />
          </div>

          <div
            className="
              flex-1 overflow-y-auto pr-2
              max-h-[620px] lg:max-h-[700px]
              scrollbar-thin scrollbar-thumb-zinc-400 scrollbar-track-transparent
              dark:scrollbar-thumb-zinc-700
            "
          >
            <div className="space-y-7 pb-4">
              <ThoughtItem
                tag="Tech"
                title="Why AI will reward thinkers, not hustlers"
                image="/story-1.jpg"
              />
              <Divider />

              <ThoughtItem
                tag="Branding"
                title="Personal brands are becoming quiet businesses"
                image="/story-2.jpg"
              />
              <Divider />

              <ThoughtItem
                tag="Culture"
                title="What WhatsApp usernames really change about identity"
                image="/story-3.jpg"
              />
              <Divider />

              <ThoughtItem
                tag="Life"
                title="You don’t need a new skill — you need depth"
                image="/story-4.jpg"
              />
            </div>
          </div>
        </div>

        {/* RIGHT — Editor’s Pick */}
        <div className="lg:col-span-2">
          <Link href="/essays/your-true-size" className="group block">
            <div className="overflow-hidden rounded-2xl bg-black text-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/editors-pick.jpg"
                  alt="Your true size"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="relative p-5">
                <span className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
                  Editor’s Pick
                </span>

                <h3 className="mt-3 text-xl font-semibold leading-snug group-hover:text-zinc-200 transition">
                  How big you really are (and why you forgot)
                </h3>

                <p className="mt-2 text-sm text-zinc-300">
                  A quiet reminder about self-worth • Jan 2026
                </p>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}

/* — Small reusable parts — */

function ThoughtItem({
  tag,
  title,
  image,
}: {
  tag: string;
  title: string;
  image: string;
}) {
  return (
    <div className="group flex gap-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <span className="text-xs font-medium uppercase tracking-wide text-black/60 dark:text-white/60">
          {tag}
        </span>
        <h4 className="mt-1.5 text-base font-semibold leading-snug group-hover:text-black dark:group-hover:text-white transition">
          {title}
        </h4>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />;
}
