'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { exploreFilterSchema, type ExploreFilterValues } from '../schemas/filter.schema';
import { useUIStore } from '@/stores/ui.store';
import { useUserStore } from '@/stores/user.store';

export function useExploreFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preferences = useUIStore(s => s.preferences);
  const user = useUserStore(s => s.user);

  // Initial values merged from URL params and fallback to user preferences (local storage)
  const form = useForm<ExploreFilterValues>({
    resolver: zodResolver(exploreFilterSchema) as Resolver<ExploreFilterValues>,
    defaultValues: {
      category_values_ids: searchParams.getAll('category_values_ids') || preferences?.categoryValues?.map(String) || [],
      country_id: searchParams.get('country_id') || String(user?.country_id || preferences?.countryId || '1'), // Default to user country, then pref, then Kuwait
      state_id: searchParams.get('state_id') || String(preferences?.stateId || ''),
      city_id: searchParams.get('city_id') || String(preferences?.cityId || ''),
      priceRange: [
        Number(searchParams.get('min_price')) || 0,
        Number(searchParams.get('max_price')) || 50000 // Placeholder max
      ],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = form.watch();
  const currentCountryId = form.watch('country_id');
  const currentStateId = form.watch('state_id');

  // Reset state and city when country changes
  useEffect(() => {
    if (currentCountryId) {
      const urlCountryId = searchParams.get('country_id');
      // Only reset if the country strictly changed from what's in the URL or if it's a fresh change
      if (urlCountryId && String(currentCountryId) !== urlCountryId) {
        form.setValue('state_id', '');
        form.setValue('city_id', '');
      }
    }
  }, [currentCountryId, form, searchParams]);

  // Reset city when state changes
  useEffect(() => {
    if (currentStateId) {
      const urlStateId = searchParams.get('state_id');
      if (urlStateId && String(currentStateId) !== urlStateId) {
        form.setValue('city_id', '');
      }
    }
  }, [currentStateId, form, searchParams]);

  // Debounce the entire value object, especially price, to avoid too many URL pushes
  const [debouncedValues] = useDebounce(values, 500);

  // Sync Form Values with URL Search Params
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedValues.category_values_ids?.length > 0) {
      debouncedValues.category_values_ids.forEach(id => params.append('category_values_ids', String(id)));
    }
    
    if (debouncedValues.country_id) params.set('country_id', String(debouncedValues.country_id));
    if (debouncedValues.state_id) params.set('state_id', String(debouncedValues.state_id));
    if (debouncedValues.city_id) params.set('city_id', String(debouncedValues.city_id));

    params.set('min_price', String(debouncedValues.priceRange[0]));
    params.set('max_price', String(debouncedValues.priceRange[1]));

    const search = params.toString();
    const currentSearch = searchParams.toString();

    // Only push if something actually changed to avoid infinite cycles
    if (search !== currentSearch) {
      router.push(`/explore?${search}`, { scroll: false });
    }
  }, [debouncedValues, router, searchParams]);

  // Handle manual submit (just in case)
  const onSubmit = (values: ExploreFilterValues) => {
    // Usually auto-handled by useEffect, but we can call it manually
    console.log('Filters Applied:', values);
  };

  return {
    form,
    onSubmit,
  };
}
