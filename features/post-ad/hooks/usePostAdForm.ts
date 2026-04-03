'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postAdSchema, type PostAdValues } from '../schemas/post-ad.schema';

export function usePostAdForm(defaultValues?: Partial<PostAdValues>) {
  const form = useForm<PostAdValues>({
    resolver: zodResolver(postAdSchema) as Resolver<PostAdValues>,
    defaultValues: {
      listingType: '',
      propertyType: '',
      country: '',
      governorate: '',
      area: '',
      size: 50,
      parkingSystems: [],
      ...defaultValues,
    },
  });

  const onSubmit = (values: PostAdValues) => {
    console.log('Post Ad Completed:', values);
  };

  return { form, onSubmit };
}
