"use client";

import { useEffect, useMemo, useState, ReactNode } from "react";
import { Facebook, Twitter, Linkedin, Mail, Link2 } from "lucide-react";

type Props = {
  title: string;
};

type ShareIconProps = {
  href: string;
  label: string;
  children: ReactNode;
};

function ShareIcon({ href, label, children }: ShareIconProps) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:bg-zinc-50 hover:shadow-md dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
    >
      {children}
    </a>
  );
}

export default function ShareBar({ title }: Props) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareText, setShareText] = useState("");

  useEffect(() => {
    const currentUrl = window.location.href;
    setShareUrl(encodeURIComponent(currentUrl));
    setShareText(encodeURIComponent(title));
  }, [title]);

  const rawUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const copyLink = async () => {
    try {
      if (!rawUrl) return;
      await navigator.clipboard.writeText(rawUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-black/8 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/50">
      <p className="text-xs font-black uppercase tracking-[0.20em] text-black/60 dark:text-white/60">
        Share
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <ShareIcon
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          label="Share on Facebook"
        >
          <Facebook className="h-4.5 w-4.5" />
        </ShareIcon>

        <ShareIcon
          href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
          label="Share on X"
        >
          <Twitter className="h-4.5 w-4.5" />
        </ShareIcon>

        <ShareIcon
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareText}`}
          label="Share on LinkedIn"
        >
          <Linkedin className="h-4.5 w-4.5" />
        </ShareIcon>

        <ShareIcon
          href={`mailto:?subject=${shareText}&body=Check out this article: ${shareUrl}`}
          label="Share by Email"
        >
          <Mail className="h-4.5 w-4.5" />
        </ShareIcon>

        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 text-xs font-extrabold uppercase tracking-wider text-black shadow-sm transition hover:bg-zinc-50 hover:shadow dark:border-white/10 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
        >
          <Link2 className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}