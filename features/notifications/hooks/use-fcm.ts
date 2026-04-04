import { useState, useEffect, useCallback } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "../services/firebase-client";

export const useFcm = (vapidKey: string) => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [isLoading, setIsLoading] = useState(false);

  // Check supported and current permission status on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }
    setNotificationPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Notifications are not supported in this browser.");
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === "granted") {
        const messagingInstance = getFirebaseMessaging();
        if (messagingInstance) {
          const deviceToken = await getToken(messagingInstance, { vapidKey });
          setToken(deviceToken);
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
