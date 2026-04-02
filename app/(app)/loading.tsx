import { HomeListingCardSkeleton } from '@/features/home/components/HomeListingCard';

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 pt-2 pb-28 animate-pulse" dir="rtl">
      {/* Country + theme */}
      <div className="flex items-center justify-between -mb-2">
        <div className="h-8 w-28 bg-muted rounded-full" />
        <div className="h-10 w-10 bg-muted rounded-full" />
      </div>

      {/* Banner */}
      <div className="w-full aspect-[2.5/1] bg-muted rounded-2xl" />

      {/* Search card */}
      <div className="h-16 bg-muted rounded-2xl" />

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-2xl" />
        ))}
      </div>

      {/* Listing grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <HomeListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
