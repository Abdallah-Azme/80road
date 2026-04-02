'use client';

import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';

export function SearchCard() {
  const prefs = useUIStore(s => s.preferences);

  const text = prefs?.propertyType && prefs?.area
    ? `${prefs.propertyType} / ${prefs.area}`
    : 'اضغط لتحديد طلبك';

  return (
    <Link
      href="/quick-start?mode=edit"
      id="search-card"
      dir="rtl"
      className="group w-full bg-card/60 backdrop-blur-xl text-foreground rounded-full p-2.5 pr-8 shadow-2xl shadow-primary/5 flex flex-row items-center justify-between cursor-pointer active:scale-[.97] transition-all border border-border/40 hover:border-primary/40 hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-ring outline-none"
    >
      <div className="flex items-center gap-6 z-10 w-full overflow-hidden">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-widest group-hover:text-primary transition-colors">
            عن ماذا تبحث؟
          </span>
          <h3 className="text-sm md:text-lg font-black leading-tight tracking-tight truncate max-w-[180px] md:max-w-none text-foreground/90">
            {text}
          </h3>
        </div>
      </div>
      <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-primary/10 text-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
        <SlidersHorizontal className="w-5 h-5 md:w-6 md:h-6" />
      </div>
    </Link>
  );
}
