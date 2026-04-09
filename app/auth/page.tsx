"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone, Loader2 } from "lucide-react";
import { usePhoneForm } from "@/features/auth/hooks/useAuthForms";
import { PhoneInput } from "@/shared/components/phone-input";
import { useLogin } from "@/shared/hooks/useLogin";
import type { PhoneValues } from "@/features/auth/schemas/auth.schema";
import { toast } from "sonner";
import { Logo } from "@/shared/components/Logo";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();

  const phoneForm = usePhoneForm();

  const onPhoneSubmit = async (values: PhoneValues) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status) {
          toast.success(response.message || "تم إرسال رمز التحقق");
          // Carry callbackUrl through to the OTP page so we can redirect back after login
          const callbackUrl =
            searchParams.get("callbackUrl") || "/quick-start?mode=edit";
          const params = new URLSearchParams({
            phone: values.phone,
            country_id: values.country_id.toString(),
            callbackUrl,
          });
          router.push(`/otp?${params.toString()}`);
        } else {
          toast.error(response.message || "فشل إرسال الرمز");
        }
      },
      onError: (error: Error) => {
        toast.error(error?.message || "حدث خطأ ما، يرجى المحاولة لاحقاً");
      },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-muted/30 p-6 md:p-12"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-card border border-border/60 rounded-[40px] p-8 md:p-12 shadow-2xl shadow-primary/5 flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center gap-2">
          <Logo
            width={80}
            height={80}
            showText={false}
            imageClassName="w-20 h-20 shadow-xl shadow-primary/20 rotate-3"
          />
          <h1 className="text-xl font-black text-foreground tracking-tight">
            أهلاً بك مجدداً
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">
            سجّل دخولك الآن للبدء برحلتك العقارية
          </p>
        </div>

        <Form {...phoneForm}>
          <form
            onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="text-sm font-black text-foreground/80 px-1">
                    رقم الهاتف
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder="أدخل رقم الهاتف"
                      {...field}
                      onCountryChange={(id) =>
                        phoneForm.setValue("country_id", id, {
                          shouldValidate: true,
                        })
                      }
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

        {/* Register as Company Link */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
          <div className="w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent" />
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground font-bold">
              هل تمتلك مكتباً عقارياً؟
            </p>
            <Button
              variant="outline"
              className="rounded-2xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary font-black px-8 h-12 transition-all active:scale-95 shadow-sm"
              onClick={() => router.push("/auth/register-company")}
            >
              سجل كشركة الآن
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
