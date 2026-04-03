'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { GOVERNORATES, AREAS, COUNTRIES } from '@/lib/locations';
import { useWizardStore } from '@/stores/wizard.store';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Upload, Play, Loader2 } from 'lucide-react';

const TOTAL_STEPS = 17;
const KNET_LOGO = 'https://media.licdn.com/dms/image/v2/D4D0BAQFazp_I3lLeQg/company-logo_200_200/company-logo_200_200/0/1715599858189/the_shared_electronic_banking_services_co_knet_logo?e=2147483647&v=beta&t=FfjCLbNIUGrTCTi-tI5nXSNP9B4AcOJbWsFqV0bSWcM';


// Removal of INIT
// ── Shared helpers ──────────────────────────────────────────────────────────
function ProgressTop({ step, setStep }: { step: number; setStep: (s: number) => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col gap-6 py-6 md:py-10" dir="rtl">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 min-w-fit">
            <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">الخطوة {step} من {TOTAL_STEPS}</span>
            <h1 className="hidden md:block text-2xl font-black text-foreground tracking-tight">إضافة إعلان جديد</h1>
          </div>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden shadow-inner relative">
            <div 
              className="absolute inset-y-0 right-0 bg-linear-to-l from-primary to-primary/60 transition-all duration-700 ease-out rounded-full shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} 
            />
          </div>
          <div className="w-12 h-12 rounded-2xl border border-border/60 flex items-center justify-center text-xs font-black bg-card shadow-xl shadow-primary/5 shrink-0 translate-y-1">
            {Math.round((step / TOTAL_STEPS) * 100)}%
          </div>
        </div>

        {/* Step Numbers Nav */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={cn(
                "min-w-[40px] h-10 rounded-xl border-2 font-black text-sm flex items-center justify-center transition-all active:scale-90 shrink-0",
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

function Title({ label }: { label: string }) {
  return <h2 className="text-2xl md:text-5xl font-black text-center mb-10 md:mb-16 tracking-tighter text-foreground leading-tight">{label}</h2>;
}

function Opt({ label, selected, onClick }: { label: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'w-full p-6 md:p-8 rounded-[40px] border-2 flex items-center justify-between transition-all duration-500 group active:scale-[0.97] text-right',
        selected 
          ? 'border-primary bg-primary/4 text-primary shadow-2xl shadow-primary/10' 
          : 'border-border/60 bg-card text-foreground hover:border-primary/40 hover:bg-muted/30 hover:shadow-xl hover:-translate-y-1',
      )}>
      <div className="font-black text-lg md:text-2xl tracking-tight leading-none">{label}</div>
      <div className={cn(
        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
        selected ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" : "border-muted/60 group-hover:border-primary/40"
      )}>
        {selected && <Check className="w-5 h-5 stroke-[4px]" />}
      </div>
    </button>
  );
}

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-40b5104d57ea?q=80&w=300&auto=format&fit=crop',
];

// ── Main Component ──────────────────────────────────────────────────────────
function PostAdForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawStep = parseInt(searchParams.get('step') || '1');
  const step = isNaN(rawStep) ? 1 : Math.max(1, Math.min(TOTAL_STEPS, rawStep));

  const { postAdForm: form, setPostAdValue, resetPostAdForm } = useWizardStore();
  
  // Local state for files (not persistent)
  const [video, setVideo] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [published, setPublished] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: unknown) => setPostAdValue(key, value);
  const setStep = (s: number) => router.push(`/post-ad?step=${s}`);
  
  const next = () => { if (step < TOTAL_STEPS) setStep(step + 1); };
  const prev = () => { if (step > 1) setStep(step - 1); };
  const sel = (key: string, value: unknown) => { update(key, value); setTimeout(next, 150); };

  const handlePublish = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPublished(true);
      resetPostAdForm(); // Reset on success
      setTimeout(() => router.push('/account'), 1500);
    }, 2000);
  };

  const currentAreas = AREAS[form.governorate] ?? [];

  const renderContent = () => {
    switch (step) {
      case 1: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="نوع الاعلان" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[{ l: 'للبيع', v: 'للبيع' }, { l: 'للإيجار', v: 'للإيجار' }, { l: 'الفنادق', v: 'hotels' }].map(o =>
              <Opt key={o.v} label={o.l} selected={form.listingType === o.v} onClick={() => sel('listingType', o.v)} />)}
          </div>
        </div>
      );
      case 2: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="نوع العقار" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['بيت', 'شقة', 'دور', 'عمارة', 'دوبلكس'].map(o =>
              <Opt key={o} label={o} selected={form.propertyType === o} onClick={() => sel('propertyType', o)} />)}
          </div>
        </div>
      );
      case 3: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="الدولة" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTRIES.map(c =>
              <Opt key={c.name} label={<span className="flex items-center gap-3"><span className="text-2xl">{c.flag}</span>{c.name}</span>}
                selected={form.country === c.name} onClick={() => sel('country', c.name)} />)}
          </div>
        </div>
      );
      case 4: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="المحافظة" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {GOVERNORATES.map(o =>
              <Opt key={o} label={o} selected={form.governorate === o} onClick={() => sel('governorate', o)} />)}
          </div>
        </div>
      );
      case 5: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="المنطقة" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-[400px] md:h-auto overflow-y-auto no-scrollbar pb-10 text-right" dir="rtl">
            {currentAreas.map(o =>
              <Opt key={o} label={o} selected={form.area === o} onClick={() => sel('area', o)} />)}
          </div>
        </div>
      );
      case 6: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="عدد الغرف" />
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => sel('rooms', n)}
                className={cn('aspect-square rounded-2xl border-2 flex items-center justify-center text-xl font-bold transition-all active:scale-95',
                  form.rooms === n ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-card border-border hover:border-primary/40')}>
                {n}
              </button>))}
          </div>
        </div>
      );
      case 7: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="عدد الحمامات" />
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array.from({ length: 10 }, (_, i) => i + 1), '10+'].map(n => (
              <button key={n} onClick={() => sel('bathrooms', n)}
                className={cn('aspect-square rounded-2xl border-2 flex items-center justify-center text-xl font-bold transition-all active:scale-95',
                  form.bathrooms === n ? 'bg-primary text-primary-foreground border-primary shadow-lg' : 'bg-card border-border hover:border-primary/40')}>
                {n}
              </button>))}
          </div>
        </div>
      );
      case 8: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="المساحة" />
          <div className="flex flex-col items-center justify-center gap-12 py-16 bg-card rounded-3xl border border-border shadow-md">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-primary">{form.size}</span>
              <span className="text-xl text-muted-foreground font-bold">م²</span>
            </div>
            <input type="range" min="50" max="2000" step="5" value={form.size}
              onChange={e => update('size', parseInt(e.target.value))}
              className="w-4/5 md:w-3/5 accent-[hsl(var(--primary))] h-3 rounded-lg appearance-none cursor-pointer bg-muted" />
            <div className="flex justify-between w-4/5 md:w-3/5 text-xs text-muted-foreground font-bold" dir="rtl">
              <span>50 م²</span>
              <span>1000 م²</span>
              <span>2000 م²</span>
            </div>
          </div>
        </div>
      );
      case 9: return (
        <div className="animate-in fade-in duration-500">
          <Title label="بلكونة" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['نعم', 'لا'].map(o => <Opt key={o} label={o} selected={form.balcony === o} onClick={() => sel('balcony', o)} />)}
          </div>
        </div>
      );
      case 10: return (
        <div className="animate-in fade-in duration-500">
          <Title label="عدد المواقف" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['1', '2', '3', '3+'].map(o => <Opt key={o} label={o} selected={form.parking === o} onClick={() => sel('parking', o)} />)}
          </div>
        </div>
      );
      case 11: return (
        <div className="animate-in fade-in duration-500">
          <Title label="نظام المواقف" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['مظلات', 'سرداب', 'اخرى'].map(o =>
              <Opt key={o} label={o} selected={form.parkingSystems.includes(o)} onClick={() => update('parkingSystems', [o])} />)}
          </div>
        </div>
      );
      case 12: return (
        <div className="animate-in fade-in duration-500">
          <Title label="الكهرباء" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['على المالك', 'على المستأجر'].map(o => <Opt key={o} label={o} selected={form.electricity === o} onClick={() => sel('electricity', o)} />)}
          </div>
        </div>
      );
      case 13: return (
        <div className="animate-in fade-in duration-500">
          <Title label="الماء" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['على المالك', 'على المستأجر'].map(o => <Opt key={o} label={o} selected={form.water === o} onClick={() => sel('water', o)} />)}
          </div>
        </div>
      );
      case 14: return (
        <div className="animate-in fade-in duration-500">
          <Title label="التكييف" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {['على المالك', 'على المستأجر'].map(o => <Opt key={o} label={o} selected={form.ac === o} onClick={() => sel('ac', o)} />)}
          </div>
        </div>
      );
      case 15: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="ارفع فيديو" />
          <div className="relative aspect-video bg-muted/50 rounded-3xl overflow-hidden border-3 border-dashed border-border mb-4 flex items-center justify-center hover:bg-muted transition-colors group">
            {video ? (
              <video src={URL.createObjectURL(video)} className="w-full h-full object-cover" controls />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                  <span className="block text-lg font-bold text-foreground">اضغط لرفع فيديو</span>
                  <span className="text-sm text-muted-foreground mt-1">اختياري، للفيديوهات القصيرة</span>
                </div>
              </div>
            )}
            <input ref={videoRef} type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => { if (e.target.files?.[0]) setVideo(e.target.files[0]); }} />
          </div>
        </div>
      );
      case 16: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Title label="ارفع صور العقار" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <div className="aspect-square bg-primary/5 rounded-2xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center relative active:bg-primary/10 transition-colors group cursor-pointer">
              <Upload className="w-10 h-10 text-primary mb-3 group-hover:-translate-y-1 transition-transform" />
              <span className="text-sm font-black text-primary">رفع الصور</span>
              <input ref={fileRef} type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => { if (e.target.files) setImages(f => [...f, ...Array.from(e.target.files!)]); }} />
            </div>
            {images.map((file, i) => (
              <div key={`up-${i}`} className="aspect-square rounded-2xl overflow-hidden bg-muted relative shadow-sm border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
            {DEMO_IMAGES.map((src, i) => (
              <div key={`demo-${i}`} className="aspect-square rounded-2xl overflow-hidden bg-muted relative shadow-sm border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} className="w-full h-full object-cover" alt="" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">ديمو</div>
              </div>
            ))}
          </div>
        </div>
      );
      case 17: return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-right" dir="rtl">
          <Title label="ملخص الاعلان" />
          <div className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-border mb-8 text-base flex flex-col gap-4">
            {[
              ['نوع الاعلان', form.listingType === 'hotels' ? 'الفنادق' : form.listingType],
              ['نوع العقار',  form.propertyType],
              ['الدولة',      form.country],
              ['المنطقة',     form.area],
              ['الغرف',       String(form.rooms)],
              ['المساحة',     `${form.size} م²`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <span className="text-muted-foreground font-medium">{k}</span>
                <span className="font-bold text-foreground text-lg">{v || '—'}</span>
              </div>
            ))}
            <div className="mt-4 pt-6 border-t-2 border-dashed border-border flex flex-col gap-3">
              <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl">
                 <span className="font-bold">قيمة النشر</span>
                 <span className="text-2xl font-black text-primary">5 د.ك</span>
              </div>
            </div>
          </div>
          {published && (
            <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 text-white shadow-lg shadow-green-500/20">
                <Check className="w-12 h-12 stroke-4" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-3">تم النشر بنجاح!</h3>
              <p className="text-muted-foreground text-base max-w-xs text-center leading-relaxed">جاري التوجيه إلى حسابك لإدارة الإعلان...</p>
            </div>
          )}
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden" dir="rtl">
      <ProgressTop step={step} setStep={setStep} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-48 pt-10 md:pt-20">
        <div className="max-w-4xl mx-auto px-5 w-full">
           {renderContent()}
        </div>
      </div>

      {/* Footer actions */}
      {!published && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-5 md:px-8 bg-linear-to-t from-background via-background to-transparent z-30">
          <div className="bg-card/80 backdrop-blur-xl border border-border p-4 md:p-6 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row-reverse gap-3">
            
            {/* Primary Action */}
            {step === 17 ? (
              <div className="flex-1 flex flex-col md:flex-row gap-3">
                <button onClick={handlePublish} disabled={processing}
                  className="flex-1 py-4 md:py-5 bg-black text-white rounded-2xl md:rounded-3xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-zinc-800">
                  {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : '🍎 Apple Pay الدفع'}
                </button>
                <button onClick={handlePublish} disabled={processing}
                  className="flex-1 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl md:rounded-3xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-primary/90">
                  {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <><Image src={KNET_LOGO} width={32} height={32} className="w-8 h-8 object-contain bg-white rounded-full p-0.5" alt="KNET" />كي نت</>
                  )}
                </button>
              </div>
            ) : [8, 15, 16].includes(step) ? (
              <button onClick={next}
                className="flex-2 py-4 md:py-5 bg-primary text-primary-foreground rounded-2xl md:rounded-3xl font-black text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2">
                التالي <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            ) : (
              <div className="hidden md:block flex-2" />
            )}

            {/* Back Action */}
            <button 
              onClick={prev} 
              disabled={step === 1 || processing}
              className={cn(
                "flex-1 py-4 md:py-5 bg-muted/50 border border-border text-foreground rounded-2xl md:rounded-3xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50 hover:bg-muted flex items-center justify-center gap-2",
                step === 1 && "invisible"
              )}
            >
              <ChevronRight className="w-5 h-5" /> رجوع
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default function PostAdPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <PostAdForm />
    </Suspense>
  );
}
