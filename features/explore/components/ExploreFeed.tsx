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
      className="relative aspect-square bg-gray-200 dark:bg-slate-800 cursor-pointer overflow-hidden group block"
    >
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={listing.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={() => setImgSrc(FALLBACK)}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

      {/* Play icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
          <Play className="w-5 h-5 text-white ml-0.5" />
        </div>
      </div>

      {/* Meta info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end text-white" dir="rtl">
        <span className="font-bold text-sm drop-shadow-md truncate">{listing.price}</span>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[13px] opacity-90 truncate max-w-[70%]">{listing.area}</span>
          <span className="text-[13px] opacity-75">{listing.propertyType}</span>
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
      {/* 2-column grid — matching legacy exactly */}
      <div className="grid grid-cols-2 gap-0.5">
        {data.map(listing => (
          <ExploreItem key={listing.id} listing={listing as Parameters<typeof ExploreItem>[0]['listing']} />
        ))}
      </div>
    </div>
  );
}
