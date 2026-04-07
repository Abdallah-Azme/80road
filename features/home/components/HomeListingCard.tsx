'use client';

import { CustomImage as Image } from '@/shared/components/custom-image';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BedIcon, BathIcon, MaximizeIcon, MapPinIcon, Heart } from 'lucide-react';
import { useState } from 'react';
import { useToggleLike } from '@/shared/hooks/useListing';
import { cn } from '@/lib/utils';

const FALLBACK = 'https://raiyansoft.com/wp-content/uploads/2026/01/1.png';

interface Props {
  listing: Listing;
}

export function HomeListingCard({ listing }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const toggleLike = useToggleLike();

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike.mutate(listing.id);
  };

  const imgSrc =
    typeof listing.imageUrl === 'string'
      ? listing.imageUrl
      : listing.images[0] ?? FALLBACK;

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`listing-card-${listing.id}`}
      className="group relative h-[320px] md:h-[420px] w-full rounded-[32px] overflow-hidden bg-card border border-border/50 shadow-xl shadow-black/5 outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Background Media ────────────────────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src={imgSrc}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Persistent Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-40" />
      </div>

      {/* ── Favorite (Heart) Action ────────────────────────────── */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleToggleLike}
          disabled={toggleLike.isPending}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90 shadow-xl",
            listing.isLiked 
              ? "bg-white border-red-500 text-red-500 shadow-red-500/20" 
              : "bg-black/20 border-white/20 text-white hover:bg-black/40"
          )}
        >
          <Heart 
            className={cn("w-5 h-5 transition-colors", listing.isLiked && "fill-current")} 
          />
        </button>
      </div>

      {/* ── Basic Info (Static at Bottom) ───────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2 text-white" dir="rtl">
        <motion.div 
            animate={{ y: isHovered ? -140 : 0, opacity: isHovered ? 0 : 1 }}
            className="flex flex-col gap-1"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 w-fit px-3 py-1 rounded-xl mb-1">
             <span className="font-black text-lg md:text-xl text-white">{listing.price}</span>
          </div>
          <h3 className="text-white font-bold truncate text-base md:text-lg drop-shadow-md">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1.5 text-white/80">
            <MapPinIcon className="w-3.5 h-3.5" />
            <small className="truncate font-medium">{listing.area}، {listing.governorate}</small>
          </div>
        </motion.div>
      </div>

      {/* ── Slide-up Detail Overlay ───────────────────────────── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-1/3 bg-linear-to-t from-black/95 via-black/80 to-transparent p-6 flex flex-col justify-end gap-5"
            dir="rtl"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10">
                <BedIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-black text-white">{listing.rooms || '—'}</span>
                <span className="text-[9px] font-bold text-white/40 uppercase">غرف</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10">
                <BathIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-black text-white">{listing.bathrooms || '—'}</span>
                <span className="text-[9px] font-bold text-white/40 uppercase">حمامات</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/10">
                <MaximizeIcon className="w-4 h-4 text-primary" />
                <span className="text-xs font-black text-white">{listing.size ? `${listing.size}م²` : '—'}</span>
                <span className="text-[9px] font-bold text-white/40 uppercase">مساحة</span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-medium line-clamp-3">
              {listing.description || 'اكتشف المزيد من التفاصيل والخدمات المتوفرة لهذا العقار المميز.'}
            </p>

            <div className="w-full py-4 px-6 bg-primary text-primary-foreground text-center rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all">
              عرض التفاصيل الكاملة
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}

// Skeleton remains mostly same but rounded
export function HomeListingCardSkeleton() {
  return (
    <div className="h-[320px] md:h-[420px] flex flex-col rounded-[32px] border border-border overflow-hidden animate-pulse">
      <div className="flex-1 bg-muted" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-full mt-2" />
      </div>
    </div>
  );
}
