// src/components/ThoughtItem.tsx
import Image from "next/image";
import Link from "next/link";

type ThoughtItemProps = {
  tag: string;
  title: string;
  image: string;
  href: string;
};

export default function ThoughtItem({ tag, title, image, href }: ThoughtItemProps) {
  return (
    <Link href={href} className="group block">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {tag}
          </span>
          <h4 className="mt-1 text-lg font-bold leading-tight group-hover:text-[#968e68] transition-colors line-clamp-2">
            {title}
          </h4>
        </div>
      </div>
    </Link>
  );
}