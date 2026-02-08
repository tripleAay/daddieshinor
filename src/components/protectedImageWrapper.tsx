// components/ProtectedImageWrapper.tsx
"use client";

import Image from "next/image";
import { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  containerClassName?: string;
};

export default function ProtectedImageWrapper({
  src,
  alt,
  width,
  height,
  className = "",
  containerClassName = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-zinc-100 ring-2 ring-[#968e68]/30 dark:bg-zinc-900 dark:ring-[#968e68]/20 shadow-md ${containerClassName}`}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`h-full w-full object-cover pointer-events-none select-none ${className}`}
        priority
        draggable={false}
      />
      {/* Invisible overlay – blocks interaction */}
      <div className="absolute inset-0 z-10" />
    </div>
  );
}