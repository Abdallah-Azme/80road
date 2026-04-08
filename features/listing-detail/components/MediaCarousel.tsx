'use client';

import { useState, useRef, useCallback } from 'react';
import { CustomImage as Image } from '@/shared/components/custom-image';
import { Play, Heart, Loader2 } from 'lucide-react';
import { Listing } from '@/lib/types';
import { useToggleLike } from '@/shared/hooks/useListing';
import { cn } from '@/lib/utils';
import { useListingDetail } from '../hooks/useListingDetail';

const FALLBACK = 'https://raiyansoft.com/wp-content/uploads/2026/01/1.png';

interface Props { listing: Listing }

export function MediaCarousel({ listing: initialListing }: Props) {
  // Use reactive hook to stay in sync with query cache (optimistic updates)
  const { data: listing = initialListing } = useListingDetail(initialListing.id, initialListing);
  
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toggleLike = useToggleLike();

  const mediaItems = [
    ...(listing.images || []).map((src, i) => ({ type: 'image' as const, src, id: `img-${i}` })),
    ...(listing.video ? [{ type: 'video' as const, src: listing.video, id: 'vid' }] : []),
  ];

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    if (width === 0) return;
    const idx = Math.round(Math.abs(e.currentTarget.scrollLeft) / width);
    setActiveIdx(idx);
  }, []);

  const scrollTo = (idx: number) => {
    setActiveIdx(idx);
    const child = scrollRef.current?.children[idx] as HTMLElement;
    child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike.mutate(listing.id);
  };

  return (
    <div className="flex flex-col relative group/carousel">
      {/* ── Favorite (Heart) Action ── */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleToggleLike}
          disabled={toggleLike.isPending}
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all active:scale-90 shadow-2xl",
            listing.isLiked 
              ? "bg-white border-red-500 text-red-500 shadow-red-500/20" 
              : "bg-black/40 border-white/20 text-white hover:bg-black/60"
          )}
        >
          {toggleLike.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart 
              className={cn("w-6 h-6 transition-all", listing.isLiked && "fill-current scale-110")} 
            />
          )}
        </button>
      </div>

      {/* Main Carousel */}
      <div className="relative w-full pt-[100%] bg-muted overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {mediaItems.length > 0 ? mediaItems.map((item, idx) => (
            <div key={item.id} className="relative w-full h-full shrink-0 snap-center bg-black flex items-center justify-center">
              {item.type === 'video' ? (
                <video src={item.src} controls playsInline className="w-full h-full object-contain" poster={FALLBACK} />
              ) : (
                <Image src={item.src} alt={`صورة ${idx + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
              )}
            </div>
          )) : (
            <div className="relative w-full h-full shrink-0 snap-center bg-muted flex items-center justify-center">
              <Image src={FALLBACK} alt="No images" fill className="object-cover opacity-50" />
            </div>
          )}
        </div>

        {/* Gradient Overlay for bottom controls visibility */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Counter badge */}
        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white text-xs font-black px-3.5 py-1.5 rounded-xl border border-white/10 z-10 pointer-events-none tracking-widest">
          {activeIdx + 1} / {Math.max(mediaItems.length, 1)}
        </div>
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="flex gap-3 p-4 overflow-x-auto no-scrollbar border-b border-border bg-card/50 backdrop-blur-sm">
          {mediaItems.map((item, idx) => (
            <button
              key={`thumb-${item.id}`}
              id={`thumb-${idx}`}
              onClick={() => scrollTo(idx)}
              aria-label={`الذهاب إلى ${item.type === 'video' ? 'الفيديو' : 'الصورة'} رقم ${idx + 1}`}
              className={cn(
                "relative shrink-0 w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all active:scale-95",
                activeIdx === idx 
                    ? "border-primary ring-2 ring-primary/20 scale-105" 
                    : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {item.type === 'video' ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary fill-primary" />
                   </div>
                </div>
              ) : (
                <Image src={item.src} alt={`مصغّر ${idx + 1}`} fill className="object-cover" sizes="64px" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
