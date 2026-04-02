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
      {/* Full-bleed video feed */}
      <div className="absolute inset-0">
        <Suspense fallback={
          <div className="flex h-full items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <ExploreFeed />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}
