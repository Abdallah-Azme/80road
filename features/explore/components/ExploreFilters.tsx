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
import { cn } from "@/lib/utils";
import { useSearchParams } from 'next/navigation';
import { useFilterOptions } from '@/features/home/hooks/useFilterOptions';
import { PriceRangeFilter } from './filters/PriceRangeFilter';
import { GovernorateFilter } from './filters/GovernorateFilter';
import { CityFilter } from './filters/CityFilter';
import { useExploreListings } from '../hooks/useExploreListings';

interface ExploreFiltersProps {
  className?: string;
  onApply?: () => void;
}

export function ExploreFilters({ className, onApply }: ExploreFiltersProps) {
  const { form, onSubmit } = useExploreFilterForm();
  const { data: filterOptions, isLoading: isLoadingOptions } = useFilterOptions();
  const searchParams = useSearchParams();

  // Get current filters from URL to track "live" results metadata (min/max price)
  const filters = {
    state_id: searchParams.get('state_id') || undefined,
    city_id: searchParams.get('city_id') || undefined,
    category_values_ids: searchParams.getAll('category_values_ids'),
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
  };

  const { data: listingsData } = useExploreListings(filters);

  const selectedStateId = form.watch('state_id');

  const handleValueToggle = (valueId: number, categoryValues: { id: number }[], currentValues: (string | number)[]) => {
    const currentNumericValues = currentValues.map(v => Number(v));
    const categoryValueIds = categoryValues.map(v => v.id);
    const otherCategoryValues = currentNumericValues.filter(id => !categoryValueIds.includes(id));

    if (currentNumericValues.includes(valueId)) {
      form.setValue('category_values_ids', otherCategoryValues.map(String));
    } else {
      form.setValue('category_values_ids', [...otherCategoryValues, valueId].map(String));
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values as unknown as ExploreFilterValues);
          onApply?.();
        })} 
        className={cn("flex flex-col gap-8", className)}
      >
        {/* Dynamic Categories From API */}
        {isLoadingOptions ? (
          <div className="space-y-8">
            <div className="h-24 bg-muted animate-pulse rounded-2xl" />
            <div className="h-24 bg-muted animate-pulse rounded-2xl" />
          </div>
        ) : (
          filterOptions?.map((category, index) => (
            <FormField
              key={category.id}
              control={form.control}
              name="category_values_ids"
              render={({ field }) => (
                <FormItem className={cn("space-y-4", index > 0 && "pt-4 border-t border-border/60")}>
                  <FormLabel className="text-xs font-black text-muted-foreground uppercase tracking-widest px-1">
                    {category.name}
                  </FormLabel>
                  <FormControl>
                    <div className={cn(
                      "grid gap-2",
                      category.values.length <= 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3"
                    )}>
                      {category.values.map(v => {
                        const isSelected = field.value.map(val => Number(val)).includes(v.id);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleValueToggle(v.id, category.values, field.value)}
                            className={cn(
                              "px-4 py-3 text-sm font-bold border rounded-2xl transition-all active:scale-95 text-center",
                              isSelected
                                ? "border-primary bg-primary/5 text-primary" 
                                : "border-border hover:border-primary/40 hover:bg-muted/30"
                            )}
                          >
                            {v.value}
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          ))
        )}

        {/* Location Filters */}
        <GovernorateFilter form={form} />
        <CityFilter form={form} stateId={selectedStateId} />
        
        {/* Price Range Filter with Dynamic Bounds */}
        <PriceRangeFilter 
            form={form} 
            minPriceBound={listingsData?.min_price} 
            maxPriceBound={listingsData?.max_price} 
        />

        {/* Hidden Submit Button */}
        <button 
          type="submit"
          className="hidden"
          id="explore-filter-submit"
        />
      </form>
    </Form>
  );
}
