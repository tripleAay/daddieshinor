"use client";

import { useEffect, useState } from "react";
import { SubscribeModal } from "@/components/subscribeModal";

const FOREVER_KEY = "daddieshinor_subscribe_seen_v1";
const SESSION_KEY = "daddieshinor_subscribe_closed_session";

export function SubscribeModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSubscribed = localStorage.getItem(FOREVER_KEY);
    const closedThisSession = sessionStorage.getItem(SESSION_KEY);

    setHasChecked(true);

    if (!hasSubscribed && !closedThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "true");
    }
    setIsOpen(false);
  };

  if (!hasChecked) return null;

  return <SubscribeModal isOpen={isOpen} onClose={handleClose} />;
}