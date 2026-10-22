// "use client";

// import Link from "next/link";
// import {
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// import { useGlobalLoader } from "@/components/global-loader";

// const BACKGROUND_IMAGE = "/images/daddieshinor.jpg";
// const FALLBACK_IMAGE = "/fallback-image.jpg";

// type Story = {
//   id: number;
//   tag: string;
//   title: string;
//   excerpt: string;
//   href: string;
//   image: string;
// };

// type WordPressPost = {
//   id: number;
//   slug: string;
//   title?: {
//     rendered?: string;
//   };
//   excerpt?: {
//     rendered?: string;
//   };
//   _embedded?: {
//     "wp:featuredmedia"?: {
//       source_url?: string;
//       media_details?: {
//         sizes?: Record<
//           string,
//           {
//             source_url?: string;
//           }
//         >;
//       };
//     }[];
//     "wp:term"?: {
//       taxonomy?: string;
//       name?: string;
//     }[][];
//   };
// };

// function isPost(value: unknown): value is WordPressPost {
//   if (
//     value === null ||
//     typeof value !== "object" ||
//     Array.isArray(value)
//   ) {
//     return false;
//   }

//   const post = value as Record<string, unknown>;

//   return (
//     typeof post.id === "number" &&
//     typeof post.slug === "string" &&
//     post.slug.trim().length > 0
//   );
// }

// function cleanText(value: unknown): string {
//   if (typeof value !== "string") return "";

//   /*
//    * This helper runs after the browser fetch completes.
//    * DOMParser decodes WordPress HTML entities and removes markup.
//    */
//   const document = new DOMParser().parseFromString(
//     value,
//     "text/html",
//   );

//   document
//     .querySelectorAll("script, style, noscript")
//     .forEach((element) => element.remove());

//   document
//     .querySelectorAll(
//       "br, p, div, li, blockquote, h1, h2, h3, h4, h5, h6",
//     )
//     .forEach((element) => {
//       element.appendChild(document.createTextNode(" "));
//     });

//   return (document.body.textContent ?? "")
//     .replace(/\[[^\]]*\]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function truncate(value: string, length = 190) {
//   if (value.length <= length) return value;

//   const shortened = value.slice(0, length);
//   const space = shortened.lastIndexOf(" ");

//   return `${
//     space > length / 2
//       ? shortened.slice(0, space)
//       : shortened
//   }…`;
// }

// function categoryFor(post: WordPressPost) {
//   const groups = post._embedded?.["wp:term"] ?? [];
//   const categories = groups.flat();

//   const category = categories.find(
//     (term) => term.taxonomy === "category",
//   );

//   return cleanText(category?.name) || "Journal";
// }

// function imageFor(post: WordPressPost) {
//   const media = post._embedded?.["wp:featuredmedia"]?.[0];

//   const candidate =
//     media?.media_details?.sizes?.large?.source_url ||
//     media?.media_details?.sizes?.medium_large?.source_url ||
//     media?.source_url;

//   if (!candidate) return FALLBACK_IMAGE;

//   try {
//     const url = new URL(candidate);

//     return ["https:", "http:"].includes(url.protocol)
//       ? url.href
//       : FALLBACK_IMAGE;
//   } catch {
//     return FALLBACK_IMAGE;
//   }
// }

// function mapPost(post: WordPressPost): Story {
//   return {
//     id: post.id,
//     tag: categoryFor(post),
//     title: cleanText(post.title?.rendered) || "Untitled",
//     excerpt: truncate(cleanText(post.excerpt?.rendered)),
//     href: `/essays/${encodeURIComponent(post.slug)}`,
//     image: imageFor(post),
//   };
// }

// function Arrow({
//   direction = "right",
//   diagonal = false,
//   className = "",
// }: {
//   direction?: "left" | "right";
//   diagonal?: boolean;
//   className?: string;
// }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden="true"
//       className={`h-5 w-5 ${className}`}
//     >
//       {diagonal ? (
//         <path
//           d="M6 18 18 6M6 6h12v12"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       ) : direction === "left" ? (
//         <path
//           d="M19 12H5m7 7-7-7 7-7"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       ) : (
//         <path
//           d="M5 12h14m-7-7 7 7-7 7"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       )}
//     </svg>
//   );
// }

// function StoryImage({
//   src,
//   alt,
//   className = "",
//   eager = false,
// }: {
//   src: string;
//   alt: string;
//   className?: string;
//   eager?: boolean;
// }) {
//   return (
//     // eslint-disable-next-line @next/next/no-img-element
//     <img
//       src={src}
//       alt={alt}
//       loading={eager ? "eager" : "lazy"}
//       decoding="async"
//       className={className}
//       onError={(event) => {
//         const image = event.currentTarget;

//         if (image.dataset.fallback === "true") return;

//         image.dataset.fallback = "true";
//         image.src = FALLBACK_IMAGE;
//       }}
//     />
//   );
// }

// function LoadingContent() {
//   return (
//     <div
//       role="status"
//       aria-label="Loading latest stories"
//       className="grid gap-8 lg:grid-cols-12 lg:gap-12"
//     >
//       <div className="lg:col-span-7">
//         <div className="aspect-[4/3] animate-pulse rounded-2xl bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07] sm:aspect-[16/11]" />
//       </div>

//       <div className="space-y-6 lg:col-span-5">
//         <div className="h-8 w-48 animate-pulse rounded bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />

//         {[0, 1, 2, 3].map((item) => (
//           <div
//             key={item}
//             className="flex animate-pulse gap-4 motion-reduce:animate-none"
//           >
//             <div className="h-20 w-24 shrink-0 rounded-lg bg-black/[0.07] dark:bg-white/[0.07]" />

//             <div className="flex-1 space-y-3 py-1">
//               <div className="h-3 w-16 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
//               <div className="h-4 w-full rounded bg-black/[0.07] dark:bg-white/[0.07]" />
//               <div className="h-4 w-3/4 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
//             </div>
//           </div>
//         ))}
//       </div>

//       <span className="sr-only">Loading latest stories…</span>
//     </div>
//   );
// }

// export default function Hero() {
//   const loader = useGlobalLoader();
//   const loaderRef = useRef(loader);

//   const [stories, setStories] = useState<Story[]>([]);
//   const [index, setIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [attempt, setAttempt] = useState(0);

//   useEffect(() => {
//     loaderRef.current = loader;
//   }, [loader]);

//   useEffect(() => {
//     const controller = new AbortController();
//     const timeout = window.setTimeout(
//       () => controller.abort(),
//       20_000,
//     );

//     let cancelled = false;
//     let released = false;

//     const { start, stop } = loaderRef.current;

//     function releaseLoader() {
//       if (released) return;
//       released = true;
//       stop();
//     }

//     start();
//     setLoading(true);
//     setError("");

//     async function loadStories() {
//       try {
//         const path =
//           "/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed=1";

//         const response = await fetch(
//           `/api/wp-proxy?path=${encodeURIComponent(path)}`,
//           {
//             cache: "no-store",
//             signal: controller.signal,
//           },
//         );

//         if (!response.ok) {
//           throw new Error(
//             `WordPress request failed with status ${response.status}.`,
//           );
//         }

//         const data: unknown = await response.json();

//         if (!Array.isArray(data)) {
//           throw new Error("WordPress returned an invalid response.");
//         }

//         const posts = data.filter(isPost);
//         const mapped = posts.map(mapPost);

//         if (cancelled) return;

//         setStories(mapped);
//         setIndex(0);
//       } catch (requestError) {
//         if (cancelled) return;

//         console.error(
//           "[EDITORIAL HERO]",
//           requestError instanceof Error
//             ? requestError.message
//             : "Unable to load stories.",
//         );

//         setError(
//           "The latest stories could not be loaded. Please try again.",
//         );
//       } finally {
//         window.clearTimeout(timeout);
//         releaseLoader();

//         if (!cancelled) setLoading(false);
//       }
//     }

//     void loadStories();

//     return () => {
//       cancelled = true;
//       controller.abort();
//       window.clearTimeout(timeout);
//       releaseLoader();
//     };
//   }, [attempt]);

//   const slides = stories.slice(0, 4);
//   const active = slides[index] ?? slides[0];

//   const recentStories =
//     stories.length > 4
//       ? stories.slice(4, 10)
//       : stories.filter((story) => story.id !== active?.id);

//   function changeSlide(direction: -1 | 1) {
//     if (slides.length < 2) return;

//     setIndex(
//       (current) =>
//         (current + direction + slides.length) % slides.length,
//     );
//   }

//   return (
//     <section
//       id="journal"
//       aria-labelledby="journal-heading"
//       className="relative isolate scroll-mt-24 overflow-hidden border-y border-black/10 bg-[#eeeee7] text-[#191b19] dark:border-white/10 dark:bg-[#111310] dark:text-[#eeeee7]"
//     >
//       {/* Section background */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 -z-20"
//       >
//         {/* eslint-disable-next-line @next/next/no-img-element */}
//         <img
//           src={BACKGROUND_IMAGE}
//           alt=""
//           loading="lazy"
//           className="h-full w-full object-cover object-center opacity-25 saturate-0 dark:opacity-20"
//         />
//       </div>

//       {/* Readability overlays */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#eeeee7]/95 via-[#eeeee7]/90 to-[#eeeee7]/80 dark:from-[#111310]/95 dark:via-[#111310]/90 dark:to-[#111310]/80"
//       />

//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#eeeee7] via-transparent to-[#eeeee7]/35 dark:from-[#111310] dark:to-[#111310]/35"
//       />

//       <div className="mx-auto max-w-[1440px] px-5 py-9 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
//         {/* Section heading */}
//         <header className="mb-8 flex flex-col justify-between gap-5 border-b border-black/15 pb-6 dark:border-white/15 sm:flex-row sm:items-end lg:mb-10">
//           <div>
//             <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#706a4b] dark:text-[#b7ae82]">
//               <span
//                 aria-hidden="true"
//                 className="h-px w-7 bg-current"
//               />
//               Daddieshinor Journal
//             </p>

//             <h2
//               id="journal-heading"
//               className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-[44px]"
//             >
//               Worth your attention.
//             </h2>
//           </div>

//           <p className="max-w-[290px] text-xs leading-6 text-black/55 dark:text-white/55 sm:text-right">
//             Independent perspectives on technology, culture,
//             branding and life.
//           </p>
//         </header>

//         {loading ? (
//           <LoadingContent />
//         ) : error ? (
//           <div className="rounded-2xl border border-black/10 bg-white/65 px-6 py-12 dark:border-white/10 dark:bg-black/20 sm:px-10">
//             <p className="text-xl font-semibold tracking-tight">
//               A brief interruption.
//             </p>

//             <p
//               role="alert"
//               className="mt-3 max-w-md text-sm leading-7 text-black/60 dark:text-white/60"
//             >
//               {error}
//             </p>

//             <button
//               type="button"
//               onClick={() => setAttempt((value) => value + 1)}
//               className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-full bg-[#191b19] px-5 text-xs font-semibold text-white transition hover:bg-[#36392f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#968e68] dark:bg-[#eeeee7] dark:text-[#191b19]"
//             >
//               Try again
//               <Arrow />
//             </button>
//           </div>
//         ) : !active ? (
//           <div className="rounded-2xl border border-dashed border-black/20 px-6 py-14 dark:border-white/20">
//             <p className="text-xl font-semibold tracking-tight">
//               New perspectives are on the way.
//             </p>

//             <p className="mt-3 text-sm leading-7 text-black/55 dark:text-white/55">
//               Published stories will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14">
//             {/* Featured story */}
//             <div className="min-w-0 lg:col-span-7">
//               <div className="mb-4 flex min-h-10 items-center justify-between gap-4">
//                 <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
//                   The featured read
//                 </p>

//                 {slides.length > 1 && (
//                   <div
//                     role="group"
//                     aria-label="Featured story controls"
//                     className="flex items-center gap-2"
//                   >
//                     <span className="mr-2 text-[11px] tabular-nums text-black/45 dark:text-white/45">
//                       {String(index + 1).padStart(2, "0")}
//                       <span className="mx-1 opacity-50">/</span>
//                       {String(slides.length).padStart(2, "0")}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={() => changeSlide(-1)}
//                       aria-label="Previous featured story"
//                       className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white/40 transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#968e68] dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/15"
//                     >
//                       <Arrow direction="left" />
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => changeSlide(1)}
//                       aria-label="Next featured story"
//                       className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 bg-white/40 transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#968e68] dark:border-white/20 dark:bg-white/5 dark:hover:bg-white/15"
//                     >
//                       <Arrow />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <article>
//                 <Link
//                   href={active.href}
//                   className="group relative block overflow-hidden rounded-2xl bg-[#20231d] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#968e68] sm:rounded-[22px]"
//                 >
//                   <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
//                     <StoryImage
//                       src={active.image}
//                       alt={active.title}
//                       eager={index === 0}
//                       className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
//                     />

//                     <div
//                       aria-hidden="true"
//                       className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15"
//                     />

//                     <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur-sm sm:left-6 sm:top-6">
//                       {active.tag}
//                     </span>

//                     <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 sm:p-7">
//                       <div>
//                         <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/65">
//                           Daddieshinor / Selected
//                         </p>

//                         <span className="mt-2 block text-sm font-medium">
//                           Read the story
//                         </span>
//                       </div>

//                       <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 transition group-hover:bg-white group-hover:text-black">
//                         <Arrow diagonal />
//                       </span>
//                     </div>
//                   </div>
//                 </Link>

//                 <div className="pt-6">
//                   <Link
//                     href={active.href}
//                     className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#968e68]"
//                   >
//                     <h3 className="max-w-[18ch] text-[clamp(1.8rem,3.3vw,3.4rem)] font-semibold leading-[1.07] tracking-[-0.045em] transition-colors group-hover:text-[#77704f] dark:group-hover:text-[#b7ae82]">
//                       {active.title}
//                     </h3>
//                   </Link>

//                   {active.excerpt && (
//                     <p className="mt-4 max-w-[58ch] text-sm leading-7 text-black/60 dark:text-white/60 sm:text-[15px] sm:leading-8">
//                       {active.excerpt}
//                     </p>
//                   )}
//                 </div>
//               </article>

//               {slides.length > 1 && (
//                 <div
//                   role="group"
//                   aria-label="Choose a featured story"
//                   className="mt-5 flex items-center gap-1"
//                 >
//                   {slides.map((story, position) => (
//                     <button
//                       key={story.id}
//                       type="button"
//                       onClick={() => setIndex(position)}
//                       aria-label={`Show featured story: ${story.title}`}
//                       aria-pressed={position === index}
//                       className="flex min-h-10 min-w-10 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#968e68]"
//                     >
//                       <span
//                         aria-hidden="true"
//                         className={`h-[3px] rounded-full transition-all motion-reduce:transition-none ${
//                           position === index
//                             ? "w-8 bg-[#77704f] dark:bg-[#b7ae82]"
//                             : "w-4 bg-black/20 dark:bg-white/20"
//                         }`}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Recent stories and partnership */}
//             <aside
//               aria-label="More from Daddieshinor"
//               className="min-w-0 lg:col-span-5"
//             >
//               <div className="mb-4 flex min-h-10 items-center justify-between gap-4">
//                 <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/55 dark:text-white/55">
//                   Recent thoughts
//                 </h3>

//                 <span className="text-[10px] text-black/40 dark:text-white/40">
//                   Keep exploring
//                 </span>
//               </div>

//               {recentStories.length ? (
//                 <ol className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
//                   {recentStories.map((story, position) => (
//                     <li key={story.id}>
//                       <Link
//                         href={story.href}
//                         className="group grid grid-cols-[minmax(0,1fr)_88px] items-center gap-4 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#968e68] sm:grid-cols-[minmax(0,1fr)_108px] sm:gap-6"
//                       >
//                         <div className="min-w-0">
//                           <div className="mb-2 flex items-center gap-3">
//                             <span className="text-[9px] tabular-nums text-black/30 dark:text-white/30">
//                               {String(position + 1).padStart(2, "0")}
//                             </span>

//                             <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#77704f] dark:text-[#b7ae82]">
//                               {story.tag}
//                             </span>
//                           </div>

//                           <h4 className="line-clamp-3 text-[15px] font-semibold leading-[1.4] tracking-[-0.02em] transition-colors group-hover:text-[#77704f] dark:group-hover:text-[#b7ae82] sm:text-[17px]">
//                             {story.title}
//                           </h4>
//                         </div>

//                         <div className="aspect-square overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
//                           <StoryImage
//                             src={story.image}
//                             alt=""
//                             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
//                           />
//                         </div>
//                       </Link>
//                     </li>
//                   ))}
//                 </ol>
//               ) : (
//                 <p className="border-t border-black/10 py-6 text-sm leading-7 text-black/55 dark:border-white/10 dark:text-white/55">
//                   More stories will appear here as they are published.
//                 </p>
//               )}

//               <div className="relative mt-7 overflow-hidden rounded-2xl bg-[#20231d] p-6 text-white sm:p-7">
//                 <div
//                   aria-hidden="true"
//                   className="absolute inset-0 opacity-20"
//                 >
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <img
//                     src="/images/premium_photo-1742995782977-ee4b53fecad.png"
//                     alt=""
//                     loading="lazy"
//                     className="h-full w-full object-cover"
//                   />
//                 </div>

//                 <div
//                   aria-hidden="true"
//                   className="absolute inset-0 bg-gradient-to-r from-[#20231d] via-[#20231d]/85 to-[#20231d]/50"
//                 />

//                 <div className="relative">
//                   <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c8bd8e]">
//                     Partnerships
//                   </p>

//                   <h3 className="mt-4 max-w-[16ch] text-2xl font-semibold leading-[1.1] tracking-[-0.035em]">
//                     Put your brand in thoughtful company.
//                   </h3>

//                   <p className="mt-3 max-w-[34ch] text-xs leading-6 text-white/65">
//                     Collaborations and considered placements for
//                     brands with something to contribute.
//                   </p>

//                   <Link
//                     href="/partnerships"
//                     className="mt-6 inline-flex min-h-11 items-center gap-4 rounded-full border border-white/25 px-4 text-xs font-medium transition hover:border-white hover:bg-white hover:text-[#20231d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
//                   >
//                     Explore partnerships
//                     <Arrow diagonal className="h-4 w-4" />
//                   </Link>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         )}

//         <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-black/15 pt-5 dark:border-white/15 sm:flex-row sm:items-center lg:mt-14">
//           <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-black/45 dark:text-white/45">
//             Independent thinking. A different point of view.
//           </p>

//           <p className="text-[10px] text-black/40 dark:text-white/40">
//             Tech. Culture. Branding. Life.
//           </p>
//         </footer>
//       </div>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useGlobalLoader } from "@/components/global-loader";
import ThoughtItem from "@/components/thoughtItem";

const BACKGROUND_IMAGE =
  "/images/sea-grey.jpg";

const FALLBACK_IMAGE = "/fallback-image.jpg";

type Slide = {
  tag: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  alt: string;
  featured?: boolean;
};

type Thought = {
  tag: string;
  title: string;
  image: string;
  href: string;
};

type WordPressPost = {
  id: number;
  slug: string;
  title?: {
    rendered?: string;
  };
  excerpt?: {
    rendered?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url?: string;
      media_details?: {
        sizes?: Record<
          string,
          {
            source_url?: string;
          }
        >;
      };
    }[];
    "wp:term"?: {
      taxonomy?: string;
      name?: string;
    }[][];
  };
};

const fallbackSlides: Slide[] = [
  {
    tag: "Tech",
    title: "Why AI will reward thinkers, not hustlers",
    excerpt:
      "The era of loud hustle is fading. The winners will be the ones who can think clearly, synthesize fast, and ship with depth.",
    href: "/essays/why-ai-will-reward-thinkers-not-hustlers",
    image: FALLBACK_IMAGE,
    alt: "Abstract AI visual representing deep thinking",
    featured: true,
  },
];

const fallbackThoughts: Thought[] = [
  {
    tag: "Tech",
    title:
      "Why most African tech products don’t fail because of technology",
    image: FALLBACK_IMAGE,
    href: "/essays/why-most-african-tech-products-dont-fail-because-of-technology",
  },
];

function isPost(value: unknown): value is WordPressPost {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const post = value as Record<string, unknown>;

  return (
    typeof post.id === "number" &&
    typeof post.slug === "string" &&
    post.slug.length > 0
  );
}

function cleanWpText(input: unknown): string {
  if (typeof input !== "string") return "";

  /*
   * Called when the browser receives the WordPress response.
   * Decode entities and extract readable text.
   */
  const document = new DOMParser().parseFromString(
    input,
    "text/html",
  );

  document
    .querySelectorAll("script, style, noscript")
    .forEach((element) => element.remove());

  document
    .querySelectorAll(
      "p, div, br, li, blockquote, section, article, h1, h2, h3, h4, h5, h6",
    )
    .forEach((element) => {
      element.appendChild(document.createTextNode(" "));
    });

  return (document.body.textContent ?? "")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const sliced = text.slice(0, maxChars);
  const lastSpace = sliced.lastIndexOf(" ");

  return `${
    lastSpace > maxChars / 2
      ? sliced.slice(0, lastSpace)
      : sliced
  }…`;
}

function getWpCategoryName(post: WordPressPost) {
  const categories = (
    post._embedded?.["wp:term"] ?? []
  ).flat();

  const category = categories.find(
    (term) => term.taxonomy === "category",
  );

  return (
    cleanWpText(category?.name ?? categories[0]?.name) ||
    "Uncategorized"
  );
}

function getFeaturedImage(
  post: WordPressPost,
  size: "large" | "medium" | "thumbnail" = "large",
) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  return (
    media?.media_details?.sizes?.[size]?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium?.source_url ||
    media?.source_url ||
    FALLBACK_IMAGE
  );
}

function ArrowIcon({
  left = false,
}: {
  left?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-[18px] w-[18px]"
    >
      <path
        d={
          left
            ? "M19 12H5m7 7-7-7 7-7"
            : "M5 12h14m-7-7 7 7-7 7"
        }
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading latest stories"
      className="grid grid-cols-1 items-start gap-9 lg:grid-cols-12 lg:gap-6 xl:gap-9"
    >
      <div className="space-y-6 lg:col-span-6">
        <div className="h-10 w-48 animate-pulse rounded-full bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />

        <div className="h-28 animate-pulse rounded-xl bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />

        <div className="h-16 animate-pulse rounded-xl bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />

        <div className="aspect-[16/10] animate-pulse rounded-[26px] bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />
      </div>

      <div className="space-y-6 lg:col-span-4">
        <div className="h-14 w-48 animate-pulse rounded-lg bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />

        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex animate-pulse gap-4 motion-reduce:animate-none"
          >
            <div className="h-20 w-20 shrink-0 rounded-xl bg-black/[0.07] dark:bg-white/[0.07]" />

            <div className="flex-1 space-y-3 py-2">
              <div className="h-3 w-16 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
              <div className="h-4 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
              <div className="h-4 w-3/4 rounded bg-black/[0.07] dark:bg-white/[0.07]" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:flex lg:flex-col">
        <div className="aspect-[4/5] animate-pulse rounded-[24px] bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />

        <div className="min-h-48 animate-pulse rounded-[24px] bg-black/[0.07] motion-reduce:animate-none dark:bg-white/[0.07]" />
      </div>

      <span className="sr-only">Loading latest stories…</span>
    </div>
  );
}

function EditorialImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="group overflow-hidden rounded-[24px] border border-black/10 bg-white/50 shadow-[0_10px_30px_rgba(0,0,0,0.07)] dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 45vw, 220px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const loader = useGlobalLoader();
  const loaderRef = useRef(loader);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  const hoveringRef = useRef(false);
  const focusedRef = useRef(false);

  useEffect(() => {
    loaderRef.current = loader;
  }, [loader]);

  useEffect(() => {
    const controller = new AbortController();

    let cancelled = false;
    let released = false;

    const { start, stop } = loaderRef.current;

    function releaseLoader() {
      if (released) return;
      released = true;
      stop();
    }

    const timeout = window.setTimeout(
      () => controller.abort(),
      20_000,
    );

    start();
    setLoading(true);
    setError("");

    async function fetchPosts() {
      try {
        const path =
          "/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc&_embed=1";

        const response = await fetch(
          `/api/wp-proxy?path=${encodeURIComponent(path)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `WordPress request failed: ${response.status}`,
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid WordPress response.");
        }

        const posts = data.filter(isPost);

        if (!posts.length) {
          throw new Error("No posts returned.");
        }

        const mappedSlides: Slide[] = posts
          .slice(0, 4)
          .map((post, position) => {
            const title =
              cleanWpText(post.title?.rendered) || "Untitled";

            return {
              tag: getWpCategoryName(post),
              title,
              excerpt: truncateText(
                cleanWpText(post.excerpt?.rendered),
                180,
              ),
              href: `/essays/${encodeURIComponent(post.slug)}`,
              image: getFeaturedImage(post, "large"),
              alt: title,
              featured: position === 0,
            };
          });

        const recentPosts =
          posts.length > 4
            ? posts.slice(4, 10)
            : posts.slice(1);

        const mappedThoughts: Thought[] = recentPosts.map(
          (post) => ({
            tag: getWpCategoryName(post),
            title:
              cleanWpText(post.title?.rendered) || "Untitled",
            image: getFeaturedImage(post, "medium"),
            href: `/essays/${encodeURIComponent(post.slug)}`,
          }),
        );

        if (cancelled) return;

        setSlides(mappedSlides);
        setThoughts(mappedThoughts);
        setIndex(0);
      } catch (requestError) {
        if (cancelled) return;

        console.error(
          "[HERO]",
          requestError instanceof Error
            ? requestError.message
            : "Unable to load stories.",
        );

        setError(
          "Latest stories are temporarily unavailable. Showing selected reading.",
        );

        setSlides(fallbackSlides);
        setThoughts(fallbackThoughts);
        setIndex(0);
      } finally {
        window.clearTimeout(timeout);
        releaseLoader();

        if (!cancelled) setLoading(false);
      }
    }

    void fetchPosts();

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
      releaseLoader();
    };
  }, [attempt]);

  const ordered = useMemo(() => {
    const featured =
      slides.find((slide) => slide.featured) ?? slides[0];

    if (!featured) return fallbackSlides;

    return [
      featured,
      ...slides.filter((slide) => slide !== featured),
    ];
  }, [slides]);

  useEffect(() => {
    if (loading || !playing || ordered.length <= 1) return;

    const timer = window.setInterval(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (
        reducedMotion ||
        document.hidden ||
        hoveringRef.current ||
        focusedRef.current
      ) {
        return;
      }

      setIndex((current) => (current + 1) % ordered.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [loading, playing, ordered.length]);

  const active = ordered[index] ?? ordered[0];

  function chooseSlide(position: number) {
    setIndex(position);
    setPlaying(false);
  }

  function moveSlide(direction: -1 | 1) {
    setIndex(
      (current) =>
        (current + direction + ordered.length) %
        ordered.length,
    );

    setPlaying(false);
  }

  const controlClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/15 bg-white/70 text-black transition hover:border-[#968e68] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#968e68] disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/15 dark:bg-zinc-950/60 dark:text-white dark:hover:bg-zinc-900";

  return (
    <section className="relative isolate overflow-hidden bg-[#f3f2ed] text-zinc-950 dark:bg-[#10120f] dark:text-white">
      {/* Full-width background image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <Image
          src={BACKGROUND_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-white/80 dark:bg-[#10120f]/85" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#f8f7f2]/90 via-[#f8f7f2]/35 to-transparent dark:from-[#10120f]/90 dark:via-[#10120f]/35" />

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#f3f2ed]/70 to-transparent dark:from-[#10120f]/70" />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f3f2ed]/80 to-transparent dark:from-[#10120f]/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-10 sm:px-7 md:py-14 lg:px-8 lg:py-16 xl:px-10">
        {loading ? (
          <HeroSkeleton />
        ) : (
          <>
            {error && (
              <div
                role="status"
                className="mb-7 flex flex-col justify-between gap-3 rounded-xl border border-[#968e68]/25 bg-white/80 px-4 py-3 text-xs leading-6 text-zinc-600 backdrop-blur-sm dark:bg-zinc-950/70 dark:text-zinc-300 sm:flex-row sm:items-center"
              >
                <p>{error}</p>

                <button
                  type="button"
                  onClick={() =>
                    setAttempt((current) => current + 1)
                  }
                  className="w-fit shrink-0 font-semibold text-[#766c43] underline underline-offset-4 dark:text-[#c2b68a]"
                >
                  Try again
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-6 xl:gap-9">
              {/* LEFT: Featured story */}
              <div
                className="min-w-0 lg:col-span-6"
                onMouseEnter={() => {
                  hoveringRef.current = true;
                }}
                onMouseLeave={() => {
                  hoveringRef.current = false;
                }}
                onFocusCapture={() => {
                  focusedRef.current = true;
                }}
                onBlurCapture={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget,
                    )
                  ) {
                    focusedRef.current = false;
                  }
                }}
              >
                <div className="mb-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex max-w-full flex-wrap items-center gap-2.5 rounded-full border border-black/10 bg-white/85 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.16em] text-black backdrop-blur-sm dark:border-white/15 dark:bg-zinc-950/75 dark:text-white sm:text-[10px]">
                    Featured Story

                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[#968e68]"
                    />

                    <span className="text-[#766c43] dark:text-[#c2b68a]">
                      {active.tag}
                    </span>
                  </span>

                  {ordered.length > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveSlide(-1)}
                        className={controlClass}
                        aria-label="Previous featured story"
                      >
                        <ArrowIcon left />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveSlide(1)}
                        className={controlClass}
                        aria-label="Next featured story"
                      >
                        <ArrowIcon />
                      </button>
                    </div>
                  )}
                </div>

                {/* Headline remains above the featured image */}
                <Link
                  href={active.href}
                  className="group block rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#968e68]"
                >
                  <h1 className="text-[2rem] font-black leading-[1.03] tracking-[-0.04em] text-black transition-colors group-hover:text-[#80764d] dark:text-white dark:group-hover:text-[#c2b68a] sm:text-[2.8rem] lg:text-[3rem] xl:text-[3.65rem]">
                    {active.title}
                  </h1>

                  {active.excerpt && (
                    <p className="mt-5 max-w-[56ch] text-[15px] leading-7 text-zinc-700 dark:text-zinc-300 sm:text-base sm:leading-8">
                      {active.excerpt}
                    </p>
                  )}
                </Link>

                <div className="relative mt-7 overflow-hidden rounded-[26px] border border-black/10 bg-zinc-100 shadow-[0_14px_40px_rgba(0,0,0,0.10)] dark:border-white/10 dark:bg-zinc-900 dark:shadow-[0_14px_40px_rgba(0,0,0,0.25)]">
                  <Link
                    href={active.href}
                    aria-label={`Read ${active.title}`}
                    className="group relative block aspect-[16/10] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
                  >
                    <Image
                      key={active.image}
                      src={active.image}
                      alt={active.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1023px) 100vw, (max-width: 1440px) 50vw, 660px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.025] motion-reduce:transition-none"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 p-5 pb-20 text-white sm:p-6 sm:pb-20">
                      <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-sm">
                        {active.tag}
                      </span>

                      <span className="inline-flex items-center gap-2 text-xs font-medium">
                        Read full story
                        <ArrowIcon />
                      </span>
                    </div>
                  </Link>

                  {/* Controls sit outside the story link */}
                  {ordered.length > 1 && (
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/50 px-3 py-1.5 text-white backdrop-blur-md sm:inset-x-5 sm:bottom-5">
                      <div
                        role="group"
                        aria-label="Choose featured story"
                        className="flex items-center"
                      >
                        {ordered.map((slide, position) => (
                          <button
                            key={slide.href}
                            type="button"
                            onClick={() => chooseSlide(position)}
                            aria-label={`Show ${slide.title}`}
                            aria-pressed={position === index}
                            className="flex h-9 min-w-9 items-center justify-center rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                          >
                            <span
                              aria-hidden="true"
                              className={`h-1.5 rounded-full transition-all motion-reduce:transition-none ${
                                position === index
                                  ? "w-6 bg-[#c2b68a]"
                                  : "w-1.5 bg-white/50"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setPlaying((current) => !current)
                        }
                        aria-label={
                          playing
                            ? "Pause featured story rotation"
                            : "Play featured story rotation"
                        }
                        className="min-h-9 shrink-0 rounded-lg px-2 text-[10px] font-medium text-white/85 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                      >
                        {playing ? "Pause" : "Play"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: Recent Thoughts */}
              <div className="min-w-0 lg:col-span-4">
                <div className="mb-6 flex min-h-11 items-end justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#766c43] dark:text-[#c2b68a]">
                      Fresh Reading
                    </p>

                    <h2 className="mt-2 text-[27px] font-black leading-tight tracking-[-0.035em] text-black dark:text-white xl:text-[30px]">
                      Recent Thoughts
                    </h2>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mb-2 h-[3px] w-9 shrink-0 rounded-full bg-[#968e68]/70"
                  />
                </div>

                <div className="rounded-[24px] border border-black/[0.07] bg-white/65 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-950/60 sm:p-5 lg:p-4 xl:p-5">
                  <div
                    role="region"
                    aria-label="Recent thoughts"
                    tabIndex={0}
                    className="max-h-[650px] overflow-y-auto overscroll-y-contain pr-2 outline-none [scrollbar-color:#968e6880_transparent] [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-[#968e68]/50 lg:max-h-[720px]"
                  >
                    {thoughts.length ? (
                      <div className="divide-y divide-black/10 dark:divide-white/10">
                        {thoughts.map((thought) => (
                          <div
                            key={thought.href}
                            className="min-w-0 py-5 first:pt-1 last:pb-1"
                          >
                            <ThoughtItem
                              tag={thought.tag}
                              title={thought.title}
                              image={thought.image}
                              href={thought.href}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="py-5 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                        More thoughts will appear here as they are
                        published.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Both editorial images and partnership card */}
              <aside
                aria-label="Daddieshinor and partnerships"
                className="grid min-w-0 gap-5 sm:grid-cols-2 lg:col-span-2 lg:flex lg:flex-col"
              >
                <EditorialImage
                  src="/images/daddieshinor.jpg"
                  alt="Daddieshinor editorial visual"
                />

                <div className="relative min-w-0 overflow-hidden rounded-[24px] border border-[#968e68]/25 bg-white/85 p-5 shadow-[0_8px_26px_rgba(0,0,0,0.04)] backdrop-blur-sm dark:border-[#968e68]/30 dark:bg-zinc-950/75 lg:p-4 xl:p-5">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#968e68]/70 to-transparent"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#766c43] dark:text-[#c2b68a]">
                    Partnership
                  </p>

                  <h3 className="mt-4 text-lg font-semibold leading-[1.25] tracking-[-0.025em] text-zinc-950 dark:text-white">
                    Thoughtful brand visibility.
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-zinc-600 dark:text-zinc-400">
                    Reach readers through considered placements
                    and collaborations.
                  </p>

                  <Link
                    href="/partnerships"
                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-sm text-xs font-semibold leading-5 text-[#766c43] transition hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#968e68] dark:text-[#c2b68a] dark:hover:text-white"
                  >
                    <span>Explore partnerships</span>
                    <span className="shrink-0">
                      <ArrowIcon />
                    </span>
                  </Link>
                </div>

                <EditorialImage
                  src="/images/premium_photo-1742995782977-ee4b53fecad.png"
                  alt="Daddieshinor editorial photography"
                />
              </aside>
            </div>
          </>
        )}
      </div>
    </section>
  );
}