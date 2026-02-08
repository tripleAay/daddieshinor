"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
  theme?: "light" | "dark"; // optional, kept for compatibility
};

const nav = [
  { label: "Tech", href: "/tech" },
  { label: "Culture", href: "/culture" },
  { label: "Branding", href: "/branding" },
  { label: "Life", href: "/life" },
  { label: "About", href: "/about" },
];

export default function MobileMenu({
  isOpen,
  onClose,
  isActive,
}: MobileMenuProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure portal renders only on client
  useEffect(() => setMounted(true), []);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="
              fixed top-0 left-0 z-[10000] h-[100dvh] w-4/5 max-w-xs
              bg-white dark:bg-zinc-950
              shadow-2xl lg:hidden
              flex flex-col
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header row */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-2xl font-black text-black dark:text-white">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                <X className="h-7 w-7 text-black dark:text-white" />
              </button>
            </div>

            {/* Navigation links – Home first */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-3">
              {/* Home – only shown in mobile menu */}
              <Link
                href="/"
                onClick={onClose}
                className={`
                  block px-6 py-5 rounded-xl text-xl font-semibold tracking-tight
                  transition-all duration-200
                  ${
                    isActive("/")
                      ? "bg-[#968e68]/15 text-[#968e68] font-bold"
                      : "text-black dark:text-white hover:bg-[#968e68]/8 hover:text-[#968e68] dark:hover:bg-[#968e68]/12 dark:hover:text-[#a8a07a]"
                  }
                `}
              >
                Home
              </Link>

              {/* Rest of the navigation */}
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`
                      block px-6 py-5 rounded-xl text-xl font-semibold tracking-tight
                      transition-all duration-200
                      ${
                        active
                          ? "bg-[#968e68]/15 text-[#968e68] font-bold"
                          : "text-black dark:text-white hover:bg-[#968e68]/8 hover:text-[#968e68] dark:hover:bg-[#968e68]/12 dark:hover:text-[#a8a07a]"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}