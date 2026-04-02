'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
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
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500 rounded-full"
        style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
      />
    </div>
  );
}

function Option({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 mb-3 rounded-2xl border flex items-center justify-between transition-all duration-200 active:scale-95',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50'
      )}
    >
      <span className="font-bold text-base">{label}</span>
      {selected && <span className="font-bold text-xl">✓</span>}
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

  const [step, setStep] = useState(isEditMode ? 2 : 1);
  const [data, setData] = useState<FormData>({
    name: userName,
    purpose: '',
    propertyType: '',
    governorate: '',
    area: '',
  });

  // Pre-load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('road80_preferences');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<FormData>;
      setData(prev => ({ ...prev, ...parsed }));
    } catch {}
  }, []);

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
