'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GOVERNORATES, AREAS, COUNTRIES } from '@/lib/locations';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Upload, Play, Loader2 } from 'lucide-react';

const TOTAL_STEPS = 17;
const KNET_LOGO = 'https://media.licdn.com/dms/image/v2/D4D0BAQFazp_I3lLeQg/company-logo_200_200/company-logo_200_200/0/1715599858189/the_shared_electronic_banking_services_co_knet_logo?e=2147483647&v=beta&t=FfjCLbNIUGrTCTi-tI5nXSNP9B4AcOJbWsFqV0bSWcM';

type FormData = {
  listingType: string; propertyType: string; country: string;
  governorate: string; area: string; rooms: number | string;
  bathrooms: number | string; size: number; balcony: string;
  parking: string; parkingSystems: string[]; electricity: string;
  water: string; ac: string; video: File | null; images: File[];
};

const INIT: FormData = {
  listingType: '', propertyType: '', country: 'الكويت', governorate: '', area: '',
  rooms: '', bathrooms: '', size: 400, balcony: '', parking: '', parkingSystems: [],
  electricity: '', water: '', ac: '', video: null, images: [],
};

// ── Shared helpers ──────────────────────────────────────────────────────────
function ProgressTop({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between px-5 pt-10 pb-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)' }}>
      <span className="text-xs font-bold text-muted-foreground">{step} من {TOTAL_STEPS}</span>
      <div className="flex-1 h-1.5 bg-muted mx-4 rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300 rounded-full" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>
    </div>
  );
}

function Title({ label }: { label: string }) {
  return <h2 className="text-xl font-bold text-center mb-6">{label}</h2>;
}

function Opt({ label, selected, onClick }: { label: React.ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={cn(
        'w-full p-4 mb-3 rounded-2xl border flex items-center justify-between transition-all duration-200 active:scale-95',
        selected ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'border-border bg-card text-foreground hover:border-primary/40',
      )}>
      <div className="font-bold text-sm">{label}</div>
      {selected && <Check className="w-5 h-5" />}
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
export default function PostAdPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INIT);
  const [processing, setProcessing] = useState(false);
  const [published, setPublished] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof FormData, value: unknown) => setForm(f => ({ ...f, [key]: value }));
  const next = () => { if (step < TOTAL_STEPS) setStep(s => s + 1); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };
  const sel = (key: keyof FormData, value: unknown) => { update(key, value); setTimeout(next, 150); };

  const handlePublish = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPublished(true);
      setTimeout(() => router.push('/account'), 1500);
    }, 2000);
  };

  const currentAreas = AREAS[form.governorate] ?? [];

  const renderContent = () => {
    switch (step) {
      case 1: return (
        <><Title label="نوع الاعلان" />
          {[{ l: 'للبيع', v: 'للبيع' }, { l: 'للإيجار', v: 'للإيجار' }, { l: 'الفنادق', v: 'hotels' }].map(o =>
            <Opt key={o.v} label={o.l} selected={form.listingType === o.v} onClick={() => sel('listingType', o.v)} />)}</>
      );
      case 2: return (
        <><Title label="نوع العقار" />
          {['بيت', 'شقة', 'دور', 'عمارة', 'دوبلكس'].map(o =>
            <Opt key={o} label={o} selected={form.propertyType === o} onClick={() => sel('propertyType', o)} />)}</>
      );
      case 3: return (
        <><Title label="الدولة" />
          {COUNTRIES.map(c =>
            <Opt key={c.name} label={<span className="flex items-center gap-3"><span className="text-2xl">{c.flag}</span>{c.name}</span>}
              selected={form.country === c.name} onClick={() => sel('country', c.name)} />)}</>
      );
      case 4: return (
        <><Title label="المحافظة" />
          {GOVERNORATES.map(o =>
            <Opt key={o} label={o} selected={form.governorate === o} onClick={() => sel('governorate', o)} />)}</>
      );
      case 5: return (
        <><Title label="المنطقة" />
          {currentAreas.map(o =>
            <Opt key={o} label={o} selected={form.area === o} onClick={() => sel('area', o)} />)}</>
      );
      case 6: return (
        <><Title label="عدد الغرف" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => sel('rooms', n)}
                className={cn('aspect-square rounded-2xl border flex items-center justify-center text-lg font-bold transition-all',
                  form.rooms === n ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/40')}>
                {n}
              </button>))}</div></>
      );
      case 7: return (
        <><Title label="عدد الحمامات" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array.from({ length: 10 }, (_, i) => i + 1), '10+'].map(n => (
              <button key={n} onClick={() => sel('bathrooms', n)}
                className={cn('aspect-square rounded-2xl border flex items-center justify-center text-lg font-bold transition-all',
                  form.bathrooms === n ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/40')}>
                {n}
              </button>))}</div></>
      );
      case 8: return (
        <><Title label="المساحة" />
          <div className="flex flex-col items-center justify-center gap-8 py-10 bg-card rounded-3xl border border-border shadow-sm">
            <span className="text-4xl font-bold text-primary">{form.size} <span className="text-sm text-muted-foreground">م²</span></span>
            <input type="range" min="50" max="2000" step="5" value={form.size}
              onChange={e => update('size', parseInt(e.target.value))}
              className="w-4/5 accent-[hsl(var(--primary))] h-2 rounded-lg appearance-none cursor-pointer" />
          </div></>
      );
      case 9: return (
        <><Title label="بلكونة" />
          {['نعم', 'لا'].map(o => <Opt key={o} label={o} selected={form.balcony === o} onClick={() => sel('balcony', o)} />)}</>
      );
      case 10: return (
        <><Title label="عدد المواقف" />
          {['1', '2', '3', '3+'].map(o => <Opt key={o} label={o} selected={form.parking === o} onClick={() => sel('parking', o)} />)}</>
      );
      case 11: return (
        <><Title label="نظام المواقف" />
          {['مظلات', 'سرداب', 'اخرى'].map(o =>
            <Opt key={o} label={o} selected={form.parkingSystems.includes(o)} onClick={() => sel('parkingSystems', [o])} />)}</>
      );
      case 12: return (
        <><Title label="الكهرباء" />
          {['على المالك', 'على المستأجر'].map(o => <Opt key={o} label={o} selected={form.electricity === o} onClick={() => sel('electricity', o)} />)}</>
      );
      case 13: return (
        <><Title label="الماء" />
          {['على المالك', 'على المستأجر'].map(o => <Opt key={o} label={o} selected={form.water === o} onClick={() => sel('water', o)} />)}</>
      );
      case 14: return (
        <><Title label="التكييف" />
          {['على المالك', 'على المستأجر'].map(o => <Opt key={o} label={o} selected={form.ac === o} onClick={() => sel('ac', o)} />)}</>
      );
      case 15: return (
        <><Title label="ارفع فيديو" />
          <div className="relative aspect-video bg-muted rounded-xl overflow-hidden border-2 border-dashed border-border mb-4 flex items-center justify-center">
            {form.video ? (
              <video src={URL.createObjectURL(form.video)} className="w-full h-full object-cover" controls />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">اضغط لرفع فيديو</span>
              </div>
            )}
            <input ref={videoRef} type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => { if (e.target.files?.[0]) update('video', e.target.files[0]); }} />
          </div></>
      );
      case 16: return (
        <><Title label="ارفع صور العقار" />
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="aspect-square bg-muted/30 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center relative active:bg-muted/50 transition-colors">
              <Upload className="w-8 h-8 text-primary mb-2" />
              <span className="text-xs font-bold text-primary">رفع المزيد</span>
              <input ref={fileRef} type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={e => { if (e.target.files) setForm(f => ({ ...f, images: [...f.images, ...Array.from(e.target.files!)] })); }} />
            </div>
            {form.images.map((file, i) => (
              <div key={`up-${i}`} className="aspect-square rounded-xl overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
            {DEMO_IMAGES.map((src, i) => (
              <div key={`demo-${i}`} className="aspect-square rounded-xl overflow-hidden bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} className="w-full h-full object-cover" alt="" />
                <span className="absolute top-1 right-1 bg-black/50 text-white text-[11px] px-1.5 rounded">ديمو</span>
              </div>
            ))}
          </div></>
      );
      case 17: return (
        <><Title label="ملخص الاعلان" />
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border mb-6 text-sm flex flex-col gap-2">
            {[
              ['نوع الاعلان', form.listingType === 'hotels' ? 'الفنادق' : form.listingType],
              ['نوع العقار',  form.propertyType],
              ['الدولة',      form.country],
              ['المنطقة',     form.area],
              ['الغرف',       String(form.rooms)],
              ['المساحة',     `${form.size} م²`],
              ['السعر',       '5 د.ك'],
              ['مدة النشر',   '30 يوم'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-bold">{v}</span>
              </div>
            ))}
          </div>
          {published && (
            <div className="flex flex-col items-center justify-center py-10 animate-in fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 dark:bg-green-900/30">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">تم نشر الإعلان بنجاح</h3>
              <p className="text-muted-foreground text-sm">سيظهر إعلانك في حسابك فوراً</p>
            </div>
          )}</>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative" dir="rtl">
      <ProgressTop step={step} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-48">
        <div className="max-w-md mx-auto py-2">
          {renderContent()}
        </div>
      </div>

      {/* Footer actions */}
      {!published && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 bg-gradient-to-t from-background via-background/95 to-transparent z-30">
          {/* Steps with manual Next button: 8 (size slider), 15 (video), 16 (images) */}
          {[8, 15, 16].includes(step) && (
            <div className="flex flex-col gap-3">
              <button onClick={prev} disabled={step === 1}
                className="w-full py-3 bg-card border border-border text-foreground rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50">
                رجوع
              </button>
              <button onClick={next}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
                التالي
              </button>
            </div>
          )}

          {/* Payment step 17 */}
          {step === 17 && (
            <div className="flex flex-col gap-3">
              <button onClick={prev}
                className="w-full py-3 bg-card border border-border text-foreground rounded-xl font-bold transition-all active:scale-95">
                رجوع
              </button>
              <button onClick={handlePublish} disabled={processing}
                className="w-full py-4 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl">
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : '🍎 الدفع والنشر (Apple Pay)'}
              </button>
              <button onClick={handlePublish} disabled={processing}
                className="w-full py-4 bg-card border border-border text-foreground rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <><img src={KNET_LOGO} className="w-7 h-7 object-contain" alt="KNET" />الدفع عبر الكي نت</>
                )}
              </button>
            </div>
          )}

          {/* All other steps — back only (auto-advance on select) */}
          {![8, 15, 16, 17].includes(step) && (
            <button onClick={prev} disabled={step === 1}
              className={cn('w-full py-4 bg-transparent text-muted-foreground font-bold hover:text-foreground transition-colors',
                step === 1 && 'invisible')}>
              <span className="flex items-center justify-center gap-1"><ChevronRight className="w-4 h-4" />رجوع</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
