"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFcm } from "../hooks/use-fcm";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { NotificationList } from "./NotificationList";

// ──────────────────────────────────────────────────────────────────────────────
// NotificationBell
//
// ARCHITECTURE NOTES:
//
// WEB BROWSER:
//   - onForegroundMessage (Firebase Web SDK) handles foreground push display
//   - firebase-messaging-sw.js handles background/killed state
//
// NATIVE (CAPACITOR — iOS / Android):
//   - Firebase Web SDK does NOT work inside WKWebView / Android WebView
//   - The `use-fcm` hook already handles foreground toasts via the native
//     `pushNotificationReceived` listener — no Web SDK calls needed here
//   - We detect native platform and skip the Web SDK listener entirely
// ──────────────────────────────────────────────────────────────────────────────

export const NotificationBell: React.FC = () => {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
  const {
    token,
    notificationPermission,
    requestPermission,
    isLoading: isFcmLoading,
  } = useFcm(vapidKey);

  const { data: unreadData, refetch: refetchUnread } = useUnreadCount();
  const unreadCount = unreadData?.data?.unread_count || 0;

  // Controls the pre-permission rationale dialog.
  // Best practice: show a custom explanation BEFORE triggering the native OS dialog.
  // If the user declines the OS prompt, you can NEVER ask again programmatically.
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);

  // Track whether we're running inside a native Capacitor app.
  // Controls which foreground message handler is used.
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    import("@capacitor/core")
      .then(({ Capacitor }) => setIsNative(Capacitor.isNativePlatform()))
      .catch(() => setIsNative(false));
  }, []);

  // ── Web-only foreground message listener ──────────────────────────────────
  // This block is SKIPPED on native platforms.
  // On native, the `pushNotificationReceived` listener in use-fcm.ts already
  // shows the foreground toast, so calling onForegroundMessage here would
  // try to initialise the Firebase Web SDK inside a WebView — which fails silently
  // and is architecturally wrong (web tokens ≠ native FCM tokens).
  useEffect(() => {
    if (isNative) return; // ← Guard: never run on iOS / Android

    // Dynamically import the web-only Firebase listener to keep it
    // out of the native bundle path entirely.
    let unsubscribe: (() => void) | null = null;

    import("../services/firebase-client").then(({ onForegroundMessage }) => {
      unsubscribe = onForegroundMessage((payload) => {
        toast(payload.notification?.title || "إشعار جديد", {
          description: payload.notification?.body || "",
          icon: <Bell className="w-4 h-4 text-primary" />,
        });
        refetchUnread();
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isNative, refetchUnread]);

  // ── Handle permission request (user taps the bell indicator) ─────────────
  const handleRequestPermission = () => {
    if (token) return; // Already registered
    if (notificationPermission === "denied") {
      // Permission permanently denied — direct user to Settings
      toast.error("الإشعارات معطّلة", {
        description: "افتح إعدادات الجهاز وأعد تفعيل الإشعارات لهذا التطبيق.",
        action: {
          label: "الإعدادات",
          onClick: () => {
            // On native, open the app settings page
            import("@capacitor/core").then(({ Capacitor }) => {
              if (Capacitor.isNativePlatform()) {
                // @capacitor/app-launcher or manual deep link
                // This is a best-effort attempt
                window.open("app-settings:", "_system");
              }
            });
          },
        },
        duration: 6000,
      });
      return;
    }
    // Show the pre-permission rationale dialog before triggering the OS prompt.
    // This gives the user context and increases permission grant rates.
    setShowPermissionDialog(true);
  };

  const handleConfirmPermission = async () => {
    setShowPermissionDialog(false);
    await requestPermission();
  };

  const isDenied = notificationPermission === "denied";
  const isUnsupported = notificationPermission === "unsupported";
  const showIndicator = !token && !isFcmLoading && !isUnsupported;

  return (
    <>
      {/* ── Pre-Permission Rationale Dialog ────────────────────────────────
          Shown BEFORE the native OS permission dialog.
          This is best practice to explain the value of notifications,
          improving the grant rate and meeting Apple/Google UX guidelines. */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              تفعيل الإشعارات
            </DialogTitle>
            <DialogDescription className="text-right leading-relaxed">
              احصل على إشعارات فورية عند توفر عقارات جديدة تناسب اهتماماتك، وعند
              ورود ردود على إعلاناتك.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row-reverse gap-2 sm:flex-row-reverse">
            <Button onClick={handleConfirmPermission} className="flex-1">
              السماح بالإشعارات
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPermissionDialog(false)}
              className="flex-1"
            >
              ليس الآن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Notification Bell + Sheet ─────────────────────────────────────── */}
      <Sheet>
        <div className="relative inline-flex items-center">
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isFcmLoading}
              aria-label="الإشعارات"
              className={`relative transition-all duration-300 hover:scale-110 ${
                unreadCount > 0 ? "text-primary" : ""
              }`}
            >
              {isDenied ? (
                <BellOff className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Bell
                  className={`h-6 w-6 ${
                    unreadCount > 0 ? "fill-primary/20" : ""
                  }`}
                />
              )}

              {/* Unread badge */}
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

          {/* Permission indicator dot — only shown if not yet enabled and not denied */}
          {showIndicator && !isDenied && (
            <button
              onClick={handleRequestPermission}
              className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 border-2 border-background rounded-full animate-pulse focus:outline-none"
              title="اضغط لتفعيل الإشعارات"
              aria-label="تفعيل الإشعارات"
            />
          )}

          {/* Settings icon for permanently denied state */}
          {isDenied && (
            <button
              onClick={handleRequestPermission}
              className="absolute -bottom-1 -left-1 w-4 h-4 flex items-center justify-center bg-muted rounded-full focus:outline-none"
              title="الإشعارات معطّلة — اضغط للإعدادات"
              aria-label="فتح إعدادات الإشعارات"
            >
              <Settings className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
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
    </>
  );
};
