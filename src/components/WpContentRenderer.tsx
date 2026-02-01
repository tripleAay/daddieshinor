"use client";

import parse, { domToReact } from "html-react-parser";
import Image from "next/image";

type Props = {
  html: string;
};

export default function WpContentRenderer({ html }: Props) {
  return parse(html, {
    replace: (node: any) => {
      if (!node?.name) return;

      // ✅ Upgrade blockquotes → Daddieshinor callout (NO nested <p>)
      if (node.name === "blockquote") {
        return (
          <div className="my-10 rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-6 dark:bg-zinc-900/60">
            <div className="text-[17px] leading-[1.9] font-medium text-black/85 dark:text-white/85">
              {domToReact(node.children, {
                replace: (child: any) => {
                  // If WP puts <p> inside blockquote, render it as <div> to avoid <p> nesting issues anywhere
                  if (child?.name === "p") {
                    return (
                      <div className="m-0 [&:not(:first-child)]:mt-4">
                        {domToReact(child.children)}
                      </div>
                    );
                  }
                },
              })}
            </div>
          </div>
        );
      }

      // ✅ Upgrade images (ensure sizes exists)
      if (node.name === "img") {
        const src = node.attribs?.src;
        const alt = node.attribs?.alt || "";

        if (!src) return null;

        return (
          <figure className="my-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>

            {alt ? (
              <figcaption className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                {alt}
              </figcaption>
            ) : null}
          </figure>
        );
      }

      // ✅ Emphasise H2 sections
      if (node.name === "h2") {
        return (
          <h2 className="mt-14 scroll-mt-28 text-3xl font-black tracking-tight">
            {domToReact(node.children)}
          </h2>
        );
      }

      // ✅ Optional: enforce better paragraph spacing + justified body text
      // (If you prefer to do this only in PostLayout prose styles, remove this block.)
      if (node.name === "p") {
        return (
          <p className="my-5 text-[18px] leading-[1.95] text-justify text-black/85 dark:text-white/85">
            {domToReact(node.children)}
          </p>
        );
      }
    },
  });
}
