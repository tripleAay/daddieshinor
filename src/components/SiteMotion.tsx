"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content remains visible without JavaScript. */
export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const targets = new Set<HTMLElement>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("ds-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    const scan = () => {
      document.querySelectorAll<HTMLElement>(
        "main > section, main > div > section, main > div > div > section, footer, .ds-article-page main > div > h1, .ds-article-page main > div > .mt-6, .ds-category-page main > div > div, [data-editorial-reveal]"
      ).forEach((element) => {
        if (targets.has(element) || element.closest('[role="dialog"]')) return;
        // Avoid animating both a section and a nested section together.
        if (element.parentElement?.closest('.ds-reveal')) return;
        targets.add(element);
        element.classList.add("ds-reveal");
        observer.observe(element);
      });
    };

    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    scan();
    mutations.observe(document.body, { childList: true, subtree: true });

    const revealAll = () => {
      if (preference.matches) targets.forEach((element) => element.classList.add("ds-revealed"));
    };
    preference.addEventListener("change", revealAll);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", revealAll);
      targets.forEach((element) => element.classList.remove("ds-reveal", "ds-revealed"));
    };
  }, [pathname]);

  return null;
}
