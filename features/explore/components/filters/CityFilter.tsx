'use client';

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { type UseFormReturn } from "react-hook-form";
import { type ExploreFilterValues } from "../../schemas/filter.schema";
import { useCities } from "@/shared/hooks/useLocation";

interface CityFilterProps {
  form: UseFormReturn<ExploreFilterValues>;
  stateId?: string | number;
}

export function CityFilter({ form, stateId }: CityFilterProps) {
  const { data: cities, isLoading: isLoadingCities } = useCities(stateId || undefined);

  if (!stateId) return null;

  return (
    <FormField
      control={form.control}
      name="city_id"
      render={({ field }) => (
        <FormItem className="space-y-4 pt-4 border-t border-border/60">
          <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">المنطقة</FormLabel>
          <FormControl>
            <div className="grid grid-cols-2 gap-2">
              {isLoadingCities ? (
                <div className="col-span-2 h-20 bg-muted animate-pulse rounded-2xl" />
              ) : (
                cities?.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => field.onChange(field.value == c.id ? '' : c.id)}
                    className={cn(
                      "px-4 py-3 text-[11px] font-bold border rounded-2xl transition-all active:scale-95 text-center leading-none",
                      field.value == c.id 
                        ? "border-primary bg-primary/5 text-primary" 
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    {c.name}
                  </button>
                ))
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
