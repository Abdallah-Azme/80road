'use client';

import { Bell, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { useNotifications, useDeleteNotification, useDeleteAllNotifications } from '@/features/notifications/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { data: response, isLoading, isError } = useNotifications();
  const deleteOne = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  const notifications = response?.data || [];

  const handleDeleteOne = (id: string) => {
    deleteOne.mutate(id, {
      onSuccess: (res) => {
        if (res.status) toast.success('تم حذف الإشعار');
        else toast.error(res.message);
      },
    });
  };

  const handleDeleteAll = () => {
    deleteAll.mutate(undefined, {
      onSuccess: (res) => {
        if (res.status) toast.success('تم مسح جميع الإشعارات');
        else toast.error(res.message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 md:pt-10" dir="rtl">
        <h1 className="sr-only">الإشعارات - 80road</h1>

        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="الإشعارات"
            description="جميع التنبيهات المتعلقة بإعلاناتك وحسابك."
          />
          {notifications.length > 0 && (
            <Button
              id="clear-all-notifications"
              variant="outline"
              size="sm"
              className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={handleDeleteAll}
              disabled={deleteAll.isPending}
            >
              {deleteAll.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Trash2 className="w-4 h-4" />}
              مسح الكل
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-40" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-32 text-destructive gap-3">
            <Bell className="w-12 h-12 opacity-30" />
            <p className="font-bold">تعذّر تحميل الإشعارات</p>
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
            <div className="w-24 h-24 rounded-full bg-muted/40 flex items-center justify-center">
              <Bell className="w-12 h-12 text-muted-foreground/30" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black">لا توجد إشعارات</h2>
              <p className="text-muted-foreground font-medium">
                ستظهر هنا كل التنبيهات المتعلقة بحسابك وإعلاناتك.
              </p>
            </div>
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="flex flex-col gap-3">
            {notifications.map((notif) => {
              const isUnread = !notif.read_at;
              const adId = notif.data?.ad_id;

              return (
                <div
                  key={notif.id}
                  id={`notif-${notif.id}`}
                  className={cn(
                    'bg-card border rounded-3xl p-5 flex items-start gap-4 transition-all group',
                    isUnread
                      ? 'border-primary/30 shadow-lg shadow-primary/5 bg-primary/3'
                      : 'border-border/60',
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center',
                      isUnread ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isUnread
                      ? <Bell className="w-5 h-5" />
                      : <CheckCircle2 className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-foreground leading-snug">
                      {notif.data?.title || 'إشعار جديد'}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mt-1 line-clamp-2">
                      {notif.data?.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold text-muted-foreground/60">
                        {notif.created_at_diff}
                      </span>
                      {adId && (
                        <Link
                          href={`/ad/${adId}`}
                          className="text-[10px] font-black text-primary hover:underline"
                        >
                          عرض الإعلان
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    id={`delete-notif-${notif.id}`}
                    onClick={() => handleDeleteOne(notif.id)}
                    disabled={deleteOne.isPending}
                    aria-label="حذف الإشعار"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-destructive/10 text-destructive shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
