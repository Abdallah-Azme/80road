import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchHomeListings } from '@/features/home/services/listings.service';
import { BannerSlider } from '@/features/home/components/BannerSlider';
import { QuickActions } from '@/features/home/components/QuickActions';
import { HomeListingsGrid } from '@/features/home/components/HomeListingsGrid';
import { SearchCard } from '@/features/home/components/SearchCard';
import { CountryPicker } from '@/features/home/components/CountryPicker';
import { HomeListingCardSkeleton } from '@/features/home/components/HomeListingCard';
import { SectionHeader } from '@/components/ui/section-header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '80road – أفضل العقارات في الكويت',
  description: 'اكتشف أحدث إعلانات الشقق والفلل والأراضي في الكويت مع 80road',
};

export default async function HomePage() {
  // ── Server-side prefetch ──────────────────────────────────
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.listings.all,
    queryFn: fetchHomeListings,
  });
  // Dehydrate the cache so the client doesn't refetch
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 flex flex-col gap-12 md:gap-24 animate-in fade-in duration-700" dir="rtl">

        {/* ── Row: Country Picker (Mobile Only) ── */}
        <div className="flex md:hidden items-center justify-center -mb-6">
          <CountryPicker />
        </div>

        {/* ── Hero & Search Section ──────────────────────── */}
        <div className="flex flex-col gap-6 md:gap-10">
          <BannerSlider />
          <div className="px-1 md:px-0">
            <SearchCard />
          </div>
        </div>

        {/* ── Quick Actions ────────────────────────────── */}
        <section className="flex flex-col gap-8 md:gap-12">
          <SectionHeader 
            title="استكشف حسب الفئة"
            description="تصفح آلاف العقارات المرتبة حسب احتياجاتك من شقق، فلل، أراضي ومكاتب."
          />
          <QuickActions />
        </section>

        {/* ── Latest Listings ──────────────────────────── */}
        <section aria-labelledby="latest-listings-heading" className="flex flex-col">
          <SectionHeader 
            title="أحدث الإعلانات"
            description="إليك ما تمت إضافته مؤخراً ويناسب اهتماماتك في سوق العقار الكويتي."
            action={
              <Button variant="ghost" className="text-primary font-black hover:bg-primary/5 hidden md:flex text-base">
                عرض الكل
              </Button>
            }
          />

          <Suspense
            fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                {Array.from({ length: 10 }).map((_, i) => (
                  <HomeListingCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <HomeListingsGrid />
          </Suspense>

          <div className="flex justify-center">
            <button
              id="load-more-listings"
              className="group relative w-full md:w-auto md:min-w-[280px] overflow-hidden py-4 px-8 bg-primary text-primary-foreground rounded-2xl font-black text-base shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all"
            >
              <span className="relative z-10">استكشاف المزيد من النتائج</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </section>

        {/* ── Bottom Premium Banner ─────────────────────── */}
        <div className="group relative w-full rounded-3xl overflow-hidden shadow-2xl aspect-[2.2/1] md:aspect-5/1 border border-border/20">
          <Image
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
            fill
            alt="استثمر معنا"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-transparent flex items-center p-8 md:p-16">
            <div className="flex flex-col gap-2 md:gap-4 max-w-lg text-white">
              <h3 className="text-2xl md:text-4xl font-black">جاهز لبيع عقارك؟</h3>
              <p className="text-sm md:text-lg font-medium opacity-90">انضم لأكثر من 50,000 مستخدم نشط يومياً على 80road.</p>
              <button className="mt-2 w-fit px-6 py-3 bg-white text-navy rounded-xl font-bold hover:bg-white/90 transition-colors">ابدأ الآن</button>
            </div>
          </div>
        </div>

      </div>
    </HydrationBoundary>
  );
}
