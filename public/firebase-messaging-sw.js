// Firebase Cloud Messaging Service Worker
// IMPORTANT: This file must use importScripts() — ES module imports (import/export)
// are NOT supported in service workers by default. This file runs in a separate
// worker context and is installed by the Firebase Web SDK for background notifications.
//
// NOTE FOR NATIVE (CAPACITOR) BUILDS:
// This service worker is irrelevant on native iOS/Android — WKWebView (iOS) does not
// support service workers, and Capacitor's native FCM plugin handles background
// notifications directly via the OS. This file is only active in the web browser build.

/* global self */

// Use the Firebase v8 compat (CDN) scripts which are SW-compatible
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Firebase config is injected at build time via the __FIREBASE_CONFIG__ token.
// In production CI, this file should be rewritten with real values via a build script.
// Do NOT hardcode credentials here — use the values substituted from environment variables.
const firebaseConfig = {
  apiKey: self.__FIREBASE_CONFIG_API_KEY__ || "REPLACE_ME",
  authDomain: self.__FIREBASE_CONFIG_AUTH_DOMAIN__ || "REPLACE_ME",
  projectId: self.__FIREBASE_CONFIG_PROJECT_ID__ || "REPLACE_ME",
  storageBucket: self.__FIREBASE_CONFIG_STORAGE_BUCKET__ || "REPLACE_ME",
  messagingSenderId: self.__FIREBASE_CONFIG_MESSAGING_SENDER_ID__ || "REPLACE_ME",
  appId: self.__FIREBASE_CONFIG_APP_ID__ || "REPLACE_ME",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages (app is in background or closed tab in browser)
// On native mobile, the OS FCM SDK handles this — this handler is never reached.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  const notificationTitle =
    payload.notification?.title ||
    payload.data?.title ||
    'إشعار جديد';

  const notificationOptions = {
    body:
      payload.notification?.body ||
      payload.data?.body ||
      '',
    icon: '/road-logo.webp',
    badge: '/road-logo.webp',
    // If a deep link URL is in the payload data, store it for the click handler
    data: {
      url: payload.data?.url || payload.data?.deepLink || '/',
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click in background (browser only)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If the app is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
