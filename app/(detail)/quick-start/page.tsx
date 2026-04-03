'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import { useWizardStore } from '@/stores/wizard.store';
import { GOVERNORATES, AREAS } from '@/lib/locations';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Form, FormControl, FormField, FormMessage } from '@/components/ui/form';
import { useQuickStartForm } from '@/features/quick-start/hooks/useQuickStartForm';
import type { QuickStartValues } from '@/features/quick-start/schemas/quick-start.schema';

const TOTAL_STEPS = 5;

function ProgressBar({ step, setStep }: { step: number; setStep: (s: number) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest min-w-fit">الخطوة {step} من {TOTAL_STEPS}</span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative">
            <div
              className="absolute inset-y-0 right-0 bg-linear-to-l from-primary to-primary/60 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Numbers Nav */}
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={cn(
                "w-10 h-10 rounded-xl border-2 font-black text-sm flex items-center justify-center transition-all active:scale-90",
                step === n 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-110" 
                  : n < step
                  ? "bg-primary/5 text-primary border-primary/20"
                  : "bg-card text-muted-foreground border-border/60 hover:border-primary/40"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'w-full p-6 md:p-8 rounded-[40px] border-2 flex items-center justify-between transition-all duration-500 group active:scale-[0.97] text-right',
        selected
          ? 'border-primary bg-primary/4 text-primary shadow-2xl shadow-primary/10'
          : 'border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-muted/30 hover:shadow-xl hover:-translate-y-1'
      )}
    >
      <span className="font-black text-lg md:text-2xl tracking-tight leading-none">{label}</span>
      <div className={cn(
        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
        selected ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" : "border-muted group-hover:border-primary/40"
      )}>
        {selected && <span className="font-black text-xs leading-none">✓</span>}
      </div>
    </button>
  );
}

function QuickStartForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  const { setPreferences } = useUIStore();
  const { quickStartForm: storeData, setQuickStartValue } = useWizardStore();

  const { form, onSubmit } = useQuickStartForm(storeData);
  const [step, setStep] = useState(isEditMode ? 2 : 1);

  const handleNext = async (key: keyof QuickStartValues, value: string) => {
    form.setValue(key, value, { shouldValidate: true });
    setQuickStartValue(key, value);
    
    if (key === 'governorate' && form.getValues('governorate') !== value) {
      form.setValue('area', '', { shouldValidate: false });
      setQuickStartValue('area', '');
    }

    if (step < TOTAL_STEPS) {
      setTimeout(() => setStep(s => s + 1), 150);
    } else {
      // Trigger submission validation
      const result = await form.trigger();
      if (result) {
        finish(form.getValues() as unknown as QuickStartValues);
      }
    }
  };

  const finish = (finalData: QuickStartValues) => {
    localStorage.setItem('road80_preferences', JSON.stringify(finalData));
    setPreferences({
      purpose: finalData.purpose,
      propertyType: finalData.propertyType,
      area: finalData.area,
    });
    onSubmit(finalData);
    router.push('/');
  };

  const handleBack = () => {
    if (isEditMode && step === 2) { router.push('/'); return; }
    if (step > 1) setStep(s => s - 1);
  };

  const currentAreas = AREAS[form.watch('governorate')] ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Progress header */}
      <div className="px-6 pb-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)' }}>
        <ProgressBar step={step} setStep={setStep} />
      </div>

      <Form {...form}>
        <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
          <div className="max-w-2xl mx-auto px-6 w-full">
            {/* Step 1 — Name */}
            {step === 1 && !isEditMode && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <div className="flex flex-col justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center mb-10">
                      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">👋</span>
                      </div>
                      <h2 className="text-3xl font-black mb-3 text-foreground tracking-tight">مرحباً بك</h2>
                      <p className="text-muted-foreground font-medium">الرجاء إدخال اسمك لنتمكن من تخصيص تجربتك</p>
                    </div>
                    <FormControl>
                      <input
                        type="text"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setQuickStartValue('name', e.target.value);
                        }}
                        placeholder="الاسم الكامل مثال: أحمد السالم"
                        autoFocus
                        className="w-full h-20 rounded-3xl border-2 border-border/60 px-8 text-2xl font-black text-center bg-card focus:border-primary focus:outline-none focus:ring-8 focus:ring-primary/5 shadow-2xl shadow-black/5 placeholder:text-muted-foreground/30 transition-all font-sans"
                      />
                    </FormControl>
                    <FormMessage className="text-center font-black mt-4" />
                  </div>
                )}
              />
            )}

            {/* Step 2 — Purpose */}
            {step === 2 && (
               <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
                  <h2 className="text-3xl font-black mb-10 text-center tracking-tight text-foreground leading-tight">ماذا تبحث اليوم؟</h2>
                  {['للبيع', 'للإيجار'].map(opt => (
                    <Option key={opt} label={opt} selected={field.value === opt} onClick={() => handleNext('purpose', opt)} />
                  ))}
                  <FormMessage className="text-center font-black" />
                </div>
              )}
            />
            )}

            {/* Step 3 — Property type */}
            {step === 3 && (
               <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
                  <h2 className="text-3xl font-black mb-10 text-center tracking-tight text-foreground leading-tight">نوع العقار المفضل</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['بيت', 'شقة', 'دور', 'عمارة', 'دوبلكس'].map(opt => (
                      <Option key={opt} label={opt} selected={field.value === opt} onClick={() => handleNext('propertyType', opt)} />
                    ))}
                  </div>
                  <FormMessage className="text-center font-black mt-2" />
                </div>
              )}
            />
            )}

            {/* Step 4 — Governorate */}
            {step === 4 && (
               <FormField
                control={form.control}
                name="governorate"
                render={({ field }) => (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
                  <h2 className="text-3xl font-black mb-10 text-center tracking-tight text-foreground leading-tight">في أي محافظة؟</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GOVERNORATES.map(opt => (
                      <Option key={opt} label={opt} selected={field.value === opt} onClick={() => handleNext('governorate', opt)} />
                    ))}
                  </div>
                  <FormMessage className="text-center font-black mt-2" />
                </div>
              )}
            />
            )}

            {/* Step 5 — Area */}
            {step === 5 && (
               <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8 text-right" dir="rtl">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">المنطقة المفضلة</h2>
                    <p className="text-primary font-black mt-2">{form.getValues('governorate')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentAreas.map(opt => (
                      <Option key={opt} label={opt} selected={field.value === opt} onClick={() => handleNext('area', opt)} />
                    ))}
                  </div>
                  <FormMessage className="text-center font-black mt-2" />
                </div>
              )}
            />
            )}
          </div>
        </div>
      </Form>

      {/* Fixed bottom action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 bg-linear-to-t from-background via-background/95 to-transparent z-10">
        {step === 1 && !isEditMode ? (
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!form.getValues('name')?.trim()}
            className={cn(
              'w-full py-4 rounded-3xl font-black text-white shadow-lg transition-all text-lg',
              form.getValues('name')?.trim()
                ? 'bg-primary shadow-primary/20 active:scale-95 hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            )}
          >
            التالي
          </button>
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-4 bg-transparent text-muted-foreground font-black text-lg hover:text-foreground transition-colors active:scale-95"
          >
            {isEditMode && step === 2 ? 'إلغاء' : (
              <span className="flex items-center justify-center gap-2">
                <ChevronRight className="w-5 h-5" />
                رجوع
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuickStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl border-4 border-primary border-t-transparent animate-spin shadow-xl shadow-primary/20" />
      </div>
    }>
      <QuickStartForm />
    </Suspense>
  );
}
