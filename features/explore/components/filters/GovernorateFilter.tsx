'use client';

import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { type UseFormReturn } from "react-hook-form";
import { type ExploreFilterValues } from "../../schemas/filter.schema";
import { useExploreStates } from "../../hooks/useExploreLocations";

interface GovernorateFilterProps {
  form: UseFormReturn<ExploreFilterValues>;
  countryId?: number | string;
}

export function GovernorateFilter({ form, countryId }: GovernorateFilterProps) {
  const { data: states, isLoading: isLoadingStates } = useExploreStates(Number(countryId) || 1);

  return (
    <FormField
      control={form.control}
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
  );
}
