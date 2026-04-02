'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, BadgeCheck } from 'lucide-react';
import { Office } from '@/lib/types';

interface Props { office: Office }

export function OfficeCard({ office }: Props) {
  return (
    <Link
      href={`/profile/${office.id}`}
      id={`office-card-${office.id}`}
      className="group flex flex-col bg-card rounded-3xl border border-border shadow-sm overflow-hidden active:scale-[.98] transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring outline-none"
    >
      {/* Header area */}
      <div className="relative h-28 bg-muted flex items-center justify-center p-4">
        <div className="relative w-[68px] h-[68px] rounded-full border-4 border-card shadow-md overflow-hidden z-10">
          <Image src={office.logo} alt={office.officeName} fill className="object-cover" />
        </div>

        {office.verified && (
          <div className="absolute top-3 left-3 text-primary drop-shadow-sm">
            <BadgeCheck className="w-6 h-6" />
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-card/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-sm border border-border">
          <span className="text-sm font-bold leading-none mt-0.5">{office.rating}</span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col items-center text-center flex-1 gap-1" dir="rtl">
        <div className="min-h-[3rem] flex items-center justify-center w-full">
          <h3 className="text-base font-bold leading-snug line-clamp-2">{office.officeName}</h3>
        </div>
        <span className="text-xs text-muted-foreground truncate max-w-full">{office.governorate}</span>

        <div className="w-full mt-auto pt-3 flex flex-col gap-2">
          <div className="flex justify-between items-center bg-muted rounded-xl px-3 py-2 border border-border/50">
            <span className="text-xs text-muted-foreground">إعلانات نشطة</span>
            <span className="text-base font-bold text-primary">{office.activeListingsCount}</span>
          </div>
          <div className="w-full h-10 rounded-xl bg-primary/5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center text-sm font-semibold">
            عرض الملف
          </div>
        </div>
      </div>
    </Link>
  );
}

export function OfficeCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-border overflow-hidden animate-pulse">
      <div className="h-28 bg-muted" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
        <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
        <div className="h-10 bg-muted rounded-xl" />
        <div className="h-10 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
