"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Sun, Moon, Play, Pause } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import MobileMenu from "@/components/mobileMenu";
import { useAudio } from "../components/audioProvider";

const nav = [
  { label: "Tech", href: "/tech" },
  { label: "Culture", href: "/culture" },
  { label: "Branding", href: "/branding" },
  { label: "Life", href: "/life" },
];

type Theme = "light" | "dark";

const ACCENT = "#968e68";

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
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatWATTime());
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
    const id = setInterval(() => setCurrentTime(formatWATTime()), 30000);
    return () => clearInterval(id);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const searchHref = useMemo(
    () => (q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"),
    [q],
  );

  return (
    <>
      <header   className="
    sticky top-0 z-50 w-full 
    bg-[#D0CD94] backdrop-blur-xl 
    dark:bg-zinc-950/85
  "
>
        <div className="mx-auto flex h-12 sm:h-[52px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* LEFT – Logo + mobile menu */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden -ml-2 rounded-full p-2 text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5 transition"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-all"
              aria-label="Home"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-lg ring-1 ring-black/10 dark:ring-white/10 bg-zinc-50 dark:bg-zinc-900 transition-all group-hover:ring-accent/40 group-hover:scale-[1.04]">
                <Image
                  src="/ds.jpg"
                  alt="Daddieshinor"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tight text-black dark:text-white group-hover:text-[#968e68] transition-colors">
                  Daddieshinor
                </span>
                <span className="text-[10px] font-medium text-black/50 dark:text-white/40 tracking-wider">
                  RC 8937639
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER – Navigation (desktop only) */}
          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 py-1.5 text-sm font-semibold tracking-tight rounded-full transition-all duration-200
                    ${
                      active
                        ? "bg-black/6 text-black shadow-sm dark:bg-white/10 dark:text-white"
                        : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/8"
                    }
                  `}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-px left-1/2 h-0.5 w-3 -translate-x-1/2 bg-[#968e68] rounded-t-full" />
                  )}
                </Link>
              );
            })}

            <div className="mx-3 h-4 w-px bg-black/10 dark:bg-white/10" />

            <Link
              href="/about"
              className={`
                px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200
                ${
                  isActive("/about")
                    ? "bg-black/6 text-black shadow-sm dark:bg-white/10 dark:text-white"
                    : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/8"
                }
              `}
            >
              About
            </Link>
          </nav>

          {/* RIGHT – Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* WAT time – desktop only */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-black/4 dark:bg-white/5 text-xs font-medium tabular-nums">
              <span className="text-[#968e68] font-semibold">WAT</span>
              <span className="text-black/70 dark:text-white/70">{currentTime}</span>
            </div>

            {/* Search (desktop) */}
            <div className="hidden md:block relative w-72 lg:w-80 xl:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50 dark:text-white/50 pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search thoughts..."
                className="
                  h-9 w-full pl-10 pr-4 text-sm bg-white/70 dark:bg-zinc-900/70
                  border border-black/10 dark:border-white/10 rounded-full
                  placeholder:text-black/40 dark:placeholder:text-white/40
                  focus:outline-none focus:ring-2 focus:ring-[#968e68]/40 focus:border-[#968e68]/30
                  transition-all
                "
              />
            </div>

            {/* Mobile search icon */}
            <Link
              href={q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"}
              className="md:hidden h-9 w-9 rounded-full grid place-items-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            {/* Audio toggle */}
            <button
              onClick={togglePlay}
              className={`
                h-9 w-9 rounded-full border border-black/10 dark:border-white/10
                grid place-items-center transition-all duration-200
                hover:bg-black/5 dark:hover:bg-white/5
                ${isPlaying ? "text-[#968e68] shadow-sm" : "text-black/70 dark:text-white/60"}
              `}
              aria-label={isPlaying ? "Pause ambient" : "Play ambient"}
            >
              {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5" />}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="
                h-9 w-9 rounded-full border border-black/10 dark:border-white/10
                grid place-items-center transition-all hover:bg-black/5 dark:hover:bg-white/5
              "
              aria-label="Toggle theme"
            >
              {mounted && (theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />)}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom search bar */}
      <div className="md:hidden border-t border-black/6 dark:border-white/8 bg-[#D0CD94] dark:bg-zinc-950/80 backdrop-blur-lg">
        <div className="px-4 py-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/50 dark:text-white/50 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Daddieshinor..."
              className="
                h-9 w-full pl-10 pr-4 text-sm rounded-full bg-white/70 dark:bg-zinc-900/60
                border border-black/10 dark:border-white/10
                placeholder:text-black/40 dark:placeholder:text-white/40
                focus:outline-none focus:ring-2 focus:ring-[#968e68]/30
              "
            />
          </div>
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