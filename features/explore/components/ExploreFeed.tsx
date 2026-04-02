'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Loader2 } from 'lucide-react';
import { useExploreListings } from '../hooks/useExploreListings';

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop';

function ExploreItem({ listing }: { listing: { id: number; title: string; price: string; area: string; governorate: string; propertyType: string; images: string[]; video?: string } }) {
  const [imgSrc, setImgSrc] = useState(listing.images[0] ?? FALLBACK);
  const poster = listing.images[0] ?? FALLBACK;

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`explore-item-${listing.id}`}
      className="relative aspect-3/4 bg-muted dark:bg-slate-800 cursor-pointer overflow-hidden group block rounded-2xl border border-border/50 shadow-lg shadow-black/5 active:scale-95 transition-all duration-300"
    >
      {/* Thumbnail with smooth zoom */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={listing.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgSrc(FALLBACK)}
      />

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />

      {/* Play icon with glass effect */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl">
          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* Meta info with hierarchy */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end text-white" dir="rtl">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-0.5 min-w-0">
             <span className="font-black text-lg md:text-xl tracking-tight drop-shadow-lg">{listing.price}</span>
             <span className="text-[13px] font-medium opacity-90 truncate drop-shadow-md">{listing.area}</span>
          </div>
          <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-wider">
            {listing.propertyType}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ExploreFeed() {
  const { data, isPending, isError } = useExploreListings();

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-destructive text-sm" dir="rtl">
        تعذّر تحميل المحتوى
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground" dir="rtl">
        <Play className="w-12 h-12 mb-2 opacity-20" />
        <p className="text-sm">لا توجد فيديوهات حالياً</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-24" dir="rtl">
      {/* Dense responsive grid: 2 cols mobile → 3 md → 3 lg (sidebar taking space) → 4 on xl+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
        {data.map(listing => (
          <ExploreItem key={listing.id} listing={listing as Parameters<typeof ExploreItem>[0]['listing']} />
        ))}
      </div>
    </div>
  );
}
