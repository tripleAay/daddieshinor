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
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export default function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { isPlaying, togglePlay } = useAudio();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme")) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next: Theme = media.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };

    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  const [q, setQ] = useState("");
  const searchHref = useMemo(
    () => (q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"),
    [q]
  );

  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/90 backdrop-blur-md dark:border-white/10 dark:bg-black/90">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:h-16 lg:px-8">
        {/* Left: menu button + brand */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden rounded-full p-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#968e68]/60"
          >
            <Menu className="h-5 w-5 text-black/80 dark:text-white/80" />
          </button>

          {/* Brand with flip logo + accent hover */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-all duration-300"
            aria-label="Daddieshinor Home"
          >
            {/* Logo with 3D flip effect */}
            <span
              className="
                relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-xl
                ring-1 ring-black/10 dark:ring-white/10 bg-zinc-100 dark:bg-zinc-900
                transition-all duration-700
                group-hover:rotate-y-180 group-hover:scale-110 group-hover:ring-[#968e68]/50
                preserve-3d
              "
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                src="/ds.jpg"
                alt="Daddieshinor"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
            </span>

            {/* Text changes to accent color on hover */}
            <span
              className="
                text-xl sm:text-2xl font-black tracking-tight
                text-black dark:text-white
                group-hover:text-[#968e68]
                transition-colors duration-300
              "
            >
              Daddieshinor
            </span>
          </Link>
        </div>

        {/* Center nav – desktop only */}
        <nav className="hidden lg:flex items-center gap-1.5 ml-2">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-all ${
                  active
                    ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
                    : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#968e68]/60`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-t bg-[#968e68]" />
                )}
              </Link>
            );
          })}

          <div className="mx-3 h-5 w-px bg-black/10 dark:bg-white/10" />

          <Link
            href="/about"
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              isActive("/about")
                ? "bg-black/5 dark:bg-white/10 text-black dark:text-white shadow-sm"
                : "text-black/80 hover:text-black hover:bg-black/5 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#968e68]/60`}
          >
            About
          </Link>
        </nav>

        {/* Desktop search */}
        <div className="flex-1 hidden md:flex justify-center">
          <div className="w-full max-w-[720px] lg:max-w-[900px] xl:max-w-[1000px]">
            <form
              action="/search"
              className="relative"
              onSubmit={(e) => {
                if (!q.trim()) e.preventDefault();
              }}
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-black/60 dark:text-white/60" />
              <input
                suppressHydrationWarning
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search essays, thoughts, culture, tech..."
                autoComplete="off"
                spellCheck={false}
                className="
                  h-12 w-full rounded-full border border-black/10 bg-white/90 pl-14 pr-6 text-sm font-medium text-black
                  placeholder:text-black/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#968e68]/40 focus:border-[#968e68]/50
                  transition-all dark:border-white/15 dark:bg-black/70 dark:text-white dark:placeholder:text-white/50
                  dark:focus:ring-[#968e68]/50 dark:focus:border-[#968e68]/60
                "
              />
            </form>
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href={q.trim() ? searchHref : "/search"}
            aria-label="Search"
            className="md:hidden h-10 w-10 rounded-full border border-black/10 bg-white/80 hover:bg-black/5 transition-all dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#968e68]/60 grid place-items-center"
          >
            <Search className="h-5 w-5" />
          </Link>

          {/* Audio Toggle */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause ambient music" : "Play ambient music"}
            className={`
              h-10 w-10 rounded-full border border-black/10 bg-white/80
              hover:bg-black/5 hover:border-[#968e68]/40 hover:shadow-md hover:ring-1 hover:ring-[#968e68]/30
              transition-all duration-300 dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#968e68]/60
              ${isPlaying ? "text-[#968e68] shadow-sm" : "text-black/70 dark:text-white/70"}
            `}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 mx-auto" />
            ) : (
              <Play className="h-5 w-5 mx-auto" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="
              h-10 w-10 rounded-full border border-black/10 bg-white/80
              hover:bg-black/5 hover:border-[#968e68]/40 hover:shadow-sm
              transition-all dark:border-white/10 dark:bg-black/80 dark:hover:bg-white/10
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#968e68]/60
            "
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5 mx-auto" />
              ) : (
                <Moon className="h-5 w-5 mx-auto" />
              )
            ) : null}
          </button>
        </div>
      </div>

      {/* Mobile inline search bar */}
      <div className="md:hidden border-t border-black/5 dark:border-white/10 px-4 pb-4 pt-3">
        <form
          action="/search"
          className="relative"
          onSubmit={(e) => {
            if (!q.trim()) e.preventDefault();
          }}
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-black/60 dark:text-white/60" />
          <input
            suppressHydrationWarning
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Daddieshinor essays..."
            autoComplete="off"
            spellCheck={false}
            className="
              h-12 w-full rounded-full border border-black/10 bg-white/90 pl-14 pr-6 text-sm font-medium text-black
              placeholder:text-black/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#968e68]/40 focus:border-[#968e68]/50
              transition-all dark:border-white/15 dark:bg-black/70 dark:text-white dark:placeholder:text-white/50
              dark:focus:ring-[#968e68]/50 dark:focus:border-[#968e68]/60
            "
          />
        </form>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        isActive={isActive}
        theme={theme}
      />
    </header>
  );
}