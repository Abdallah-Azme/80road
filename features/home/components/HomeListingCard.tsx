'use client';

import { CustomImage as Image } from '@/shared/components/custom-image';
import Link from 'next/link';
import { Listing } from '@/lib/types';
import { motion } from 'framer-motion';
import { BedIcon, BathIcon, MaximizeIcon, MapPinIcon, InfoIcon } from 'lucide-react';
import { useState } from 'react';

const FALLBACK = 'https://raiyansoft.com/wp-content/uploads/2026/01/1.png';

interface Props {
  listing: Listing;
}

export function HomeListingCard({ listing }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const imgSrc =
    typeof listing.imageUrl === 'string'
      ? listing.imageUrl
      : listing.images[0] ?? FALLBACK;

  return (
    <Link
      href={`/ad/${listing.id}`}
      id={`listing-card-${listing.id}`}
      className="group relative h-[320px] md:h-[420px] w-full perspective-1000 outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full h-full transform-3d"
      >
        {/* ── Front Side ────────────────────────────────────────── */}
        <div className="absolute inset-0 backface-hidden flex flex-col bg-card rounded-[32px] overflow-hidden border border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/3">
          {/* Image Section */}
          <div className="relative flex-1 overflow-hidden">
            <Image
              src={imgSrc}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Price Badge Overlay */}
            <div className="absolute bottom-4 right-4 z-10" dir="rtl">
              <div className="bg-white/90 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-xl">
                 <span className="text-primary font-black text-lg md:text-xl">{listing.price}</span>
              </div>
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
          </div>

          {/* Info Section */}
          <div className="p-5 flex flex-col gap-2 transform-[translateZ(40px)]" dir="rtl">
            <h3 className="text-foreground group-hover:text-primary transition-colors font-bold">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="w-3.5 h-3.5" />
              <small className="truncate font-medium">{listing.area}، {listing.governorate}</small>
            </div>
          </div>
        </div>

        {/* ── Back Side ─────────────────────────────────────────── */}
        <div 
          className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] flex flex-col bg-linear-to-br from-primary/10 via-card to-secondary/5 rounded-[32px] overflow-hidden border border-primary/20 shadow-2xl p-6"
          dir="rtl"
        >
          <div className="flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
              <span className="text-primary font-black text-xl">تفاصيل العقار</span>
              <InfoIcon className="w-6 h-6 text-primary/40" />
            </div>

            <div className="grid grid-cols-2 gap-4 transform-[translateZ(30px)]">
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BedIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">غرف</span>
                </div>
                <span className="text-lg font-black text-foreground">{listing.rooms || '—'}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BathIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">حمامات</span>
                </div>
                <span className="text-lg font-black text-foreground">{listing.bathrooms || '—'}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MaximizeIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">المساحة</span>
                </div>
                <span className="text-lg font-black text-foreground">{listing.size ? `${listing.size} م²` : '—'}</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MaximizeIcon className="w-4 h-4" />
                  <span className="text-xs font-bold">النوع</span>
                </div>
                <span className="text-sm font-black text-foreground truncate">{listing.propertyType}</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden transform-[translateZ(20px)]">
               <p className="text-sm text-muted-foreground leading-relaxed font-medium line-clamp-4">
                 {listing.description || 'لا يوجد وصف متاح لهذا العقار حالياً. يمكنك التواصل مع المعلن لمزيد من التفاصيل.'}
               </p>
            </div>

            <div className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-black text-center text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:bg-primary/95 transition-all transform-[translateZ(50px)]">
              عرض تفاصيل الإعلان
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Skeleton ─────────────────────────────────────────────────
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
