'use client';

import { useState } from 'react';
import { Lock, Apple, CheckCircle2 } from 'lucide-react';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUnlockStore } from '@/stores/unlock.store';
import { useCallAd } from '../hooks/useCallAd';

type Step = 'idle' | 'starting' | 'verifying' | 'confirming' | 'success';

const KNET_LOGO =
  "https://media.licdn.com/dms/image/v2/D4D0BAQFazp_I3lLeQg/company-logo_200_200/company-logo_200_200/0/1715599858189/the_shared_electronic_banking_services_co_knet_logo?e=2147483647&v=beta&t=FfjCLbNIUGrTCTi-tI5nXSNP9B4AcOJbWsFqV0bSWcM";

const STEP_LABELS: Record<Step, string> = {
  idle:       'فتح التواصل مع ناشر الإعلان',
  starting:   'جاري بدء عملية الدفع...',
  verifying:  'جاري التحقق من الدفع...',
  confirming: 'جاري تأكيد العملية...',
  success:    'تم الدفع بنجاح ✓',
};

const STEP_PROGRESS: Record<Step, number> = {
  idle: 0, starting: 30, verifying: 65, confirming: 90, success: 100,
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  listingId: number;
  userId: string;
}

export function UnlockModal({ open, onOpenChange, listingId, userId }: Props) {
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);
  const unlock = useUnlockStore(s => s.unlock);
  const { mutate: initiateCall, isPending } = useCallAd();

  const runPayment = () => {
    if (isPending || step !== 'idle') return;
    setError(null);
    setStep('starting');

    initiateCall(listingId, {
      onSuccess: (response) => {
        // Mark as locally unlocked so the contact buttons become active
        unlock(userId, listingId);
        setStep('success');
        // Redirect to the MyFatoorah payment gateway
        if (response?.data?.payment_url) {
          window.location.href = response.data.payment_url;
        }
      },
      onError: () => {
        setStep('idle');
        setError('حدث خطأ أثناء بدء الدفع. يرجى المحاولة مرة أخرى.');
      },
    });
  };

  const handleClose = (v: boolean) => {
    // Block close while a request is in-flight
    if (!v && isPending) return;
    if (!v) {
      setStep('idle');
      setError(null);
    }
    onOpenChange(v);
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent dir="rtl">
        <DrawerHeader className="text-center">
          <DrawerTitle>
            {step === 'success' ? STEP_LABELS.success : 'فتح بيانات التواصل'}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center gap-6 px-6 pb-10 pt-2 text-center">
          {/* Icon area */}
          <div className="w-24 h-24 flex items-center justify-center">
            {step === 'idle' && (
              <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center">
                <Lock className="w-10 h-10 text-foreground" />
              </div>
            )}
            {(step === 'starting' || step === 'verifying' || step === 'confirming') && (
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {step === 'success' && (
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/40">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            )}
          </div>

          {/* Label */}
          <p className={`text-base font-bold transition-colors duration-300 ${step === 'success' ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
            {STEP_LABELS[step]}
          </p>

          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive font-medium">{error}</p>
          )}

          {/* Progress bar during payment */}
          {step !== 'idle' && step !== 'success' && (
            <Progress value={STEP_PROGRESS[step]} className="w-full h-1.5 transition-all duration-700" />
          )}

          {/* Fee + payment buttons (idle only) */}
          {step === 'idle' && (
            <>
              <div className="bg-muted px-6 py-3 rounded-2xl border border-border flex items-center gap-3">
                <span className="text-sm text-muted-foreground">رسوم الفتح:</span>
                <span className="text-xl font-bold">1 د.ك</span>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button
                  id="pay-apple"
                  size="lg"
                  disabled={isPending}
                  className="w-full h-14 gap-3 bg-black hover:bg-black/90 text-white rounded-2xl font-bold shadow-xl"
                  onClick={runPayment}
                >
                  <Apple className="w-6 h-6" />
                  الدفع عبر Apple Pay
                </Button>

                <Button
                  id="pay-knet"
                  size="lg"
                  variant="outline"
                  disabled={isPending}
                  className="w-full h-14 gap-3 rounded-2xl font-bold"
                  onClick={runPayment}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={KNET_LOGO} alt="KNET" className="w-8 h-8 object-contain rounded" />
                  الدفع عبر الكي نت
                </Button>

                <Button
                  id="unlock-cancel"
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => handleClose(false)}
                >
                  إلغاء
                </Button>
              </div>
            </>
          )}

          {/* Continue after success */}
          {step === 'success' && (
            <Button
              id="unlock-continue"
              size="lg"
              className="w-full h-14 rounded-2xl font-bold"
              onClick={() => handleClose(false)}
            >
              متابعة
            </Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
