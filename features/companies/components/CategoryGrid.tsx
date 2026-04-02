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
    <div className="flex flex-col gap-8 md:gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">تصنيفات الشركات</h1>
        <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">اكتشف أفضل المكاتب والشركات العقارية المتخصصة في الكويت، مصنفة حسب المجال لسهولة الوصول.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8 pb-10" dir="rtl">
        {CATEGORIES.map(({ id, name, Icon }) => (
          <Link
            key={id}
            href={`/companies?category=${id}`}
            id={`category-${id}`}
            className="group flex flex-col items-center gap-6 p-8 rounded-[40px] bg-card border border-border/60 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 hover:border-primary/40 transition-all duration-500"
          >
            <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-muted/50 to-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
              <Icon className="w-10 h-10 text-primary drop-shadow-md" />
            </div>
            <span className="text-xl font-black text-center leading-tight tracking-tight">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
