"use client";

import React from "react";
import { useNotifications, useDeleteNotification, useDeleteAllNotifications } from "../hooks/use-notifications";
import { Bell, Trash2, Check, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const NotificationList: React.FC = () => {
  const { data, isLoading } = useNotifications();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  const notifications = data?.data || [];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("تم حذف الإشعار");
    } catch {
      toast.error("فشل حذف الإشعار");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllMutation.mutateAsync();
      toast.success("تم حذف جميع الإشعارات");
    } catch {
      toast.error("فشل مسح الإشعارات");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 items-start border-b pb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-bold">لا توجد إشعارات</h3>
          <p className="text-sm text-muted-foreground">
            عندما تتلقى إشعارات جديدة، ستظهر هنا.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-black text-lg">الإشعارات</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDeleteAll}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          مسح الكل
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/40">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={cn(
                "p-4 transition-all duration-300 hover:bg-muted/30 group cursor-pointer relative",
                !notification.read_at && "bg-primary/5"
              )}
            >
              <div className="flex gap-4 items-start">
                <div className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  notification.type === 'ad_approved' ? "bg-green-100 text-green-600" : 
                  notification.type === 'ad_rejected' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                )}>
                  {notification.type === 'ad_approved' ? <Check className="w-5 h-5" /> : 
                   notification.type === 'ad_rejected' ? <AlertTriangle className="w-5 h-5" /> : 
                   <Info className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-foreground leading-tight truncate">
                      {notification.data.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap pt-0.5">
                      {notification.created_at_diff}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {notification.data.message}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full transition-opacity absolute top-2 left-2"
                  onClick={(e) => handleDelete(e, notification.id)}
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
