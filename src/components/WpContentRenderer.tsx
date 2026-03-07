import parse, { domToReact, HTMLReactParserOptions, Element } from "html-react-parser";
import Image from "next/image";

type Props = {
  html: string;
};

export default function WpContentRenderer({ html }: Props) {
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (!(node instanceof Element)) return;

      if (node.name === "blockquote") {
        return (
          <blockquote className="my-10 rounded-2xl border-l-4 border-orange-500 bg-orange-50 p-6 dark:bg-zinc-900/60">
            <div className="text-[17px] leading-[1.9] font-medium text-black/85 dark:text-white/85">
              {domToReact(node.children as any, {
                replace: (child) => {
                  if (!(child instanceof Element)) return;
                  if (child.name === "p") {
                    return (
                      <div className="m-0 [&:not(:first-child)]:mt-4">
                        {domToReact(child.children as any)}
                      </div>
                    );
                  }
                },
              })}
            </div>
          </blockquote>
        );
      }

      if (node.name === "img") {
        const src = node.attribs?.src;
        const alt = node.attribs?.alt || "";
        const width = Number(node.attribs?.width) || 1200;
        const height = Number(node.attribs?.height) || 675;

        if (!src) return null;

        return (
          <figure className="my-10">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(max-width: 768px) 100vw, 720px"
                className="h-auto w-full object-cover"
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

      if (node.name === "h2") {
        return (
          <h2 className="mt-14 scroll-mt-28 text-3xl font-black tracking-tight">
            {domToReact(node.children as any)}
          </h2>
        );
      }

      if (node.name === "p") {
        return (
          <p className="my-5 text-[18px] leading-[1.95] text-black/85 dark:text-white/85">
            {domToReact(node.children as any)}
          </p>
        );
      }

      if (node.name === "a") {
        const href = node.attribs?.href || "#";
        const isExternal = href.startsWith("http");

        return (
          <a
            href={href}
            className="underline decoration-black/30 underline-offset-4 hover:decoration-black dark:decoration-white/30 dark:hover:decoration-white"
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {domToReact(node.children as any)}
          </a>
        );
      }
    },
  };

  return <>{parse(html, options)}</>;
}