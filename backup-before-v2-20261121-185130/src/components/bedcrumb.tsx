import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbProps = {
    category: string;
    title: string;
};

export function Breadcrumb({ category, title }: BreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-4 flex flex-wrap items-center gap-1 text-xs font-semibold text-black/60 dark:text-white/60"
        >
            <Link
                href="/"
                className="hover:text-[#968e68] transition-colors"
            >
                Home
            </Link>

            <ChevronRight className="h-3 w-3 opacity-50 text-[#968e68]" />

            <Link
                href={`/${category.toLowerCase()}`}
                className="uppercase tracking-wide hover:text-[#968e68] transition-colors"
            >
                {category}
            </Link>

            <ChevronRight className="h-3 w-3 opacity-50 text-[#968e68]" />


            <span className="truncate max-w-[260px] text-black/80 dark:text-white/80">
                {title}
            </span>
        </nav>
    );
}
