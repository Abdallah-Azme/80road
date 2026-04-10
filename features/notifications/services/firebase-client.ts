import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  onMessage,
  Messaging,
  MessagePayload,
} from "firebase/messaging";

// ──────────────────────────────────────────────────────────────────────────────
// Firebase Web SDK — for browser (web) environments ONLY
//
// ⚠️  DO NOT use this module on native Capacitor (iOS / Android).
//     On native platforms:
//       - WKWebView (iOS) does not support service workers → getMessaging() fails silently
//       - Firebase Web SDK generates VAPID web tokens, NOT native FCM device tokens
//       - Use @capacitor/push-notifications instead (see use-fcm.ts)
//
// This module is only active in the WEB BROWSER build.
// The `isNativePlatform()` guards in use-fcm.ts and NotificationBell.tsx
// ensure this is never reached on native platforms.
// ──────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messaging: Messaging | null = null;

/**
 * Returns the Firebase Messaging singleton for the WEB build.
 * Returns null on:
 * - Server (SSR/build time) — window is undefined
 * - Native Capacitor (iOS/Android) — Messaging is not supported in WebView
 * - If Firebase init fails for any reason
 */
export const getFirebaseMessaging = (): Messaging | null => {
  // Server guard — never initialise during SSR
  if (typeof window === "undefined") return null;

  // Native platform guard — Firebase Web SDK doesn't work inside WKWebView /
  // Android WebView. Capacitor push-notifications plugin handles native FCM.
  try {
    // Dynamic check to avoid importing @capacitor/core at module load time
    // (which would fail during static export if not guarded properly)
    const isCapacitorNative =
      typeof (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
        .Capacitor?.isNativePlatform === "function" &&
      (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } })
        .Capacitor!.isNativePlatform!();

    if (isCapacitorNative) {
      // Native platform — callers should use PushNotifications plugin instead
      return null;
    }
  } catch {
    // Capacitor not present (pure web browser) — proceed normally
  }

  try {
    if (!messaging) {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (e) {
    console.warn("[Firebase] Messaging init failed (likely no service worker support):", e);
    return null;
  }
};

/**
 * Listens for push notifications while the app is in the foreground (WEB only).
 * On native platforms, use the `pushNotificationReceived` listener from
 * @capacitor/push-notifications instead.
 *
 * Returns an unsubscribe function — call it in useEffect cleanup.
 */
export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
): (() => void) => {
  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) {
    // Not on web or messaging not available — return a no-op unsubscribe
    return () => {};
  }
  return onMessage(messagingInstance, (payload: MessagePayload) => {
    callback(payload);
  });
};
