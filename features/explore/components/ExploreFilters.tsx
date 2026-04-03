'use client';

import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ExploreFiltersProps {
  className?: string;
}

export function ExploreFilters({ className }: ExploreFiltersProps) {
  // Range state: [min, max]
  const [range, setRange] = useState([50, 2000]);

  const handleMinChange = (val: string) => {
    const v = parseInt(val) || 0;
    setRange([Math.min(v, range[1]), range[1]]);
  };

  const handleMaxChange = (val: string) => {
    const v = parseInt(val) || 0;
    setRange([range[0], Math.max(v, range[0])]);
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Property Type selection */}
      <div className="space-y-4">
        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">نوع العقار</label>
        <div className="grid grid-cols-2 gap-2">
          {['شقة', 'بيت', 'دور', 'عمارة', 'دوبلكس', 'أرض'].map(t => (
            <button key={t} className="px-4 py-3 text-sm font-bold border border-border rounded-2xl hover:border-primary hover:bg-primary/5 hover:text-primary transition-all active:scale-95 text-center">
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Governorate Selection */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">المحافظة</label>
        <div className="grid grid-cols-2 gap-2">
          {['العاصمة', 'حولي', 'الأحمدي', 'الجهراء', 'مبارك الكبير', 'الفروانية'].map(g => (
            <button key={g} className="px-4 py-3 text-[11px] font-bold border border-border rounded-2xl hover:border-primary hover:bg-primary/5 hover:text-primary transition-all active:scale-95 text-center leading-none">
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-6 pt-6 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">نطاق السعر (د.ك)</label>
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
             <span className="text-[11px] font-black text-primary" dir="ltr">{range[0].toLocaleString()} - {range[1].toLocaleString()}</span>
          </div>
        </div>

        <div className="px-2">
          <Slider
            defaultValue={[50, 2000]}
            value={range}
            min={0}
            max={10000}
            step={50}
            onValueChange={setRange}
            className="py-4"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] font-black text-muted-foreground pr-1">الحد الأدنى</span>
            <div className="relative">
              <input
                type="number"
                value={range[0]}
                onChange={(e) => handleMinChange(e.target.value)}
                className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center no-scrollbar"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <span className="text-[10px] font-black text-muted-foreground pr-1">الحد الأعلى</span>
            <div className="relative">
              <input
                type="number"
                value={range[1]}
                onChange={(e) => handleMaxChange(e.target.value)}
                className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center no-scrollbar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
