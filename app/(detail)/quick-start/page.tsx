'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import { useWizardStore } from '@/stores/wizard.store';
import { GOVERNORATES, AREAS } from '@/lib/locations';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

const TOTAL_STEPS = 5;

interface FormData {
  name: string;
  purpose: string;
  propertyType: string;
  governorate: string;
  area: string;
}

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

// ── Inner component that uses useSearchParams ────────────────────────────────
function QuickStartForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  const { setPreferences } = useUIStore();
  const { quickStartForm: data, setQuickStartValue } = useWizardStore();

  const [step, setStep] = useState(isEditMode ? 2 : 1);

  const handleSelect = (key: keyof FormData, value: string) => {
    setQuickStartValue(key as string, value);
    if (key === 'governorate' && data.governorate !== value) setQuickStartValue('area', '');
    
    const newData = { ...data, [key]: value };
    if (key === 'governorate' && data.governorate !== value) newData.area = '';
    
    if (step < TOTAL_STEPS) {
      setTimeout(() => setStep(s => s + 1), 150);
    } else {
      setTimeout(() => finish(newData), 150);
    }
  };

  const finish = (finalData: FormData) => {
    localStorage.setItem('road80_preferences', JSON.stringify(finalData));
    setPreferences({
      purpose: finalData.purpose,
      propertyType: finalData.propertyType,
      area: finalData.area,
    });
    router.push('/');
  };

  const handleBack = () => {
    if (isEditMode && step === 2) { router.push('/'); return; }
    if (step > 1) setStep(s => s - 1);
  };

  const currentAreas = AREAS[data.governorate] ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Progress header */}
      <div className="px-6 pb-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)' }}>
        <ProgressBar step={step} setStep={setStep} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="max-w-2xl mx-auto px-6 w-full">
          {/* Step 1 — Name */}
          {step === 1 && !isEditMode && (
            <div className="flex flex-col justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">👋</span>
                </div>
                <h2 className="text-3xl font-black mb-3">مرحباً بك</h2>
                <p className="text-muted-foreground font-medium">الرجاء إدخال اسمك لنتمكن من تخصيص تجربتك</p>
              </div>
              <input
                type="text"
                value={data.name}
                onChange={e => setQuickStartValue('name', e.target.value)}
                placeholder="الاسم الكامل مثال: أحمد السالم"
                autoFocus
                className="w-full h-20 rounded-3xl border-2 border-border/60 px-8 text-2xl font-black text-center bg-card focus:border-primary focus:outline-none focus:ring-8 focus:ring-primary/5 shadow-2xl shadow-black/5 placeholder:text-muted-foreground/30 transition-all"
              />
            </div>
          )}

          {/* Step 2 — Purpose */}
          {step === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
              <h2 className="text-3xl font-black mb-10 text-center tracking-tight">ماذا تبحث اليوم؟</h2>
              {['للبيع', 'للإيجار'].map(opt => (
                <Option key={opt} label={opt} selected={data.purpose === opt} onClick={() => handleSelect('purpose', opt)} />
              ))}
            </div>
          )}

          {/* Step 3 — Property type */}
          {step === 3 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
              <h2 className="text-3xl font-black mb-10 text-center tracking-tight">نوع العقار المفضل</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['بيت', 'شقة', 'دور', 'عمارة', 'دوبلكس'].map(opt => (
                  <Option key={opt} label={opt} selected={data.propertyType === opt} onClick={() => handleSelect('propertyType', opt)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Governorate */}
          {step === 4 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
              <h2 className="text-3xl font-black mb-10 text-center tracking-tight">في أي محافظة؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GOVERNORATES.map(opt => (
                  <Option key={opt} label={opt} selected={data.governorate === opt} onClick={() => handleSelect('governorate', opt)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Area */}
          {step === 5 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black tracking-tight">المنطقة المفضلة</h2>
                <p className="text-primary font-bold mt-2">{data.governorate}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAreas.map(opt => (
                  <Option key={opt} label={opt} selected={data.area === opt} onClick={() => handleSelect('area', opt)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom action */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-6 bg-linear-to-t from-background via-background/95 to-transparent z-10">
        {step === 1 && !isEditMode ? (
          <button
            onClick={() => setStep(2)}
            disabled={!data.name.trim()}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all',
              data.name.trim()
                ? 'bg-primary shadow-primary/20 active:scale-95 hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            التالي
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="w-full py-4 bg-transparent text-muted-foreground font-bold hover:text-foreground transition-colors"
          >
            {isEditMode && step === 2 ? 'إلغاء' : (
              <span className="flex items-center justify-center gap-1">
                <ChevronRight className="w-4 h-4" />
                رجوع
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Page export: wraps in Suspense because useSearchParams requires it ────────
export default function QuickStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <QuickStartForm />
    </Suspense>
  );
}
