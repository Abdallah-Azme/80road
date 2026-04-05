import { useState, useEffect, useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "../services/firebase-client";
import { toast } from "sonner";

export const useFcm = (vapidKey: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported" | "granted" | "denied" | "prompt" | "prompt-with-rationale" | string
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  // Check supported and current permission status on mount
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

  // Handle listeners on mount or whenever permission changes
  useEffect(() => {
    const setupListeners = async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (Capacitor.isNativePlatform()) {
          const { PushNotifications } = await import("@capacitor/push-notifications");
          
          await PushNotifications.addListener("registration", (nativeToken) => {
            setToken(nativeToken.value);
            console.log("📱 Native Mobile FCM Token:", nativeToken.value);
          });

          await PushNotifications.addListener("registrationError", (error) => {
            console.error("📱 Native push registration error:", error);
          });

          await PushNotifications.addListener("pushNotificationReceived", (notification) => {
            console.log("📱 Native Foreground payload received", notification);
            toast(notification.title || "New Notification", {
              description: notification.body || "You have a new message.",
            });
          });

          const res = await PushNotifications.checkPermissions();
          if (res.receive === 'granted') {
            PushNotifications.register();
          }
        }
      } catch (e) {
        // Silently skip if not native
      }
    };
    
    setupListeners();
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      let isNative = false;
      try {
        const { Capacitor } = await import("@capacitor/core");
        isNative = Capacitor.isNativePlatform();
      } catch (e) {
        // Not native or evaluate failed
      }

      if (isNative) {
        // --- NATIVE MOBILE APP FLOW ---
        const { PushNotifications } = await import("@capacitor/push-notifications");
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive !== "granted") {
          permStatus = await PushNotifications.requestPermissions();
        }

        setNotificationPermission(permStatus.receive);

        if (permStatus.receive === "granted") {
          await PushNotifications.register();
        }
      } else {
        // --- WEB BROWSER FLOW ---
        if (typeof window === "undefined" || !("Notification" in window)) {
          console.warn("Notifications are not supported in this browser.");
          return;
        }

        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          const messagingInstance = getFirebaseMessaging();
          if (messagingInstance) {
            const deviceToken = await getToken(messagingInstance, { vapidKey });
            setToken(deviceToken);
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
