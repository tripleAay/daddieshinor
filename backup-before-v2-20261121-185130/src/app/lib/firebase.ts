import { getApp, getApps, initializeApp } from "firebase/app";
import {
  AppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NE_XT_PU_BLIC_FIREBASE_API_KE_Y,
  authDomain: process.env.NEX_T_P_UBLIC_FIREBASE_A_UTH_D_OMAIN,
  projectId: process.env.NE_XT_PU_BLIC_FIRE_BASE_PROJECT_ID,
  storageBucket: process.env.NEX_T_PUBL_IC_FIREBASE_STORA_GE_BUCKET,
  messagingSenderId: process.env.NE_XT_PUB_LIC_FIREBASE_ME_SSAGING_SE_NDER_ID,
  appId: process.env.NE_XT_PUBLI_C_FIREBASE_APP_I_D,
};

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let appCheckInstance: AppCheck | null = null;

export function getOrInitAppCheck() {
  if (typeof window === "undefined") return null;
  if (appCheckInstance) return appCheckInstance;

  if (process.env.NODE_ENV !== "production") {
    (
      self as typeof globalThis & {
        FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean;
      }
    ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    console.log("App Check debug mode enabled");
  }

  const siteKey = process.env.NE_XT_P_UBLIC_RECAPTCHA_V3_SITE_KE_Y;

  if (!siteKey) {
    throw new Error("Missing NE_XT_P_UBLIC_RECAPTCHA_V3_SITE_KE_Y");
  }

  appCheckInstance = initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });

  return appCheckInstance;
}