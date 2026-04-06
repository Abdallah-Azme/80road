'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useOtpForm } from '@/features/auth/hooks/useAuthForms';
import { useVerifyOtp } from '@/shared/hooks/useVerifyOtp';
import { useResendOtp } from '@/shared/hooks/useResendOtp';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import type { OtpValues } from '@/features/auth/schemas/auth.schema';
import { toast } from 'sonner';

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || '';
  const countryId = searchParams.get('country_id') || '';
  
  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();
  const otpForm = useOtpForm();

  const [resendTimer, setResendTimer] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  // Timer logic for resending OTP
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  // Redirect back if no phone is found in the context
  if (!phone || !countryId) {
    router.replace('/auth');
    return null;
  }

  const onOtpSubmit = async (values: OtpValues) => {
    verifyMutation.mutate(
      { phone, code: values.otp, country_id: countryId },
      {
        onSuccess: (response) => {
          if (response.status) {
            toast.success(response.message || 'تم التحقق بنجاح');
          } else {
            toast.error(response.message || 'رمز التحقق غير صحيح');
          }
        },
        onError: (error: Error) => {
          toast.error(error?.message || 'حدث خطأ أثناء التحقق، يرجى المحاولة لاحقاً');
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (!canResend) return;

    resendMutation.mutate(
      { phone, country_id: countryId },
      {
        onSuccess: (response) => {
          if (response.status) {
            toast.success(response.message || 'تم إرسال الرمز الجديد');
            setResendTimer(60);
            setCanResend(false);
          } else {
            toast.error(response.message || 'فشل إرسال الرمز');
          }
        },
        onError: (error: Error) => {
          toast.error(error?.message || 'فشل إرسال الرمز، حاول مجدداً');
        }
      }
    );
  };

  const isPending = verifyMutation.isPending || resendMutation.isPending;
  const slotClassName = "w-14 h-18 text-2xl font-black rounded-2xl border-2 border-border bg-muted/20 focus:border-primary focus:ring-8 focus:ring-primary/10 transition-all shadow-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-6 md:p-12" dir="rtl">
      <div className="w-full max-w-md bg-card border border-border/60 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Logo Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/40 mb-2 transform hover:rotate-6 transition-transform">
            <span className="text-primary-foreground font-black text-2xl tracking-tight">80road</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">رمز التحقق</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            أدخل الرمز المكون من 4 أرقام المرسل إلى <br />
            <span className="text-primary font-bold" dir="ltr">{phone}</span>
          </p>
        </div>

        {verifyMutation.isSuccess ? (
          <div className="flex flex-col items-center gap-6 py-6 animate-in fade-in zoom-in duration-500">
             <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
               <CheckCircle2 className="w-12 h-12 text-green-500" />
             </div>
             <div className="text-center">
               <p className="font-black text-xl mb-1">تم التحقق بنجاح</p>
               <p className="text-sm text-muted-foreground font-bold">جاري تحويلك للمنصة...</p>
             </div>
          </div>
        ) : (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="flex flex-col gap-8">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-4" dir="ltr">
                    <FormLabel className="text-sm font-black text-foreground/80" dir="rtl">رمز التحقق</FormLabel>
                    <FormControl>
                      <div dir="ltr" className="flex justify-center w-full">
                        <InputOTP
                          maxLength={4}
                          disabled={isPending}
                          {...field}
                          containerClassName="justify-center"
                        >
                          <InputOTPGroup className="flex gap-2">
                            <InputOTPSlot index={0} className={slotClassName} />
                            <InputOTPSlot index={1} className={slotClassName} />
                          </InputOTPGroup>
                          <InputOTPSeparator className="mx-2 font-black" />
                          <InputOTPGroup className="flex gap-2">
                            <InputOTPSlot index={2} className={slotClassName} />
                            <InputOTPSlot index={3} className={slotClassName} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs font-black text-center" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-15 rounded-2xl font-black text-base gap-3 shadow-lg shadow-primary/20"
                  disabled={isPending || otpForm.watch('otp')?.length !== 4}
                >
                  {verifyMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 shrink-0" /> متابعة تسجيل الدخول
                    </>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-3">
                  <p className="text-xs text-muted-foreground font-bold">لم يصلك الرمز؟</p>
                  <button
                    type="button"
                    className="text-sm text-primary font-black hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-2"
                    onClick={handleResendOtp}
                    disabled={!canResend || resendMutation.isPending}
                  >
                    {resendMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>إعادة إرسال الرمز {!canResend && `(${resendTimer}ث)`}</>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40 flex justify-center">
                <button
                  type="button"
                  className="text-xs text-muted-foreground font-medium hover:text-primary transition-colors flex items-center gap-1"
                  onClick={() => router.replace('/auth')}
                  disabled={verifyMutation.isPending}
                >
                   هل أخطأت في الرقم؟ <span className="underline font-black">عد للخلف</span>
                </button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>}>
      <OtpContent />
    </Suspense>
  );
}
