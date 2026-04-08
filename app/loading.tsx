import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Brand Pulse */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse duration-2000" />
          <div className="relative w-24 h-24 md:w-32 md:h-32 bg-card border-2 border-primary/20 rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
            {/* Spinning Gradient Ring */}
            <div className="absolute inset-0 border-t-2 border-primary animate-spin duration-1500" />
            <div className="absolute inset-1 border-r-2 border-primary/30 animate-spin-reverse duration-2000" />
            
            <span className="text-5xl font-black text-primary drop-shadow-[0_2px_10px_rgba(var(--primary),0.3)] select-none">
              80
            </span>
          </div>
        </div>

        {/* Loading Text with Dynamic Punctuation */}
        <div className="flex flex-col items-center gap-2" dir="rtl">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground/90 animate-pulse">
            جاري تحميل الطريق...
          </h2>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle Bottom Branding */}
      <div className="absolute bottom-12 opacity-30 select-none pointer-events-none">
        <p className="font-black text-xs uppercase tracking-[0.5em] text-foreground">
          80ROAD PLATFORM
        </p>
      </div>
    </div>
  );
}
