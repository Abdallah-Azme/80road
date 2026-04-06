'use client';

import Link from 'next/link';
import { useHomeData } from '@/shared/hooks/useHome';
import { CustomImage } from '@/shared/components/custom-image';

export function QuickActions() {
  const { data, isLoading } = useHomeData();
  const categories = data?.categories || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-3 md:gap-8" dir="rtl">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-card w-full md:w-44 lg:w-52 py-4 md:py-8 rounded-2xl md:rounded-3xl shadow-lg border border-border/50 animate-pulse flex flex-col items-center justify-center gap-2 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-muted" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:flex md:flex-wrap items-center justify-center gap-3 md:gap-8" dir="rtl">
      {categories.map(category => (
        <Link
          key={category.id}
          href={`/explore?category=${category.id}`}
          id={`quick-action-${category.id}`}
          className="group flex flex-col items-center justify-center gap-2 md:gap-4 bg-card w-full md:w-44 lg:w-52 py-4 md:py-8 rounded-2xl md:rounded-3xl shadow-lg shadow-primary/5 border border-border/50 active:scale-95 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-ring outline-none"
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 transform group-hover:rotate-6 shadow-inner">
            <CustomImage 
              src={category.icon} 
              alt={category.value}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-sm md:text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
            {category.value}
          </span>
        </Link>
      ))}
    </div>
  );
}
