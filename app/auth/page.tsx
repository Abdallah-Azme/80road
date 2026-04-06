'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Phone, Loader2 } from 'lucide-react';
import { usePhoneForm } from '@/features/auth/hooks/useAuthForms';
import { PhoneInput } from '@/shared/components/phone-input';
import { useLogin } from '@/shared/hooks/useLogin';
import type { PhoneValues } from '@/features/auth/schemas/auth.schema';
import { toast } from 'sonner';

export default function AuthPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const phoneForm = usePhoneForm();

  const onPhoneSubmit = async (values: PhoneValues) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status) {
          toast.success(response.message || 'تم إرسال رمز التحقق');
          // Redirect to OTP page with phone, country_id, and prefix for display
          const params = new URLSearchParams({
            phone: values.phone,
            country_id: values.country_id.toString(),
          });
          router.push(`/otp?${params.toString()}`);
        } else {
          toast.error(response.message || 'فشل إرسال الرمز');
        }
      },
      onError: (error: Error) => {
        toast.error(error?.message || 'حدث خطأ ما، يرجى المحاولة لاحقاً');
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-6 md:p-12" dir="rtl">
      <div className="w-full max-w-md bg-card border border-border/60 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Logo Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-xl shadow-primary/40 mb-2 transform hover:rotate-6 transition-transform">
            <span className="text-primary-foreground font-black text-2xl tracking-tight">80road</span>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">أهلاً بك مجدداً</h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">سجّل دخولك الآن للبدء برحلتك العقارية</p>
        </div>

        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="flex flex-col gap-6">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-sm font-black text-foreground/80 px-1">رقم الهاتف</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="أدخل رقم الهاتف"
                      {...field}
                      onCountryChange={(id) => phoneForm.setValue('country_id', id, { shouldValidate: true })}
                      defaultCountry="KW"
                      className="h-14 font-black"
                      disabled={loginMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-black px-2" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              className="w-full h-15 rounded-2xl font-black text-base gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Phone className="w-5 h-5" /> إرسال رمز التحقق
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
