'use client';

import Link from 'next/link';
import { Building2, Hammer, HardHat, Palette, Package } from 'lucide-react';

export const CATEGORIES = [
  { id: 'real-estate',  name: 'الشركات العقارية',  Icon: Building2 },
  { id: 'construction', name: 'الشركات الانشائية', Icon: Hammer },
  { id: 'contracting',  name: 'شركات المقاولات',   Icon: HardHat },
  { id: 'decor',        name: 'قسم الديكور',        Icon: Palette },
  { id: 'materials',    name: 'مواد البناء',        Icon: Package },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 pt-4 pb-28" dir="rtl">
      {CATEGORIES.map(({ id, name, Icon }) => (
        <Link
          key={id}
          href={`/companies?category=${id}`}
          id={`category-${id}`}
          className="group flex flex-col items-center gap-3 active:scale-95 transition-transform duration-200 focus-visible:outline-none"
        >
          <div className="w-24 h-24 rounded-full bg-card border border-border shadow-sm flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300">
            <Icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="text-base font-bold text-center leading-tight px-1 line-clamp-2">
            {name}
          </span>
        </Link>
      ))}
    </div>
  );
}
