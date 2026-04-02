'use client';

import { useState } from 'react';
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
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (phone.length < 8) { setError('أدخل رقم هاتف صحيح'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate API
    setLoading(false);
    setStep('otp');
  };

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
        {/* Logo area */}
        <div className="text-center">
          <div className="inline-flex w-20 h-20 rounded-3xl bg-primary items-center justify-center shadow-xl shadow-primary/30 mb-4">
            <span className="text-primary-foreground font-black text-2xl tracking-tighter">80</span>
          </div>
          <h1 className="text-2xl font-black text-foreground">مرحباً بك</h1>
          <p className="text-sm text-muted-foreground mt-1">سجّل دخولك للمتابعة</p>
        </div>

        {step === 'phone' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="phone-input" className="text-sm font-semibold">رقم الهاتف</label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-muted border border-border rounded-lg text-sm text-muted-foreground">+965</span>
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
            <Button id="send-otp-btn" size="lg" className="w-full h-14 rounded-2xl font-bold gap-2" onClick={handleSendOtp} disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Phone className="w-5 h-5" /> إرسال رمز التحقق</>
              )}
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="otp-input" className="text-sm font-semibold">رمز التحقق</label>
              <p className="text-xs text-muted-foreground">تم إرسال رمز التحقق إلى +965 {phone}</p>
              <Input
                id="otp-input"
                type="number"
                placeholder="- - - -"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="text-center text-2xl tracking-[0.5em] h-14"
                maxLength={4}
              />
            </div>
            {error && <p className="text-destructive text-xs">{error}</p>}
            <Button id="verify-otp-btn" size="lg" className="w-full h-14 rounded-2xl font-bold gap-2" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <><ArrowRight className="w-5 h-5" /> تأكيد</>
              )}
            </Button>
            <button id="resend-otp" className="text-sm text-primary text-center" onClick={() => setStep('phone')}>
              إعادة الإرسال
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
            <p className="font-bold text-lg">تم تسجيل الدخول بنجاح</p>
          </div>
        )}
      </div>
    </div>
  );
}
