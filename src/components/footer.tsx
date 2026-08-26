"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  ExternalLink,
} from "lucide-react";
import { FaTiktok, FaMedium } from "react-icons/fa6";
import LatestComponent from "@/components/latest";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/daddieshinorhq/",
    icon: Instagram,
    description: "Daddieshinor on Instagram",
  },
  {
    name: "X",
    href: "https://x.com/daddieshinorhq",
    icon: Twitter,
    description: "Daddieshinor on X",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@daddieshinorhq",
    icon: FaTiktok,
    description: "Daddieshinor on TikTok",
  },
  {
    name: "Medium",
    href: "https://medium.com/@daddieshinor",
    icon: FaMedium,
    description: "Daddieshinor on Medium",
  },
];

export default function PostFooter() {
  const [showLatest, setShowLatest] = useState(false);

  return (
    <>
      <footer className="mt-16 rounded-xl border-t border-zinc-200/70 pt-12 pb-16 backdrop-blur-sm dark:border-zinc-800/70 dark:bg-zinc-950/40 md:mt-24">
        <div className="mx-auto max-w-4xl px-5 md:px-0">
          {/* Brand identity */}
          <div className="mb-10 text-center">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-black tracking-tight text-black dark:text-white sm:text-3xl">
                Daddieshinor
              </h2>
            </Link>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
              A media platform exploring technology, culture, life, and brands
              with depth, clarity, and perspective.
            </p>
          </div>

          {/* Daddieshinor social accounts */}
          <div className="mb-5 text-center">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Follow Daddieshinor
            </p>

            <div className="flex justify-center">
              <div className="flex items-center gap-5 rounded-full border border-black/5 bg-white/60 px-6 py-3 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/50">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.description}
                      title={social.description}
                      className="text-zinc-400 transition-all duration-300 hover:scale-110 hover:text-[#968e68]"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}

                <Link
                  href="/"
                  aria-label="Visit Daddieshinor website"
                  title="Daddieshinor website"
                  className="text-zinc-400 transition-all duration-300 hover:scale-110 hover:text-[#968e68]"
                >
                  <Globe className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          
          {/* Footer navigation */}
          <div className="mb-10 grid grid-cols-2 gap-8 text-center text-sm sm:grid-cols-4">
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                Explore
              </h4>


              

              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => setShowLatest(true)}
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Latest
                  </button>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/author"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Author
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                Legal
              </h4>

              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Terms
                  </Link>
                </li>

                <li>
                  <Link
                    href="/cookies"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
                Work With Us
              </h4>

              <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <li>
                  <Link
                    href="/advertise"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Advertise
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-black dark:hover:text-white"
                  >
                    Partnerships
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:mt-0">
                Built slowly.
                <br />
                Written thoughtfully.
              </p>

              <Link
                href="/author"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-black transition-colors hover:text-[#968e68] dark:text-white dark:hover:text-[#c5bc8d]"
              >
                Meet the author
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-zinc-200/70 bg-white/40 py-6 dark:border-zinc-800/70 dark:bg-zinc-950/40">
          <div className="mx-auto max-w-4xl px-5 text-center text-xs text-zinc-500 dark:text-zinc-400 md:px-0">
            <p>
              © {new Date().getFullYear()} Daddieshinor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {showLatest && (
        <LatestComponent onClose={() => setShowLatest(false)} />
      )}
    </>
  );
}