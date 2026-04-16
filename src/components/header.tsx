"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Sun, Moon, Play, Pause } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import MobileMenu from "@/components/mobileMenu";
import { useAudio } from "../components/audioProvider";

const nav = [
  { label: "Tech", href: "/categories/tech" },
  { label: "Culture", href: "/categories/culture" },
  { label: "Branding", href: "/categories/branding" },
  { label: "Life", href: "/categories/life" },
];

type Theme = "light" | "dark";

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
}

function formatWATTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatWATTime());
  const [tick, setTick] = useState(false);
  const [q, setQ] = useState("");

  const { isPlaying, togglePlay } = useAudio();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefers ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const next = media.matches ? "dark" : "light";
        setTheme(next);
        applyTheme(next);
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(formatWATTime());
      setTick(true);

      setTimeout(() => setTick(false), 300);
    }, 30000);

    return () => clearInterval(id);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    const trimmed = q.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#D9DCD6]/95 backdrop-blur-xl dark:bg-zinc-950/90">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-2 px-3 sm:h-[52px] sm:gap-3 sm:px-4 md:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex min-w-0 flex-1 items-center gap-2 transition-all sm:flex-none sm:gap-2.5"
            aria-label="Home"
          >
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg bg-zinc-50 ring-1 ring-black/10 transition-all group-hover:scale-[1.04] group-hover:ring-[#968e68]/40 dark:bg-zinc-900 dark:ring-white/10 sm:h-8 sm:w-8">
              <Image
                src="/ds.jpg"
                alt="Daddieshinor"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="min-w-0 leading-none">
              <span className="block truncate text-[15px] font-black tracking-tight text-black transition-colors group-hover:text-[#968e68] dark:text-white xs:text-base sm:text-xl">
                Daddieshinor
              </span>
              <span className="hidden text-[10px] font-medium tracking-wider text-black/50 dark:text-white/40 sm:block">
                RC 8937639
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-semibold tracking-tight transition-all duration-200 ${
                    active
                      ? "bg-black/6 text-black shadow-sm dark:bg-white/10 dark:text-white"
                      : "text-black/80 hover:bg-black/5 hover:text-black dark:text-white/80 dark:hover:bg-white/8 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-px left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-t-full bg-[#968e68]" />
                  )}
                </Link>
              );
            })}

            <div className="mx-3 h-4 w-px bg-black/10 dark:bg-white/10" />

            <Link
              href="/about"
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                isActive("/about")
                  ? "bg-black/6 text-black shadow-sm dark:bg-white/10 dark:text-white"
                  : "text-black/80 hover:bg-black/5 hover:text-black dark:text-white/80 dark:hover:bg-white/8 dark:hover:text-white"
              }`}
            >
              About
            </Link>
          </nav>

          <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-black/4 px-2.5 py-1 text-[11px] font-medium tabular-nums dark:bg-white/5 sm:text-xs">
              <span className="font-semibold text-[#968e68]">WAT</span>

              <span
                className={`text-black/80 dark:text-white/80 transition-all duration-300 ${
                  tick ? "scale-105 opacity-100" : "scale-100 opacity-90"
                }`}
              >
                {currentTime}
              </span>
            </div>

            {/* Desktop search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden md:block md:w-56 lg:w-72 xl:w-80"
              role="search"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50 dark:text-white/50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search thoughts..."
                aria-label="Search"
                className="h-9 w-full rounded-full border border-black/10 bg-white/70 pl-10 pr-10 text-sm placeholder:text-black/40 transition-all focus:border-[#968e68]/30 focus:outline-none focus:ring-2 focus:ring-[#968e68]/40 dark:border-white/10 dark:bg-zinc-900/70 dark:placeholder:text-white/40"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-black/55 transition hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>

            <button
              onClick={togglePlay}
              className={`grid h-8 w-8 place-items-center rounded-full border border-black/10 transition-all duration-200 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 sm:h-9 sm:w-9 ${
                isPlaying
                  ? "text-[#968e68] shadow-sm"
                  : "text-black/70 dark:text-white/60"
              }`}
              aria-label={isPlaying ? "Pause ambient" : "Play ambient"}
              aria-pressed={isPlaying}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="grid h-8 w-8 place-items-center rounded-full border border-black/10 transition-all hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5 sm:h-9 sm:w-9"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                ))}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="rounded-full p-1.5 text-black/70 transition hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search bar */}
      <div className="border-t border-black/5 bg-[#D9DCD6]/95 backdrop-blur-lg dark:border-white/5 dark:bg-zinc-950/85 md:hidden">
        <div className="px-3 py-2 sm:px-4 sm:py-2.5">
          <form onSubmit={handleSearchSubmit} className="relative" role="search">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50 dark:text-white/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Daddieshinor..."
              aria-label="Search"
              className="h-9 w-full rounded-full border border-black/10 bg-white/70 pl-10 pr-10 text-sm placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#968e68]/30 dark:border-white/10 dark:bg-zinc-900/60 dark:placeholder:text-white/40"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-black/55 transition hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isActive={isActive}
        theme={theme}
      />
    </>
  );
}