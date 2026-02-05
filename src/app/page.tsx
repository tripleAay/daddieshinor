// app/page.tsx
import { Suspense } from "react";

import Header from "@/components/header";
import Hero from "@/components/hero";
import LatestSection from "@/components/latest";
import BestNewMusic from "@/components/bestNewMusic";
import TechSection from "@/components/TechSection";
import NewsSection from "@/components/culturesection";
import BrandsSection from "@/components/brand";
import AllPostsIndex from "@/components/mobile-headline";
import HeadlineIndex from "@/components/headline-layout";
import { SubscribeModalTrigger } from "@/components/subscribepopup";
import YouTubeEmbed from "@/components/youtube";
import Footer from "@/components/footer";
import MarqueeNote from "@/components/marqueeNote";

function HeroSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 md:py-14 lg:py-20 animate-pulse">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="h-10 w-56 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="hidden sm:flex gap-3">
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="space-y-5">
            <div className="h-16 md:h-20 lg:h-24 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="aspect-[16/10] w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800 shadow-2xl ring-1 ring-black/10 dark:ring-white/10" />
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-1 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-5">
              <div className="h-24 w-24 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-[3/4] rounded-2xl bg-zinc-200 dark:bg-zinc-800 shadow-2xl" />
          <div className="space-y-3 px-2">
            <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans antialiased dark:bg-black">
      <Header />
      <MarqueeNote />
      <AllPostsIndex />


      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>

        <div className="mt-10 md:mt-14 lg:mt-16 space-y-14 md:space-y-16 lg:space-y-20">
          <LatestSection />
          <BestNewMusic />
          <TechSection />
          <NewsSection />
          <BrandsSection />
          <HeadlineIndex title="All Posts" description="Latest posts from all categories" />


          <div className="pt-2">
            <SubscribeModalTrigger />
          </div>
        </div>
      </main>

      <div className="mt-10 mb-12 md:mt-12 mx-auto w-full max-w-4xl px-4">
        <YouTubeEmbed
          urlOrId="https://youtu.be/-U5dEdWouDY?si=u1fyqkI14-SpGvNl"
          className="w-full"
        // Optional: start={30} if you want to skip intro
        />
      </div>
      <Footer />
    </div>
  );
}
