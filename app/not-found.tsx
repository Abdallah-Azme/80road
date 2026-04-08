"use client";

import Link from "next/link";
import { Home, Search, Compass, Map, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 pt-12 pb-24 overflow-hidden relative" dir="rtl">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      {/* 404 Visual Content */}
      <div className="relative mb-16 group">
        <span className="text-[150px] md:text-[240px] font-black leading-none bg-linear-to-b from-primary/15 via-primary/5 to-transparent bg-clip-text text-transparent select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center translate-y-4">
          <div className="relative w-32 h-32 md:w-48 md:h-48 bg-card border-2 border-border/60 rounded-[48px] shadow-2xl flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-primary/10">
             <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent rounded-[46px]" />
             <div className="flex flex-col items-center gap-3 relative animate-bounce duration-3000">
                <Map className="w-12 h-12 md:w-20 md:h-20 text-primary opacity-80" />
                <Search className="w-6 h-6 md:w-10 md:h-10 text-primary/40 absolute -top-2 -right-2 rotate-12" />
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-6 max-w-2xl relative z-10">
        <h1 className="text-3xl md:text-6xl font-black tracking-tight text-foreground">
          نهاية الطريق!
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed max-w-lg mb-8">
          يبدو أنك سلكت طريقاً غير موجود في خريطتنا. لا تقلق، &quot;80road&quot; دائماً لديه طرق بديلة لتعيدك للمسار الصحيح.
        </p>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
          <Button asChild className="h-20 rounded-3xl px-8 font-black text-xl gap-3 shadow-2xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95">
            <Link href="/">
              <Home className="w-6 h-6" />
              العودة للرئيسية
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-20 rounded-3xl px-8 font-black text-xl gap-3 border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:bg-card hover:-translate-y-1 active:scale-95">
            <Link href="/explore">
              <Compass className="w-6 h-6" />
              استكشاف العقارات
            </Link>
          </Button>
        </div>

        {/* Suggestion Link */}
        <Link 
          href="/quick-start" 
          className="mt-8 flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:scale-125" />
          <span>جرب البحث الذكي للمساعدة</span>
        </Link>
      </div>

      <div className="absolute bottom-12 text-center opacity-30">
        <p className="font-black text-xs uppercase tracking-[0.6em] text-foreground">80ROAD PLATFORM</p>
      </div>
    </div>
  );
}
