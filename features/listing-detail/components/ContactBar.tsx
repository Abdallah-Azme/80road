'use client';

import { useState } from 'react';
import { Phone, MessageCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUnlockStore } from '@/stores/unlock.store';
import { useUserStore } from '@/stores/user.store';
import { UnlockModal } from './UnlockModal';

interface Props {
  listingId: number;
  publisherId?: string;
  isOwner: boolean;
}

export function ContactBar({ listingId, isOwner }: Props) {
  const [showUnlock, setShowUnlock] = useState(false);
  const user = useUserStore(s => s.user);
  const userId = user?.phone ?? 'guest';
  const isUnlocked = useUnlockStore(s => s.isUnlocked(userId, listingId)) || isOwner;

  const handleWhatsApp = () => {
    if (!isUnlocked) { setShowUnlock(true); return; }
    window.open('https://wa.me/96598812020', '_blank');
  };

  const handleCall = () => {
    if (!isUnlocked) { setShowUnlock(true); return; }
    window.location.href = 'tel:+96598812020';
  };

  return (
    <>
      <div
        dir="rtl"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30 bg-card border-t border-border p-4 flex gap-2
                   md:static md:translate-x-0 md:max-w-none md:border md:rounded-2xl md:shadow-md md:flex-col md:gap-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
      >
        <span className="hidden md:block text-sm font-bold mb-1">تواصل مع المعلن</span>
        
        {/* WhatsApp */}
        <div className="flex-1 flex gap-1">
          <Button
            id="contact-whatsapp"
            variant="outline"
            className="flex-1 gap-2 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 h-12 md:h-11"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-5 h-5" />
            واتساب
          </Button>
          {!isUnlocked && (
            <Button id="unlock-whatsapp" variant="outline" size="icon" onClick={() => setShowUnlock(true)} className="h-12 md:h-11">
              <Lock className="w-4 h-4 opacity-60" />
            </Button>
          )}
        </div>

        {/* Call */}
        <div className="flex-1 flex gap-1">
          <Button
            id="contact-call"
            className="flex-1 gap-2 shadow-lg shadow-primary/20 h-12 md:h-11"
            onClick={handleCall}
          >
            <Phone className="w-5 h-5" />
            اتصال
          </Button>
          {!isUnlocked && (
            <Button id="unlock-call" variant="outline" size="icon" onClick={() => setShowUnlock(true)} className="h-12 md:h-11">
              <Lock className="w-4 h-4 opacity-60" />
            </Button>
          )}
        </div>
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
