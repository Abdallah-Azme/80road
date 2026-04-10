"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/user.store";
import { UnlockModal } from "./UnlockModal";

interface Props {
  listingId: number;
  publisherId?: string;
  isOwner?: boolean;
}

export function ContactBar({ listingId, publisherId }: Props) {
  const [showUnlock, setShowUnlock] = useState(false);
  const user = useUserStore((s) => s.user);
  const userId = user?.phone ?? "guest";

  // Determine ownership client-side using the real user store
  const isOwner =
    user?.id != null && publisherId != null
      ? String(user.id) === String(publisherId)
      : false;

  const handleWhatsApp = () => {
    setShowUnlock(true);
  };

  return (
    <>
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-card border-t border-border p-4 flex gap-2
                   md:static md:translate-x-0 md:max-w-none md:border md:rounded-2xl md:shadow-md md:flex-col md:gap-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <span className="hidden md:block text-sm font-bold mb-1">
          تواصل مع المعلن
        </span>

        {isOwner ? (
          <div className="flex-1 flex items-center justify-center py-3 bg-muted/50 rounded-xl border border-dashed border-border">
            <span className="text-sm font-bold text-muted-foreground">
              هذا إعلانك
            </span>
          </div>
        ) : (
          <>
            {/* WhatsApp */}
            <Button
              id="contact-whatsapp"
              variant="outline"
              className="flex-1 gap-2 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 h-12 md:h-14 md:self-stretch"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-5 h-5" />
              واتساب
            </Button>
          </>
        )}
      </div>

      <UnlockModal
        open={showUnlock}
        onOpenChange={setShowUnlock}
        listingId={listingId}
        userId={userId}
      />
    </>
  );
}
