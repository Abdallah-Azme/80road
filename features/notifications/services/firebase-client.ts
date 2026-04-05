import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  onMessage,
  Messaging,
  MessagePayload,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let messaging: Messaging | null = null;

// Lazy singleton — initialized only when first called in the browser, never at module load time.
export const getFirebaseMessaging = (): Messaging | null => {
  if (typeof window === "undefined") return null;
  try {
    if (!messaging) {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (e) {
    console.warn("Firebase Messaging init failed:", e);
    return null;
  }
};

// Helper for listening to messages in the foreground
export const onForegroundMessage = (
  callback: (payload: MessagePayload) => void
) => {
  const messagingInstance = getFirebaseMessaging();
  if (messagingInstance) {
    return onMessage(messagingInstance, (payload: MessagePayload) => {
      console.log("Foreground message received:", payload);
      callback(payload);
    });
  }
  return () => {};
};
