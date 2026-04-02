import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchExploreListings } from '@/features/listing-detail/services/listing-detail.service';
import { ExploreFeed } from '@/features/explore/components/ExploreFeed';
import { Suspense } from 'react';
import type { Metadata } from 'next';

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
      <div className="flex flex-col md:flex-row gap-8 w-full pt-4" dir="rtl">
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
          <div className="sticky top-[96px] flex flex-col gap-6">
            <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl shadow-black/5">
              <h3 className="font-black text-lg mb-4">تصفية النتائج</h3>
              
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">نوع العقار</label>
                  <div className="flex flex-wrap gap-2">
                    {['شقة', 'فيلا', 'أرض', 'محل'].map(t => (
                      <button key={t} className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:border-primary hover:text-primary transition-colors">
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">المحافظة</label>
                  <select className="w-full bg-muted/30 border border-border rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
                    <option>الكل</option>
                    <option>العاصمة</option>
                    <option>حولي</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
              <h4 className="font-black text-primary relative z-10">إعلان مميز</h4>
              <p className="text-xs text-primary/70 relative z-10 mt-1">احصل على وصول أسرع لآلاف المستأجرين.</p>
              <button className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold relative z-10">تعرف على المزيد</button>
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
            </div>
          </div>
        </aside>
      </div>
    </HydrationBoundary>
  );
}
