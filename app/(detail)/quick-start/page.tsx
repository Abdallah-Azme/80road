'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUIStore } from '@/stores/ui.store';
import { useUserStore } from '@/stores/user.store';
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

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest min-w-fit">الخطوة {step} من {TOTAL_STEPS}</span>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative">
          <div
            className="absolute inset-y-0 right-0 bg-linear-to-l from-primary to-primary/60 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
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
  const userName = useUserStore(s => s.user?.name ?? '');

  // Move initial data loading to useState initializer to fix lint error
  const [data, setData] = useState<FormData>(() => {
    const base = {
      name: '',
      purpose: '',
      propertyType: '',
      governorate: '',
      area: '',
    };
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('road80_preferences');
      if (saved) {
        try {
          return { ...base, ...JSON.parse(saved), name: userName || base.name };
        } catch {}
      }
    }
    return { ...base, name: userName };
  });

  const [step, setStep] = useState(isEditMode ? 2 : 1);

  const handleSelect = (key: keyof FormData, value: string) => {
    const newData = { ...data, [key]: value };
    if (key === 'governorate' && data.governorate !== value) newData.area = '';
    setData(newData);
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
        <ProgressBar step={step} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-40">

        {/* Step 1 — Name */}
        {step === 1 && !isEditMode && (
          <div className="flex flex-col justify-center min-h-[60vh]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">مرحباً بك 👋</h2>
              <p className="text-muted-foreground text-sm">الرجاء إدخال اسمك لنبدأ</p>
            </div>
            <input
              type="text"
              value={data.name}
              onChange={e => setData(d => ({ ...d, name: e.target.value }))}
              placeholder="الاسم الكامل"
              autoFocus
              className="w-full h-16 rounded-2xl border border-border px-6 text-xl font-bold text-center bg-card focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm placeholder:text-muted-foreground/40 transition-all"
            />
          </div>
        )}

        {/* Step 2 — Purpose */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">ماذا تبحث؟</h2>
            {['للبيع', 'للإيجار'].map(opt => (
              <Option key={opt} label={opt} selected={data.purpose === opt} onClick={() => handleSelect('purpose', opt)} />
            ))}
          </>
        )}

        {/* Step 3 — Property type */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">نوع العقار</h2>
            {['بيت', 'شقة', 'دور', 'عمارة', 'دوبلكس'].map(opt => (
              <Option key={opt} label={opt} selected={data.propertyType === opt} onClick={() => handleSelect('propertyType', opt)} />
            ))}
          </>
        )}

        {/* Step 4 — Governorate */}
        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-8 text-center">المحافظة</h2>
            {GOVERNORATES.map(opt => (
              <Option key={opt} label={opt} selected={data.governorate === opt} onClick={() => handleSelect('governorate', opt)} />
            ))}
          </>
        )}

        {/* Step 5 — Area */}
        {step === 5 && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-center">المنطقة</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">{data.governorate}</p>
            {currentAreas.map(opt => (
              <Option key={opt} label={opt} selected={data.area === opt} onClick={() => handleSelect('area', opt)} />
            ))}
          </>
        )}
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
