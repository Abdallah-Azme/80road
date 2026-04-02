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
    <div className="min-h-screen flex items-center justify-center bg-background p-6" dir="rtl">
      <div className="w-full max-w-sm flex flex-col gap-8">

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex w-20 h-20 rounded-3xl bg-primary items-center justify-center shadow-xl shadow-primary/30 mb-4">
            <span className="text-primary-foreground font-black text-2xl tracking-tighter">80</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">مرحباً بك</h1>
          <p className="text-sm text-muted-foreground mt-1">سجّل دخولك للمتابعة</p>
        </div>

        {/* ── Step 1: Phone ── */}
        {step === 'phone' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="phone-input" className="text-sm font-semibold">رقم الهاتف</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">
                  +965
                </span>
                <Input
                  id="phone-input"
                  type="tel"
                  placeholder="XXXXXXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 text-right"
                  maxLength={8}
                />
              </div>
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button
              id="send-otp-btn"
              size="lg"
              className="w-full h-14 rounded-2xl font-bold gap-2"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                : <><Phone className="w-5 h-5" /> إرسال رمز التحقق</>}
            </Button>
          </div>
        )}

        {/* ── Step 2: OTP — 4 individual digit boxes ── */}
        {step === 'otp' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold">رمز التحقق</label>
              <p className="text-xs text-muted-foreground">
                تم إرسال رمز التحقق إلى +965 {phone}
              </p>

              {/* 4 boxes left-to-right (ltr for digit order) */}
              <div className="flex gap-3 justify-center" dir="ltr">
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
                    className="w-14 h-16 text-center text-2xl font-black rounded-2xl border-2 border-border bg-card text-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all shadow-sm caret-transparent"
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-destructive text-xs text-center">{error}</p>}

            <Button
              id="verify-otp-btn"
              size="lg"
              className="w-full h-14 rounded-2xl font-bold gap-2"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                : <><ArrowRight className="w-5 h-5" /> تأكيد</>}
            </Button>

            <button
              id="resend-otp"
              className="text-sm text-primary text-center hover:opacity-80 transition-opacity"
              onClick={() => { setStep('phone'); setDigits(['', '', '', '']); }}
            >
              إعادة الإرسال
            </button>
          </div>
        )}

        {/* ── Step 3: Done ── */}
        {step === 'done' && (
          <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="font-bold text-lg">تم تسجيل الدخول بنجاح</p>
          </div>
        )}
      </div>
    </div>
  );
}
