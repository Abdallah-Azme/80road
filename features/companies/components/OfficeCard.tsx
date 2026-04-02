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
      className="group flex flex-col bg-card rounded-[40px] border border-border/60 shadow-2xl shadow-primary/5 overflow-hidden active:scale-[.97] transition-all duration-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring outline-none hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30"
    >
      {/* Header area */}
      <div className="relative h-32 bg-linear-to-br from-muted to-muted/30 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative w-20 h-20 rounded-full border-4 border-card shadow-2xl overflow-hidden z-10 transform transition-transform duration-700 group-hover:scale-110">
          <Image src={office.logo} alt={office.officeName} fill className="object-cover" />
        </div>

        {office.verified && (
          <div className="absolute top-4 left-4 text-blue-500 drop-shadow-md z-20">
            <BadgeCheck className="w-7 h-7 fill-blue-500/10" />
          </div>
        )}

        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-border/40 z-20">
          <span className="text-sm font-black leading-none">{office.rating}</span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col items-center text-center flex-1 gap-2" dir="rtl">
        <div className="min-h-[3.5rem] flex items-center justify-center w-full">
          <h3 className="text-lg font-black leading-tight tracking-tight line-clamp-2 transition-colors group-hover:text-primary">{office.officeName}</h3>
        </div>
        <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">{office.governorate}</span>

        <div className="w-full mt-4 pt-4 flex flex-col gap-3 border-t border-border/40">
          <div className="flex justify-between items-center bg-muted/30 rounded-2xl px-4 py-3 border border-border/40">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">إعلانات نشطة</span>
            <span className="text-lg font-black text-primary">{office.activeListingsCount}</span>
          </div>
          <div className="w-full h-12 rounded-[20px] bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 flex items-center justify-center text-sm font-black tracking-tight shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
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
