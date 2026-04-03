'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quickStartSchema, type QuickStartValues } from '../schemas/quick-start.schema';

export function useQuickStartForm(defaultValues?: Partial<QuickStartValues>) {
  const form = useForm<QuickStartValues>({
    resolver: zodResolver(quickStartSchema) as Resolver<QuickStartValues>,
    defaultValues: {
      name: '',
      purpose: '',
      propertyType: '',
      governorate: '',
      area: '',
      ...defaultValues,
    },
  });

  const onSubmit = (values: QuickStartValues) => {
    console.log('Wizard Completed:', values);
    // Navigation can happen in the page component
  };

  return { form, onSubmit };
}
