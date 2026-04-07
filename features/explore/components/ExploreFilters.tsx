'use client';

import { useExploreFilterForm } from '../hooks/useExploreFilterForm';
import { type ExploreFilterValues } from '../schemas/filter.schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import { useFilterOptions } from '@/features/home/hooks/useFilterOptions';
import { useExploreStates } from '../hooks/useExploreLocations';

interface ExploreFiltersProps {
  className?: string;
  onApply?: () => void;
}

export function ExploreFilters({ className, onApply }: ExploreFiltersProps) {
  const { form, onSubmit } = useExploreFilterForm();
  const { data: filterOptions, isLoading: isLoadingOptions } = useFilterOptions();
  const { data: states, isLoading: isLoadingStates } = useExploreStates();

  // Price range helpers
  const currentRange = form.watch('priceRange');

  const handleMinChange = (val: string) => {
    const v = parseInt(val) || 0;
    form.setValue('priceRange', [Math.min(v, currentRange[1]), currentRange[1]]);
  };

  const handleMaxChange = (val: string) => {
    const v = parseInt(val) || 0;
    form.setValue('priceRange', [currentRange[0], Math.max(v, currentRange[0])]);
  };

  // Find categories
  const propertyTypeCategory = filterOptions?.find(c => c.name === 'نوع العقار');
  const listingTypeCategory = filterOptions?.find(c => c.name === 'نوع الإعلان');
  
  const propertyTypes = propertyTypeCategory?.values || [];
  const listingTypes = listingTypeCategory?.values || [];

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values as unknown as ExploreFilterValues);
          onApply?.();
        })} 
        className={cn("flex flex-col gap-8", className)}
      >
        {/* Listing Type selection (Sale/Rent) */}
        <FormField<ExploreFilterValues>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name="category_value_id" // Using same field for now if it only takes one ID at a time, or we can use separate if API supports
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">نوع الإعلان</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {isLoadingOptions ? (
                    <div className="flex-1 h-12 bg-muted animate-pulse rounded-2xl" />
                  ) : (
                    listingTypes.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => field.onChange(field.value == t.id ? '' : t.id)}
                        className={cn(
                          "flex-1 px-4 py-3 text-sm font-bold border rounded-2xl transition-all active:scale-95 text-center",
                          field.value == t.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border hover:border-primary/40 hover:bg-muted/30"
                        )}
                      >
                        {t.value}
                      </button>
                    ))
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Property Type selection */}
        <FormField<ExploreFilterValues>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name="category_value_id"
          render={({ field }) => (
            <FormItem className="space-y-4 pt-4 border-t border-border/60">
              <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">نوع العقار</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {isLoadingOptions ? (
                    <div className="col-span-2 h-20 bg-muted animate-pulse rounded-2xl" />
                  ) : (
                    propertyTypes.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => field.onChange(field.value == t.id ? '' : t.id)}
                        className={cn(
                          "px-4 py-3 text-sm font-bold border rounded-2xl transition-all active:scale-95 text-center",
                          field.value == t.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border hover:border-primary/40 hover:bg-muted/30"
                        )}
                      >
                        {t.value}
                      </button>
                    ))
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Governorate Selection */}
        <FormField<ExploreFilterValues>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name="state_id"
          render={({ field }) => (
            <FormItem className="space-y-4 pt-4 border-t border-border/60">
              <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">المحافظة</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-2">
                  {isLoadingStates ? (
                    <div className="col-span-2 h-20 bg-muted animate-pulse rounded-2xl" />
                  ) : (
                    states?.map(g => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => field.onChange(field.value == g.id ? '' : g.id)}
                        className={cn(
                          "px-4 py-3 text-[11px] font-bold border rounded-2xl transition-all active:scale-95 text-center leading-none",
                          field.value == g.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border hover:border-primary/40 hover:bg-muted/30"
                        )}
                      >
                        {g.name}
                      </button>
                    ))
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Price Range Section */}
        <FormField<ExploreFilterValues>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          control={form.control as any}
          name="priceRange"
          render={({ field }) => {
            const val = field.value as number[];
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
                      min={0}
                      max={10000}
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
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="text-[10px] font-black text-muted-foreground pr-1">الحد الأعلى</span>
                    <input
                      type="number"
                      value={val[1]}
                      onChange={(e) => handleMaxChange(e.target.value)}
                      className="w-full bg-muted/40 border border-border rounded-2xl p-4 text-sm font-black outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center no-scrollbar"
                    />
                  </div>
                </div>
              </FormItem>
            );
          }}
        />

        {/* The Action Button (can be externalized but provided here for completeness if needed inside drawer) */}
        <button 
          type="submit"
          className="hidden" // Hidden by default, triggered via form.handleSubmit if needed externally
          id="explore-filter-submit"
        />
      </form>
    </Form>
  );
}
