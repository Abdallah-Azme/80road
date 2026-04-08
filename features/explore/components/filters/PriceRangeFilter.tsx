'use client';

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { type UseFormReturn } from "react-hook-form";
import { type ExploreFilterValues } from "../../schemas/filter.schema";
import { useEffect } from 'react';

interface PriceRangeFilterProps {
  form: UseFormReturn<ExploreFilterValues>;
  minPriceBound?: number;
  maxPriceBound?: number;
}

export function PriceRangeFilter({ form, minPriceBound = 0, maxPriceBound = 100000 }: PriceRangeFilterProps) {
  const currentRange = form.watch('priceRange');

  // React to dynamic bounds changes - if current max is less than new min bound, nudge it up
  useEffect(() => {
    if (minPriceBound > currentRange[0]) {
      form.setValue('priceRange', [minPriceBound, Math.max(currentRange[1], minPriceBound)]);
    }
  }, [minPriceBound, currentRange, form]);

  const handleMinChange = (val: string) => {
    const v = parseInt(val) || 0;
    form.setValue('priceRange', [Math.min(v, currentRange[1]), currentRange[1]]);
  };

  const handleMaxChange = (val: string) => {
    const v = parseInt(val) || 0;
    form.setValue('priceRange', [currentRange[0], Math.max(v, currentRange[0])]);
  };

  return (
    <FormField
      control={form.control}
      name="priceRange"
      render={({ field }) => {
        const val = field.value as number[];
        
        // Ensure slider values are within bounds
        const safeVal = [
            Math.max(val[0], minPriceBound),
            Math.min(val[1], maxPriceBound)
        ];

        return (
          <FormItem className="space-y-6 pt-6 border-t border-border/60">
            <div className="flex items-center justify-between">
              <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">نطاق السعر (د.ك)</FormLabel>
              <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                <span className="text-[11px] font-black text-primary" dir="ltr">
                  {val[0].toLocaleString()} - {val[1].toLocaleString()}
                </span>
              </div>
            </div>

            <FormControl>
              <div className="px-2">
                <Slider
                  value={val}
                  // Allow manual override beyond strict bounds if needed but limit by prop defaults
                  min={Math.min(minPriceBound, 0)}
                  max={Math.max(maxPriceBound, 100000)}
                  step={50}
                  onValueChange={field.onChange}
                  className="py-4"
                />
              </div>
            </FormControl>

            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] font-black text-muted-foreground pr-1">الحد الأدنى</span>
                <input
                  type="number"
                  value={val[0]}
                  onChange={(e) => handleMinChange(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center no-scrollbar"
                />
                <span className="text-[9px] font-bold text-muted-foreground opacity-60 px-1">السعر الأدنى الحالي: {minPriceBound.toLocaleString()}</span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] font-black text-muted-foreground pr-1">الحد الأعلى</span>
                <input
                  type="number"
                  value={val[1]}
                  onChange={(e) => handleMaxChange(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center no-scrollbar"
                />
                <span className="text-[9px] font-bold text-muted-foreground opacity-60 px-1">السعر الأعلى الحالي: {maxPriceBound.toLocaleString()}</span>
              </div>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
