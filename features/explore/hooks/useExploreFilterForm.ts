'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exploreFilterSchema, type ExploreFilterValues } from '../schemas/filter.schema';

export function useExploreFilterForm(defaultValues?: Partial<ExploreFilterValues>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<ExploreFilterValues>({
    resolver: zodResolver(exploreFilterSchema) as Resolver<ExploreFilterValues>,
    defaultValues: {
      category_value_id: searchParams.get('category_value_id') || '',
      state_id: searchParams.get('state_id') || '',
      priceRange: [
        Number(searchParams.get('min_price')) || 50,
        Number(searchParams.get('max_price')) || 2000
      ],
      ...defaultValues,
    },
  });

  const onSubmit = (values: ExploreFilterValues) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (values.category_value_id) params.set('category_value_id', values.category_value_id.toString());
    else params.delete('category_value_id');

    if (values.state_id) params.set('state_id', values.state_id.toString());
    else params.delete('state_id');

    params.set('min_price', values.priceRange[0].toString());
    params.set('max_price', values.priceRange[1].toString());

    router.push(`/explore?${params.toString()}`);
  };

  return {
    form,
    onSubmit,
  };
}
