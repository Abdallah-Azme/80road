"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFcm } from "../hooks/use-fcm";
import { onForegroundMessage } from "../services/firebase-client";
import { toast } from "sonner";

interface NotificationBellProps {
  unreadCount?: number;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount = 0,
}) => {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';
  const { token, requestPermission, isLoading } = useFcm(vapidKey);

  useEffect(() => {
    if (token) {
      console.log("🔥 Notification System FCM Token:\n", token);
    }
  }, [token]);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      console.log("Foreground payload received", payload);
      toast(payload.notification?.title || "New Notification", {
        description: payload.notification?.body || "You have a new message.",
        icon: <Bell className="w-4 h-4 text-primary" />,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTestToken = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        toast.success("FCM Token Copied!", {
          description: "Your token is now in the clipboard. Use it in the Firebase Console for testing.",
        });
        console.log("🔥 FCM Token Copied to Clipboard:", token);
      } catch (err) {
        console.error("FCM copy error", err);
        // Fallback for browsers/environments where clipboard API might be restrictive
        alert(`FCM Token: ${token}`);
      }
    } else {
      toast.info("Requesting Permission...", {
        description: "Please allow notifications when prompted by your device.",
      });
      requestPermission();
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleTestToken}
        disabled={isLoading}
        className={`relative transition-all duration-300 hover:scale-110 ${token ? 'text-primary' : ''}`}
        title={token ? "Token Ready! Click to copy" : "Click to request push permission"}
      >
        <Bell className={`h-6 w-6 ${token ? 'fill-primary/20' : ''}`} />
        {(unreadCount > 0 || token) && (
          <Badge
            variant={token ? "default" : "destructive"}
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300"
          >
            {token ? "✓" : (unreadCount > 99 ? "99+" : unreadCount)}
          </Badge>
        )}
      </Button>
    </div>
  );
};
