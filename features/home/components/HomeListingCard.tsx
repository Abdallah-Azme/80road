'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Listing } from '@/lib/types';

const FALLBACK = 'https://raiyansoft.com/wp-content/uploads/2026/01/1.png';

interface Props {
  listing: Listing;
}

export function HomeListingCard({ listing }: Props) {
  const imgSrc =
    typeof listing.imageUrl === 'string'
      ? listing.imageUrl
      : listing.images[0] ?? FALLBACK;

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`listing-card-${listing.id}`}
      className="group flex flex-col bg-card rounded-2xl shadow-lg shadow-black/5 border border-border/60 overflow-hidden active:scale-95 transition-all duration-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring outline-none hover:shadow-xl hover:shadow-black/10 hover:border-primary/20"
    >
      {/* Image Container with Hover Zoom */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Image
          src={imgSrc}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => {}}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Body with better Typography */}
      <div className="p-4 flex flex-col gap-1.5" dir="rtl">
        <span className="text-primary font-black text-base md:text-lg tracking-tight">{listing.price}</span>
        <h3 className="text-foreground font-semibold text-sm md:text-[15px] leading-tight truncate group-hover:text-primary transition-colors">{listing.title}</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[12px] text-muted-foreground font-medium">{listing.area}</span>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="text-[12px] text-muted-foreground font-medium">{listing.governorate}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Skeleton ─────────────────────────────────────────────────
export function HomeListingCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-border overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-2.5 bg-muted rounded w-3/4" />
        <div className="h-2 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}
