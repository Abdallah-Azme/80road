"use client";

import { useRouter } from "next/navigation";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Loader2, ArrowRight, Building2, Phone, MessageSquare, Image as ImageIcon } from "lucide-react";
import { useRegisterCompanyForm } from "@/features/auth/hooks/useAuthForms";
import { useCountries, useStates } from "@/shared/hooks/useLocation";
import { useDepartments } from "@/features/companies/hooks/useDepartments";
import { useRegisterCompany } from "@/shared/hooks/useRegisterCompany";
import type { RegisterCompanyValues } from "@/features/auth/schemas/auth.schema";
import { toast } from "sonner";
import { Logo } from "@/shared/components/Logo";
import { MediaUploader } from "@/components/ui/media-uploader";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cn } from "@/lib/utils";

function RegisterCompanyContent() {
  const router = useRouter();
  const registerMutation = useRegisterCompany();
  const form = useRegisterCompanyForm();

  const country_id = form.watch("country_id");
  const { data: countries, isLoading: loadingCountries } = useCountries();
  const { data: states, isLoading: loadingStates } = useStates(country_id);
  const { data: departments, isLoading: loadingDepts } = useDepartments();

  const onSubmit = async (values: RegisterCompanyValues) => {
    registerMutation.mutate(values, {
      onSuccess: (response) => {
        if (response.status) {
          toast.success(response.message || "تم التسجيل بنجاح، في انتظار موافقة الإدارة");
          router.push("/auth");
        } else {
          toast.error(response.message || "حدث خطأ ما أثناء التسجيل");
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const message = error?.response?._data?.message || error?.message || "حدث خطأ ما، يرجى المحاولة لاحقاً";
        toast.error(message);
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/30 p-4 md:p-8 lg:p-12" dir="rtl">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <button 
            onClick={() => router.back()}
            className="self-start flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm"
          >
            <ArrowRight className="w-4 h-4" /> العودة للوراء
          </button>
          
          <Logo width={100} height={100} showText={false} imageClassName="shadow-2xl shadow-primary/20" />
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-foreground tracking-tight">تسجيل شركة جديدة</h1>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              انضم إلى شبكة 80road العقارية وابدأ بعرض عقارات شركتك لجمهور واسع
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-card border border-border/60 rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-2xl shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Image Section */}
              <div className="flex flex-col items-center gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[240px]">
                      <FormLabel className="text-center block text-sm font-black text-foreground/80 mb-3">شعار الشركة</FormLabel>
                      <FormControl>
                        <MediaUploader
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                          className="aspect-square rounded-3xl"
                        />
                      </FormControl>
                      <FormMessage className="text-center font-black" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Company Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-black text-foreground/80 flex items-center gap-2 px-1">
                        <Building2 className="w-4 h-4 text-primary" /> اسم الشركة
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الشركة" className="h-14 rounded-2xl font-bold bg-muted/20 border-border/40 focus:bg-background transition-all" {...field} />
                      </FormControl>
                      <FormMessage className="font-black px-2 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Department Selection */}
                <FormField
                  control={form.control}
                  name="company_department_id"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-black text-foreground/80 px-1">القسم</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full !h-14 rounded-2xl font-bold bg-muted/20 border-border/40">
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border/60">
                          {loadingDepts ? (
                            <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-5 h-5" /></div>
                          ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            departments?.map((dept: any) => (
                              <SelectItem key={dept.id} value={dept.id.toString()} className="font-bold py-3 rounded-xl">{dept.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-black px-2 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country_id"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-black text-foreground/80 px-1">الدولة</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("state_id", "");
                        }} 
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full !h-14 rounded-2xl font-bold bg-muted/20 border-border/40">
                            <SelectValue placeholder="اختر الدولة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border/60">
                          {loadingCountries ? (
                            <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-5 h-5" /></div>
                          ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            countries?.map((country: any) => (
                              <SelectItem key={country.id} value={country.id.toString()} className="font-bold py-3 rounded-xl">{country.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-black px-2 text-xs" />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="state_id"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-black text-foreground/80 px-1">المحافظة</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value?.toString()}
                        disabled={!country_id || loadingStates}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full !h-14 rounded-2xl font-bold bg-muted/20 border-border/40">
                            <SelectValue placeholder={!country_id ? "اختر الدولة أولاً" : "اختر المحافظة"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border/60">
                          {loadingStates ? (
                            <div className="p-4 flex justify-center"><Loader2 className="animate-spin w-5 h-5" /></div>
                          ) : (
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            states?.map((state: any) => (
                              <SelectItem key={state.id} value={state.id.toString()} className="font-bold py-3 rounded-xl">{state.name}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="font-black px-2 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-black text-foreground/80 flex items-center gap-2 px-1">
                        <Phone className="w-4 h-4 text-primary" /> رقم الهاتف
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="9xxxxxxxx" className="h-14 rounded-2xl font-bold bg-muted/20 border-border/40 ltr text-right" {...field} />
                      </FormControl>
                      <FormMessage className="font-black px-2 text-xs" />
                    </FormItem>
                  )}
                />

                {/* WhatsApp Phone */}
                <FormField
                  control={form.control}
                  name="whatsapp_phone"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-black text-foreground/80 flex items-center gap-2 px-1">
                        <MessageSquare className="w-4 h-4 text-green-500" /> رقم الواتساب
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="9xxxxxxxx" className="h-14 rounded-2xl font-bold bg-muted/20 border-border/40 ltr text-right" {...field} />
                      </FormControl>
                      <FormMessage className="font-black px-2 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Caption */}
              <FormField
                control={form.control}
                name="caption"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-black text-foreground/80 px-1">وصف الشركة</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="تحدث قليلاً عن نشاط الشركة العقاري (10 أحرف على الأقل)..." 
                        className="min-h-[120px] rounded-3xl font-bold bg-muted/20 border-border/40 p-5 focus:bg-background transition-all" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="font-black px-2 text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-16 rounded-[24px] font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "تقديم طلب التسجيل"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterCompanyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </div>
      }
    >
      <RegisterCompanyContent />
    </Suspense>
  );
}
