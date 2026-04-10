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
      price: '' as unknown as number, // Using empty string so field starts blank

      country: undefined,
      governorate: undefined,
      area: undefined,
      size: 50,
      parkingSystems: [],
      images: [],
      video: null,
      video_paths: [],
      category_values_ids: {},
      ...defaultValues,
    },
  });

  /**
   * Submit the ad form.
   * videoPaths: server-side paths already obtained from chunked upload (passed in from the wizard)
   * images: File[] for direct attachment upload
   */
  const onSubmit = async (
    values: PostAdValues,
    videoPaths: string[] = [],
  ) => {
    try {
      // Build answers array from category_values_ids map
      const answers = Object.entries(values.category_values_ids ?? {}).map(
        ([catId, valId]) => ({
          category_id: Number(catId),
          category_value_id: valId as number | string,
        }),
      );

      const images: File[] = (values.images ?? []).filter(
        (img): img is File => img instanceof File,
      );

      const res = await postAdService.createAd({
        answers,
        countryId: values.country ?? '',
        stateId: values.governorate ?? '',
        cityId: values.area ?? '',
        videoPaths,
        images,
        price: values.price,
        title: values.title,
        description: values.description,
      });

      if (res.status) {
        toast.success(res.message || 'تم نشر الإعلان بنجاح');
        return true;
      } else {
        toast.error(res.message || 'فشل نشر الإعلان');
        return false;
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'حدث خطأ أثناء نشر الإعلان';
      toast.error(message);
      return false;
    }
  };

  return { form, onSubmit };
}
