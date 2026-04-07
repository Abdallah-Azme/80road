'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Loader2, BedIcon, BathIcon, MaximizeIcon, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Listing } from '@/lib/types';
import { useExploreListings } from '../hooks/useExploreListings';
import { mapRawExploreToListing } from '../services/explore.service';
import { ExploreFilters } from '../types';
import { useToggleLike } from '@/shared/hooks/useListing';
import { cn } from '@/lib/utils';

const FALLBACK = 'https://placehold.co/600x400/e2e8f0/64748b?text=80road';

function ExploreItem({ listing }: { listing: Listing }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(listing.images[0] ?? FALLBACK);
  const toggleLike = useToggleLike();

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike.mutate(listing.id);
  };

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`explore-item-${listing.id}`}
      className="relative aspect-2/3 bg-muted dark:bg-slate-800 cursor-pointer rounded-3xl overflow-hidden group block outline-none border border-border/50 shadow-xl shadow-black/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Main Media Content ── */}
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={() => setImgSrc(FALLBACK)}
        />
        {/* Persistent Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-40" />
      </div>

      {/* ── Top Actions ── */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleToggleLike}
          disabled={toggleLike.isPending}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-90",
            listing.isLiked 
              ? "bg-white border-red-500 text-red-500 shadow-lg shadow-red-500/20" 
              : "bg-black/20 border-white/20 text-white hover:bg-black/40"
          )}
        >
          <Heart 
            className={cn("w-5 h-5 transition-colors", listing.isLiked && "fill-current")} 
          />
        </button>
      </div>

      {/* ── Play Icon Center ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          animate={{ scale: isHovered ? 1.2 : 1, opacity: isHovered ? 0 : 1 }}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl"
        >
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </motion.div>
      </div>

      {/* ── Basic Info (Visible by Default) ── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end text-white" dir="rtl">
        <motion.div 
            animate={{ y: isHovered ? -140 : 0, opacity: isHovered ? 0 : 1 }}
            className="flex justify-between items-end gap-3"
        >
          <div className="flex flex-col gap-1 min-w-0">
             <span className="font-black text-xl md:text-2xl tracking-tighter drop-shadow-md">{listing.price}</span>
             <span className="text-sm font-bold opacity-90 truncate drop-shadow-sm">{listing.area}، {listing.governorate}</span>
          </div>
          <div className="shrink-0 px-2.5 py-1.5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-[11px] font-black uppercase tracking-wider">
            {listing.propertyType}
          </div>
        </motion.div>
      </div>

      {/* ── Progressive Reveal Details (On Hover) ── */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-1/4 bg-linear-to-t from-black/95 via-black/80 to-transparent p-6 flex flex-col justify-end gap-4"
            dir="rtl"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
                <BedIcon className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-white">{listing.rooms || '—'}</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
                <BathIcon className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-white">{listing.bathrooms || '—'}</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 border border-white/10">
                <MaximizeIcon className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black text-white">{listing.size ? `${listing.size}م²` : '—'}</span>
              </div>
            </div>

            {/* Description Fragment */}
            <p className="text-xs text-white/80 leading-relaxed font-medium line-clamp-3">
              {listing.description || 'اكتشف المزيد من التفاصيل حول هذا العقار المميز. اضغط للمزيد...'}
            </p>

            {/* Primary Action Button */}
            <div className="w-full py-3.5 px-6 bg-primary text-primary-foreground text-center rounded-2xl font-black text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all">
              عرض التفاصيل والاتصال
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}

export function ExploreFeed() {
  const searchParams = useSearchParams();
  
  const filters: ExploreFilters = {
    state_id: searchParams.get('state_id') || undefined,
    city_id: searchParams.get('city_id') || undefined,
    category_values_ids: searchParams.getAll('category_values_ids'),
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const { data, isPending, isError, isFetching } = useExploreListings(filters);

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-destructive text-sm" dir="rtl">
        تعذّر تحميل المحتوى
      </div>
    );
  }

  if (isPending && !data) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const ads = data?.data || [];

  if (ads.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground" dir="rtl">
        <Play className="w-16 h-16 mb-4 opacity-10" />
        <p className="text-lg font-bold">لا توجد إعلانات حالياً</p>
      </div>
    );
  }

  const listings = ads.map(mapRawExploreToListing);

  return (
    <div className="relative w-full pb-24" dir="rtl">
      <AnimatePresence>
        {isFetching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-background/20 backdrop-blur-[2px] rounded-3xl flex items-center justify-center border border-white/10"
          >
            <div className="bg-card/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-primary/20 flex flex-col items-center gap-4 scale-90 md:scale-100">
               <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="w-12 h-12 text-primary animate-spin relative" />
               </div>
               <span className="text-sm font-black text-primary tracking-widest uppercase">جاري تحديث النتائج...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 transition-all duration-300",
        isFetching && "blur-[1px] opacity-60 scale-[0.99] grayscale-20"
      )}>
        {listings.map(listing => (
          <ExploreItem key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
