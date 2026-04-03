'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exploreFilterSchema, type ExploreFilterValues } from '../schemas/filter.schema';

export function useExploreFilterForm(defaultValues?: Partial<ExploreFilterValues>) {
  const form = useForm<ExploreFilterValues>({
    resolver: zodResolver(exploreFilterSchema),
    defaultValues: {
      propertyType: '',
      governorate: '',
      priceRange: [50, 2000],
      ...defaultValues,
    },
  });

  const onSubmit = (values: ExploreFilterValues) => {
    console.log('Applying Filters:', values);
    // You can add navigation or state updates here
  };

  return {
    form,
    onSubmit,
    // Add additional helpers as needed
  };
}
