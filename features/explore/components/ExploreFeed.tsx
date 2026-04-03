'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Loader2, BedIcon, BathIcon, MaximizeIcon, InfoIcon } from 'lucide-react';
import { useExploreListings } from '../hooks/useExploreListings';
import { motion } from 'framer-motion';

const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=400&auto=format&fit=crop';

function ExploreItem({ listing }: { listing: { id: number; title: string; price: string; area: string; governorate: string; propertyType: string; images: string[]; rooms?: number | string; bathrooms?: number | string; size?: number; description?: string; video?: string } }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState(listing.images[0] ?? FALLBACK);

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`explore-item-${listing.id}`}
      className="relative aspect-3/4 bg-muted dark:bg-slate-800 cursor-pointer perspective-1000 group block outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full transform-3d"
      >
        {/* ── Front Side (Video Preview Look) ── */}
        <div className="absolute inset-0 backface-hidden flex flex-col rounded-3xl overflow-hidden border border-border/50 shadow-xl shadow-black/5">
          {/* Thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgSrc(FALLBACK)}
          />

          {/* Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent opacity-100" />

          {/* Play icon with glass effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Meta info with hierarchy */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end text-white transform-[translateZ(50px)]" dir="rtl">
            <div className="flex justify-between items-end gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                 <span className="font-black text-xl md:text-2xl tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">{listing.price}</span>
                 <span className="text-sm font-bold opacity-90 truncate drop-shadow-md">{listing.area}، {listing.governorate}</span>
              </div>
              <div className="shrink-0 px-2.5 py-1.5 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-[11px] font-black uppercase tracking-wider drop-shadow-md">
                {listing.propertyType}
              </div>
            </div>
          </div>
        </div>

        {/* ── Back Side (Details Look) ── */}
        <div 
          className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] flex flex-col bg-linear-to-br from-primary/20 via-card to-secondary/10 rounded-3xl overflow-hidden border border-primary/30 shadow-2xl p-6"
          dir="rtl"
        >
          <div className="flex flex-col h-full gap-5">
            <div className="flex items-center justify-between border-b border-primary/10 pb-3">
              <h3 className="text-primary font-black text-xl">نظرة سريعة</h3>
              <InfoIcon className="w-6 h-6 text-primary/40" />
            </div>

            <div className="grid grid-cols-2 gap-3 transform-[translateZ(30px)]">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <BedIcon className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">غرف</span>
                  <span className="text-sm font-black">{listing.rooms || '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <BathIcon className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">حمامات</span>
                  <span className="text-sm font-black">{listing.bathrooms || '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <MaximizeIcon className="w-4 h-4 text-primary" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground">المساحة</span>
                  <span className="text-sm font-black">{listing.size ? `${listing.size}م²` : '—'}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 mt-2 transform-[translateZ(20px)]">
               <p className="text-xs md:text-sm text-foreground/80 leading-relaxed font-medium line-clamp-6 bg-white/5 p-4 rounded-2xl border border-white/5">
                 {listing.description || 'اكتشف المزيد من التفاصيل حول هذا العقار المميز. اضغط للمزيد...'}
               </p>
            </div>

            <div className="mt-auto pt-4 transform-[translateZ(40px)]">
              <button className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-black text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                تشغيل الفيديو
              </button>
            </div>
          </div>
        </div>
      </motion.div>
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
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground" dir="rtl">
        <Play className="w-16 h-16 mb-4 opacity-10" />
        <p className="text-lg font-bold">لا توجد فيديوهات حالياً</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-24" dir="rtl">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5 lg:gap-8">
        {data.map(listing => (
          <ExploreItem key={listing.id} listing={listing as Parameters<typeof ExploreItem>[0]['listing']} />
        ))}
      </div>
    </div>
  );
}
