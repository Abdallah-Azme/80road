"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFcm } from "../hooks/use-fcm";
import { onForegroundMessage } from "../services/firebase-client";
import { toast } from "sonner";
import { useUnreadCount } from "../hooks/use-notifications";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationList } from "./NotificationList";

export const NotificationBell: React.FC = () => {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || '';
  const { token, requestPermission, isLoading: isFcmLoading } = useFcm(vapidKey);
  const { data: unreadData, refetch: refetchUnread } = useUnreadCount();

  const unreadCount = unreadData?.data?.unread_count || 0;

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
      // Refresh count when a new message arrives in foreground
      refetchUnread();
    });

    return () => {
      unsubscribe();
    };
  }, [refetchUnread]);

  const handleRequestPermission = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      toast.info("جاري طلب الإذن...", {
        description: "يرجى السماح بالإشعارات عند مطالبتك بذلك.",
      });
      requestPermission();
    }
  };

  return (
    <Sheet>
      <div className="relative inline-flex items-center">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isFcmLoading}
            aria-label="الإشعارات"
            className={`relative transition-all duration-300 hover:scale-110 ${unreadCount > 0 ? 'text-primary' : ''}`}
          >
            <Bell className={`h-6 w-6 ${unreadCount > 0 ? 'fill-primary/20' : ''}`} />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold ring-2 ring-white dark:ring-gray-900 animate-in zoom-in duration-300"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        {!token && !isFcmLoading && (
           <button 
             onClick={handleRequestPermission}
             className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 border border-white rounded-full animate-pulse" 
             title="Click to enable push notifications"
           />
        )}
      </div>

      <SheetContent side="right" className="p-0 w-full sm:max-w-md">
        <SheetHeader className="sr-only">
          <SheetTitle>الإشعارات</SheetTitle>
          <SheetDescription>عرض وإدارة التنبيهات الخاصة بك</SheetDescription>
        </SheetHeader>
        <NotificationList />
      </SheetContent>
    </Sheet>
  );
};
