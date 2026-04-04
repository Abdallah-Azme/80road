// Service worker template for handling background notifications
// Copy this file to your app's public/ folder as firebase-messaging-sw.js
// and replace the placeholder values with your actual Firebase config.

/* global self */
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyC6ZAwuIGCrkSZrGn26HTJK3V1Ktllz7Dc",
  authDomain: "road-d5491.firebaseapp.com",
  projectId: "road-d5491",
  storageBucket: "road-d5491.firebasestorage.app",
  messagingSenderId: "188664861433",
  appId: "1:188664861433:web:990f5a1ffbcb31ee678828",
  measurementId: "G-V7BB3H3VJW"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle messaging in the background
onBackgroundMessage(messaging, (payload) => {
  console.log("[Service Worker] Received background message:", payload);

  const notificationTitle =
    payload.data?.title || payload.notification?.title || "New Message";
  const notificationOptions = {
    body:
      payload.data?.body ||
      payload.notification?.body ||
      "Check your notifications.",
    icon: payload.data?.icon || "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
