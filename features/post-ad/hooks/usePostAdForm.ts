'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postAdSchema, type PostAdValues } from '../schemas/post-ad.schema';
import { postAdService } from '../services/post-ad.service';
import { toast } from 'sonner';

export function usePostAdForm(defaultValues?: Partial<PostAdValues>) {
  const form = useForm<PostAdValues>({
    resolver: zodResolver(postAdSchema) as Resolver<PostAdValues>,
    defaultValues: {
      listingType: '',
      propertyType: '',
      country: undefined,
      governorate: undefined,
      area: undefined,
      size: 50,
      parkingSystems: [],
      ...defaultValues,
    },
  });

  const onSubmit = async (values: PostAdValues) => {
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('country_id', String(values.country));
      formData.append('state_id', String(values.governorate));
      formData.append('city_id', String(values.area));
      
      // Dynamic fields
      if (values.category_values_ids) {
        Object.entries(values.category_values_ids).forEach(([catId, valId]) => {
          formData.append(`category_values_ids[${catId}]`, String(valId));
        });
      }

      // Media
      if (values.images && values.images.length > 0) {
        values.images.forEach((img) => {
          if (img instanceof File) {
            formData.append('images[]', img);
          }
        });
      }

      if (values.video instanceof File) {
        formData.append('video', values.video);
      }

      const res = await postAdService.createAd(formData);
      if (res.status) {
        toast.success(res.message || 'تم نشر الإعلان بنجاح');
      } else {
        toast.error(res.message || 'فشل نشر الإعلان');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'حدث خطأ أثناء نشر الإعلان';
      toast.error(message);
    }
  };

  return { form, onSubmit };
}
