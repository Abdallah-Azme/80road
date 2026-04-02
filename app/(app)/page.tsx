import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { QUERY_KEYS } from '@/lib/types';
import { fetchHomeListings } from '@/features/home/services/listings.service';
import { BannerSlider } from '@/features/home/components/BannerSlider';
import { QuickActions } from '@/features/home/components/QuickActions';
import { HomeListingsGrid } from '@/features/home/components/HomeListingsGrid';
import { SearchCard } from '@/features/home/components/SearchCard';
import { CountryPicker } from '@/features/home/components/CountryPicker';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';
import { Suspense } from 'react';
import { HomeListingCardSkeleton } from '@/features/home/components/HomeListingCard';
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
      <div className="flex flex-col gap-6 p-4 pt-2 pb-28 animate-in fade-in duration-300" dir="rtl">

        {/* ── Row: Country + Theme ─────────────────────── */}
        <div className="flex items-center justify-between -mb-2">
          <CountryPicker />
          <ThemeToggle />
        </div>

        {/* ── Hero Banner ──────────────────────────────── */}
        <BannerSlider />

        {/* ── Smart Search Card ────────────────────────── */}
        <SearchCard />

        {/* ── Quick Actions ────────────────────────────── */}
        <QuickActions />

        {/* ── Latest Listings ──────────────────────────── */}
        <section aria-labelledby="latest-listings-heading" className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <h2 id="latest-listings-heading" className="text-sm font-bold text-foreground">
              أحدث الإعلانات المضافة تناسب طلبك
            </h2>
          </div>

          {/* Wrapped in Suspense so the grid can stream independently */}
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <HomeListingCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            {/* Client component – uses the hydrated cache; zero extra network req */}
            <HomeListingsGrid />
          </Suspense>

          <button
            id="load-more-listings"
            className="w-full py-3 bg-card border border-border text-foreground rounded-xl font-semibold text-sm hover:bg-muted active:scale-95 transition-all shadow-sm"
          >
            مشاهدة المزيد
          </button>
        </section>

        {/* ── Bottom Static Banner ─────────────────────── */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: '2.2/1' }}>
          <Image
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop"
            alt="بانر ثابت"
            fill
            className="object-cover opacity-90"
          />
        </div>

      </div>
    </HydrationBoundary>
  );
}
