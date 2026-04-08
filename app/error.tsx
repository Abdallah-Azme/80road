"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home, MessageSquareQuote } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background px-6 pt-12 pb-24"
      dir="rtl"
    >
      {/* High-Fidelity Icon Section */}
      <div className="relative mb-12 animate-in slide-in-from-top duration-700">
        <div className="absolute inset-0 bg-destructive/15 blur-3xl rounded-full scale-150 animate-pulse duration-2000" />
        <div className="relative w-24 h-24 md:w-32 md:h-32 bg-card border-2 border-destructive/20 rounded-[40px] shadow-2xl flex items-center justify-center transition-transform hover:scale-110 duration-500 overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-tr from-destructive/10 to-transparent group-hover:scale-125 transition-transform duration-1000" />
          <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-destructive drop-shadow-[0_2px_10px_rgba(var(--destructive),0.4)]" />
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-4 max-w-2xl animate-in fade-in slide-in-from-bottom duration-700">
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
          عذراً، حدث خطأ غير متوقع!
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed mb-6">
          لقد واجهنا مشكلة فنية أثناء تحميل الصفحة. فريقنا التقني يعمل الآن على
          حلها، يرجى المحاولة مرة أخرى.
        </p>

        {/* Technical Info Expansion */}
        <div className="w-full bg-muted/30 border border-border/60 rounded-[32px] p-6 mb-8 text-left group transition-all hover:bg-muted/50">
          <div className="flex items-center justify-between mb-3 border-b border-border/60 pb-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
              System Log Info
            </span>
            {error.digest && (
              <span className="text-[10px] font-mono text-muted-foreground">
                ID: {error.digest}
              </span>
            )}
          </div>
          <p className="font-mono text-sm text-destructive/80 leading-relaxed max-h-40 overflow-auto scrollbar-thin scrollbar-thumb-border">
            {error.message ||
              "An unspecified error occurred in the platform core."}
          </p>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={() => reset()}
            className="h-16 rounded-2xl flex-1 px-8 font-black text-lg gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 group"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            إعادة المحاولة
          </Button>
          <Button
            id="error-report-btn"
            variant="outline"
            className="h-16 rounded-2xl flex-1 px-8 font-black text-lg gap-2 border-border/60 hover:bg-muted/50 active:scale-95 transition-all text-muted-foreground"
          >
            <MessageSquareQuote className="w-5 h-5" />
            إبلاغ عن المشكلة
          </Button>
        </div>

        {/* Secondary Back Home */}
        <Button
          asChild
          variant="ghost"
          className="mt-4 h-12 rounded-xl text-primary font-black hover:bg-primary/5 gap-2 px-8"
        >
          <Link href="/">
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
}
