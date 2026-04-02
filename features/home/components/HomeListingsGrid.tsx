'use client';

import { useHomeListings } from '../hooks/useHomeListings';
import { HomeListingCard, HomeListingCardSkeleton } from './HomeListingCard';

export function HomeListingsGrid() {
  const { data, isPending, isError } = useHomeListings();

  if (isError) {
    return (
      <div className="col-span-2 py-10 text-center text-destructive text-sm font-medium" dir="rtl">
        تعذّر تحميل الإعلانات. يرجى المحاولة لاحقاً.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 2xl:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <HomeListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 2xl:gap-8">
      {data.map(listing => (
        <HomeListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
