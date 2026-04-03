'use client';

import Link from 'next/link';
import { Home, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-6" dir="rtl">
      <div className="relative mb-12">
        <span className="text-[120px] md:text-[200px] font-black leading-none bg-linear-to-b from-primary/20 to-transparent bg-clip-text text-transparent">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 md:w-40 md:h-40 bg-card border border-border/60 rounded-[40px] shadow-2xl flex items-center justify-center animate-bounce duration-2000">
            <span className="text-4xl md:text-6xl">🔍</span>
          </div>
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-center mb-4 tracking-tighter">عذراً، الصفحة غير موجودة!</h1>
      <p className="text-muted-foreground text-center text-lg max-w-md font-medium leading-relaxed mb-12">
        يبدو أنك سلكت طريقاً خاطئاً. لا تقلق، يمكنك العودة دائماً إلى الطريق الصحيح.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md">
        <Button asChild className="h-14 rounded-2xl px-8 font-black text-lg flex-1 shadow-xl shadow-primary/20">
          <Link href="/">
            <Home className="w-5 h-5 ml-2" />
            الرئيسية
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-14 rounded-2xl px-8 font-black text-lg flex-1 border-border/60">
          <Link href="/explore">
            استكشاف العقارات
            <ChevronLeft className="w-5 h-5 mr-2" />
          </Link>
        </Button>
      </div>
      
      <div className="mt-24 text-center">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">80ROAD PLATFORM</p>
      </div>
    </div>
  );
}
