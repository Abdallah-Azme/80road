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

  const handleTestToken = () => {
    if (token) {
      alert(`FCM Token retrieved! Check your console log to copy the full string.\nPreview: ${token.substring(0, 30)}...`);
      console.log("🔥 Current FCM Token:\n", token);
    } else {
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
        className="relative transition-all duration-300 hover:scale-110"
        title={token ? "Token Ready! Click to copy" : "Click to request push permission"}
      >
        <Bell className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};
