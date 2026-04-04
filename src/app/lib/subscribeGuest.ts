"use client";

import { getToken } from "firebase/app-check";
import { getOrInitAppCheck } from "@/app/lib/firebase";

type SubscribeGuestInput = {
  email: string;
  name?: string;
  source?: string;
};

type SubscribeGuestResponse = {
  ok: boolean;
  message: string;
  duplicate?: boolean;
};

export async function subscribeGuest({
  email,
  name = "",
  source = "daddieshinor_modal",
}: SubscribeGuestInput): Promise<SubscribeGuestResponse> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanEmail) {
    throw new Error("Email is required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  const appCheck = getOrInitAppCheck();

  if (!appCheck) {
    throw new Error("App Check failed to initialize.");
  }

  const { token } = await getToken(appCheck, false);

  const response = await fetch("/api/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Firebase-AppCheck": token,
    },
    body: JSON.stringify({
      email: cleanEmail,
      name: cleanName,
      source,
    }),
  });

  const data = (await response.json()) as SubscribeGuestResponse;

  if (!response.ok) {
    throw new Error(data.message || "Subscription failed.");
  }

  return data;
}