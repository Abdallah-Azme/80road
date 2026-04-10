import { useState, useEffect, useCallback, useRef } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "../services/firebase-client";
import { notificationsService } from "../services/notifications.service";
import { toast } from "sonner";

// ──────────────────────────────────────────────────────────────────────────────
// FCM Token Backend Sync
// Routes through the authenticated api-client so the Bearer token is included.
// ──────────────────────────────────────────────────────────────────────────────
async function syncTokenWithBackend(deviceToken: string): Promise<void> {
  try {
    const platform = getPlatformName();
    await notificationsService.registerDevice(deviceToken, platform);
    console.log("✅ FCM token synced to backend.");
  } catch (error) {
    // Non-fatal — log and continue. Token sync will be retried on next mount.
    console.error("⚠️ Failed to sync FCM token to backend:", error);
  }
}

function getPlatformName(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Capacitor } = require("@capacitor/core");
    return Capacitor.getPlatform(); // 'android', 'ios', or 'web'
  } catch {
    return "web";
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Android Notification Channel Setup
// Android 8.0+ (API 26+) requires notifications to be posted to a named
// channel. Without this, all notifications are silently dropped.
// The Capacitor plugin creates a default channel, but this function ensures
// the channel exists with the correct settings.
// ──────────────────────────────────────────────────────────────────────────────
async function ensureNotificationChannel(): Promise<void> {
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.getPlatform() === "android") {
      const { PushNotifications } = await import("@capacitor/push-notifications");
      await PushNotifications.createChannel({
        id: "80road_default",
        name: "إشعارات 80road",
        description: "الإشعارات العامة لتطبيق 80road",
        importance: 4, // IMPORTANCE_HIGH — makes notifications appear as heads-up
        visibility: 1, // VISIBILITY_PUBLIC
        sound: "default",
        vibration: true,
        lights: true,
      });
    }
  } catch (e) {
    // createChannel may throw on non-Android — safe to ignore
    console.warn("Could not create notification channel:", e);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// useFcm Hook
// ──────────────────────────────────────────────────────────────────────────────
export const useFcm = (vapidKey: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported" | "granted" | "denied" | "prompt" | "prompt-with-rationale" | string
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  // Track whether listeners have already been attached to avoid the leak
  // that occurs when the component unmounts and remounts during navigation.
  const listenersAttached = useRef(false);

  // ──────────────────────────────────────────────────────────────────────────
  // Check current permission status on mount
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkPerms = async () => {
      if (typeof window !== "undefined") {
        try {
          const { Capacitor } = await import("@capacitor/core");
          if (Capacitor.isNativePlatform()) {
            const { PushNotifications } = await import("@capacitor/push-notifications");
            const status = await PushNotifications.checkPermissions();
            setNotificationPermission(status.receive);
            return;
          }
        } catch (e) {
          console.warn("Capacitor evaluate skipped on web", e);
        }

        if (!("Notification" in window)) {
          setNotificationPermission("unsupported");
          return;
        }
        setNotificationPermission(Notification.permission);
      }
    };
    checkPerms();
  }, []);

  // ──────────────────────────────────────────────────────────────────────────
  // Attach native push notification listeners
  //
  // CRITICAL FIX: PushNotifications.addListener() accumulates listeners
  // on every mount. The `listenersAttached` ref prevents duplicate listeners
  // from building up during navigation-triggered re-mounts.
  // The cleanup function calls removeAllListeners() on unmount.
  // ──────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const setupListeners = async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;

        // Guard against attaching listeners more than once per component lifecycle
        if (listenersAttached.current) return;
        listenersAttached.current = true;

        const { PushNotifications } = await import("@capacitor/push-notifications");

        // Ensure the Android notification channel exists
        await ensureNotificationChannel();

        // ── Token Registration ──
        // Fires when FCM successfully registers the device and returns a token.
        // This is the FCM NATIVE token (not a VAPID/web token).
        await PushNotifications.addListener("registration", async (nativeToken) => {
          if (!isMounted) return;
          const tokenValue = nativeToken.value;
          console.log("📱 Native FCM Token:", tokenValue);
          setToken(tokenValue);
          // ✅ CRITICAL: Sync the token to the backend so the server can send
          // push notifications to this device.
          await syncTokenWithBackend(tokenValue);
        });

        // ── Registration Error ──
        await PushNotifications.addListener("registrationError", (error) => {
          if (!isMounted) return;
          console.error("📱 FCM registration error:", error);
          // Common causes:
          // - iOS: Push capability not enabled in Xcode
          // - iOS: GoogleService-Info.plist missing
          // - iOS: APNs Key not uploaded to Firebase Console
          // - Android: google-services.json mismatch
          // - Android: Firebase BoM not included in build.gradle
        });

        // ── Foreground Notification Received ──
        // OS delivers the notification payload to the app while it is open.
        // On Android, the system notification is NOT shown automatically in
        // foreground — we must display it manually (via toast here).
        await PushNotifications.addListener("pushNotificationReceived", (notification) => {
          if (!isMounted) return;
          console.log("📱 Foreground notification received:", notification);
          toast(notification.title || "إشعار جديد", {
            description: notification.body || "",
          });
        });

        // ── Notification Tap (Action Performed) ──
        // CRITICAL FIX: This listener was completely absent.
        // It fires when the user taps a notification from the system tray
        // while the app is in background or the killed state.
        // Without it, tapping a notification opens the app at the root with
        // no navigation to the relevant content.
        await PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
          if (!isMounted) return;
          console.log("📱 Notification tapped:", action);

          // Check for a deep link URL in the notification data payload.
          // The backend should send a `url` or `deepLink` field in the data object.
          const deepLink =
            action.notification?.data?.url ||
            action.notification?.data?.deepLink ||
            action.notification?.data?.route;

          if (deepLink && typeof window !== "undefined") {
            // Use window.location for hard navigation — this works in the
            // WebView even without a Next.js router reference here.
            window.location.href = deepLink;
          }
        });

        // If already granted, register immediately to get/refresh the token
        const res = await PushNotifications.checkPermissions();
        if (res.receive === "granted") {
          await PushNotifications.register();
        }
      } catch (e) {
        console.warn("Capacitor push setup failed:", e);
      }
    };

    setupListeners();

    // ── Cleanup: Remove all listeners on unmount ──
    // This prevents the listener leak that was causing duplicate notifications.
    return () => {
      isMounted = false;
      listenersAttached.current = false;

      import("@capacitor/core")
        .then(({ Capacitor }) => {
          if (Capacitor.isNativePlatform()) {
            return import("@capacitor/push-notifications").then(({ PushNotifications }) => {
              PushNotifications.removeAllListeners();
            });
          }
        })
        .catch(() => {
          // Not native — nothing to clean up
        });
    };
  }, []); // Empty deps: attach once per component mount lifecycle

  // ──────────────────────────────────────────────────────────────────────────
  // Request Permission (user-triggered)
  //
  // IMPORTANT: This function must be called from a user interaction context
  // (e.g., button click). Do NOT call it automatically on mount — best practice
  // is to show a custom rationale dialog first (pre-permission UX).
  // ──────────────────────────────────────────────────────────────────────────
  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      let isNative = false;
      try {
        const { Capacitor } = await import("@capacitor/core");
        isNative = Capacitor.isNativePlatform();
      } catch (e) {
        console.warn("Capacitor evaluate failed (not native):", e);
      }

      if (isNative) {
        // ── NATIVE MOBILE FLOW ──
        const { PushNotifications } = await import("@capacitor/push-notifications");
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === "denied") {
          // Permission was already permanently denied.
          // We cannot re-prompt. The user must go to Settings.
          setNotificationPermission("denied");
          toast.error("الإشعارات معطّلة", {
            description: "يرجى تفعيل الإشعارات من إعدادات التطبيق.",
          });
          return;
        }

        if (permStatus.receive !== "granted") {
          permStatus = await PushNotifications.requestPermissions();
        }

        setNotificationPermission(permStatus.receive);

        if (permStatus.receive === "granted") {
          await ensureNotificationChannel();
          await PushNotifications.register();
          // Token will be set via the "registration" listener above
        }
      } else {
        // ── WEB BROWSER FLOW ──
        // The Firebase Web SDK + service worker handles background notifications.
        // NOTE: This branch does NOT run inside a Capacitor native WebView;
        //       getFirebaseMessaging() will return null on native platforms.
        if (typeof window === "undefined" || !("Notification" in window)) {
          console.warn("Notifications are not supported in this environment.");
          return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          const messagingInstance = getFirebaseMessaging();
          if (messagingInstance) {
            const deviceToken = await getToken(messagingInstance, { vapidKey });
            setToken(deviceToken);
            await syncTokenWithBackend(deviceToken);
          }
        }
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    } finally {
      setIsLoading(false);
    }
  }, [vapidKey]);

  return {
    token,
    notificationPermission,
    requestPermission,
    isLoading,
  };
};
