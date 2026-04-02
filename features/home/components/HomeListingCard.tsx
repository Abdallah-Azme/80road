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
      className="group flex flex-col bg-card rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-border overflow-hidden active:scale-95 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring outline-none"
    >
      {/* Image */}
      <div className="relative aspect-square bg-muted">
        <Image
          src={imgSrc}
          alt={listing.title}
          fill
          className="object-cover"
          onError={() => {}}
          sizes="(max-width: 440px) 50vw, 200px"
        />
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1" dir="rtl">
        <span className="text-blue font-bold text-sm md:text-base">{listing.price}</span>
        <h3 className="text-foreground font-semibold text-xs md:text-sm truncate">{listing.title}</h3>
        <div className="flex items-center gap-1 opacity-60">
          <span className="text-[11px] text-muted-foreground font-medium">{listing.area}</span>
          <div className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span className="text-[11px] text-muted-foreground font-medium">{listing.governorate}</span>
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
