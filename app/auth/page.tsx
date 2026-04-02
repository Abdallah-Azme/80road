'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/stores/user.store';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';

type Step = 'phone' | 'otp' | 'done';

export default function AuthPage() {
  const router = useRouter();
  const login = useUserStore(s => s.login);

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const box0 = useRef<HTMLInputElement>(null);
  const box1 = useRef<HTMLInputElement>(null);
  const box2 = useRef<HTMLInputElement>(null);
  const box3 = useRef<HTMLInputElement>(null);
  const boxRefs = [box0, box1, box2, box3];

  const otp = digits.join('');

  const handleSendOtp = async () => {
    if (phone.length < 8) { setError('أدخل رقم هاتف صحيح'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep('otp');
    setTimeout(() => boxRefs[0].current?.focus(), 100);
  };

  const handleDigit = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, '').slice(-1);
    setDigits(prev => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < 3) {
      boxRefs[index + 1].current?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      boxRefs[index - 1].current?.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [digits]);

  const handleVerifyOtp = async () => {
    if (otp.length < 4) { setError('أدخل رمز التحقق'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login({ phone });
    setLoading(false);
    setStep('done');
    setTimeout(() => router.replace('/quick-start'), 1000);
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

        {/* ── Step 1: Phone ── */}
        {step === 'phone' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="phone-input" className="text-sm font-bold text-foreground/80 px-1">رقم الهاتف</label>
              <div className="flex gap-2 h-14">
                <span className="flex items-center px-4 bg-muted/50 border border-border rounded-2xl text-sm font-bold text-muted-foreground">
                  +965
                </span>
                <Input
                  id="phone-input"
                  type="tel"
                  placeholder="XXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 text-right h-full rounded-2xl border-border px-4 font-bold text-lg focus:ring-4 focus:ring-primary/10"
                  maxLength={8}
                />
              </div>
            </div>
            {error && <p className="text-destructive text-xs font-bold px-2">{error}</p>}
            <Button
              id="send-otp-btn"
              size="lg"
              className="w-full h-15 rounded-2xl font-black text-base gap-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading
                ? <div className="w-5 h-5 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                : <><Phone className="w-5 h-5" /> إرسال رمز التحقق</>}
            </Button>
          </div>
        )}

        {/* ── Step 2: OTP ── */}
        {step === 'otp' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-center">
              <div className="space-y-1">
                <label className="text-sm font-bold text-foreground/80">رمز التحقق</label>
                <p className="text-xs text-muted-foreground font-medium">
                  تم إرسال الرمز المكون من 4 أرقام لـ <span className="text-primary font-bold" dir="ltr">+965 {phone}</span>
                </p>
              </div>

              <div className="flex gap-3 justify-center py-2" dir="ltr">
                {([0, 1, 2, 3] as const).map(i => (
                  <input
                    key={i}
                    id={`otp-digit-${i}`}
                    ref={boxRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i]}
                    onChange={e => handleDigit(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-14 h-18 text-center text-3xl font-black rounded-2xl border-2 border-border bg-muted/20 text-foreground focus:border-primary focus:ring-8 focus:ring-primary/10 focus:outline-none transition-all shadow-sm caret-transparent"
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-destructive text-xs text-center font-bold">{error}</p>}

            <Button
              id="verify-otp-btn"
              size="lg"
              className="w-full h-15 rounded-2xl font-black text-base gap-3"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading
                ? <div className="w-5 h-5 border-3 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                : <><ArrowRight className="w-5 h-5" /> متابعة تسجيل الدخول</>}
            </Button>

            <button
              id="resend-otp"
              className="text-sm text-primary font-bold hover:underline"
              onClick={() => { setStep('phone'); setDigits(['', '', '', '']); }}
            >
              هل أخطأت في الرقم؟ عد للخلف
            </button>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 'done' && (
          <div className="flex flex-col items-center gap-6 py-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <div className="text-center">
              <p className="font-black text-xl mb-1">تم التحقق بنجاح</p>
              <p className="text-sm text-muted-foreground">جاري تحويلك للمنصة...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
