import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let appCheckInstance: ReturnType<typeof getAppCheck> | null = null;

export function getOrInitAppCheck() {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  if (process.env.NODE_ENV !== "production") {
    (self as typeof globalThis & { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log("App Check debug mode enabled");
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;

  if (!siteKey) {
    throw new Error("Missing NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY");
  }

  appCheckInstance = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });

  return appCheckInstance;
}