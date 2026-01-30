// components/SubscribeModalTrigger.tsx  (or wherever you have it)
"use client";

import { useEffect, useState } from "react";
import { SubscribeModal } from "./subscribeModal"; // adjust path

const STORAGE_KEY = "daddieshinor_subscribe_seen_v1"; // bump version if you change logic

export function SubscribeModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false); // prevent flash before check

  useEffect(() => {
    // Guard: only run in browser
    if (typeof window === "undefined") return;

    const hasSeen = localStorage.getItem(STORAGE_KEY);

    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // 5 seconds delay – feels natural, not intrusive

      return () => clearTimeout(timer);
    }

    setHasChecked(true);
  }, []);

  const handleClose = () => {
    // Only set if in browser (redundant but safe)
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    setIsOpen(false);
  };

  // Don't render anything until we've checked storage (avoids mismatch)
  if (!hasChecked) return null;

  return <SubscribeModal isOpen={isOpen} onClose={handleClose} />;
}