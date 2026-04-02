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
      className="group w-full bg-card text-foreground rounded-2xl p-4 md:p-6 shadow-lg shadow-primary/5 flex flex-row items-center justify-between cursor-pointer active:scale-[.98] transition-all border border-border hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-ring outline-none"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 z-10 w-full">
        <span className="text-[13px] md:text-sm text-muted-foreground font-medium group-hover:text-primary transition-colors whitespace-nowrap">
          عن ماذا تبحث؟
        </span>
        <h3 className="text-sm md:text-base font-semibold leading-tight truncate max-w-[200px] md:max-w-none">{text}</h3>
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-muted rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        <SlidersHorizontal className="w-5 h-5" />
      </div>
    </Link>
  );
}
