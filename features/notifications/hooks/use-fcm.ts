import { useState, useEffect, useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "../services/firebase-client";
import { Capacitor } from "@capacitor/core";
import { PushNotifications, type Token, type RegistrationError, type PushNotificationSchema } from "@capacitor/push-notifications";
import { toast } from "sonner";

export const useFcm = (vapidKey: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported" | "granted" | "denied" | "prompt" | "prompt-with-rationale" | string
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  // Check supported and current permission status on mount
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.checkPermissions().then((status) => {
        setNotificationPermission(status.receive);
      });
    } else {
      if (typeof window === "undefined" || !("Notification" in window)) {
        setNotificationPermission("unsupported");
        return;
      }
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Handle listeners on mount or whenever permission changes
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const addListeners = async () => {
        await PushNotifications.addListener("registration", (nativeToken: Token) => {
          setToken(nativeToken.value);
          console.log("📱 Native Mobile FCM Token:", nativeToken.value);
        });

        await PushNotifications.addListener("registrationError", (error: RegistrationError) => {
          console.error("📱 Native push registration error:", error);
        });

        await PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
          console.log("📱 Native Foreground payload received", notification);
          toast(notification.title || "New Notification", {
            description: notification.body || "You have a new message.",
          });
        });
      };

      addListeners();

      // If we already have permission, just register to trigger the token
      PushNotifications.checkPermissions().then((res) => {
        if (res.receive === 'granted') {
          PushNotifications.register();
        }
      });
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      if (Capacitor.isNativePlatform()) {
        // --- NATIVE MOBILE APP FLOW ---
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
