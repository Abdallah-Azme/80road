import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchExploreListings } from '@/features/listing-detail/services/listing-detail.service';
import { ExploreFeed } from '@/features/explore/components/ExploreFeed';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ExploreFilters } from "@/features/explore/components/ExploreFilters";

export const metadata: Metadata = {
  title: 'اكسبلور | 80road',
  description: 'استعرض إعلانات العقارات بأسلوب الفيديو القصير',
};

export default async function ExplorePage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.listings.explore,
    queryFn: fetchExploreListings,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24" dir="rtl">
        {/* ── Mobile Filters Trigger ── */}
        <div className="md:hidden flex items-center justify-between mb-8 pt-6">
          <h2 className="text-3xl font-black tracking-tight">اكسبلور</h2>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2.5 px-5 py-3 border border-border/60 rounded-2xl font-black bg-card shadow-xl shadow-black/5 hover:bg-muted transition-all active:scale-95 text-sm">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                تصفية
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-[40px] px-6 pt-10" dir="rtl">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-black text-right">تصفية النتائج</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto no-scrollbar pb-10">
                <ExploreFilters />
                <button className="w-full mt-10 py-5 bg-primary text-primary-foreground rounded-3xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  عرض النتائج
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full md:pt-8" dir="rtl">
          {/* ── Main Catalog Feed ── */}
          <div className="flex-1 min-w-0">
          <Suspense fallback={
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl" />
              ))}
            </div>
          }>
            <ExploreFeed />
          </Suspense>
        </div>

        {/* ── Desktop Filter Sidebar ── */}
        <aside className="hidden md:block w-72 lg:w-80 shrink-0">
          <div className="sticky top-[96px] flex flex-col gap-8">
            <div className="bg-card border border-border/60 rounded-[40px] p-8 shadow-2xl shadow-primary/5">
              <h3 className="font-black text-xl mb-6">تصفية النتائج</h3>
              <ExploreFilters />
              <button className="w-full mt-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
                تطبيق الفلاتر
              </button>
            </div>

            {/* Promo Card */}
            <div className="bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-[40px] p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-black text-xl text-primary leading-tight">إعلان مميز</h4>
                <p className="text-sm text-primary/70 mt-2 font-medium">احصل على وصول أسرع لآلاف المستأجرين والمشترين شهرياً.</p>
                <button className="mt-6 w-full py-3 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/10 group-hover:scale-105 transition-all">تعرف على المميزات</button>
              </div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1500" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  </HydrationBoundary>
);
}
