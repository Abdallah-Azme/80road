import * as z from 'zod';

export const postAdSchema = z.object({
  listingType: z.string().min(1, 'يرجى اختيار نوع الإعلان'),
  propertyType: z.string().min(1, 'يرجى اختيار نوع العقار'),
  country: z.string().min(1, 'يرجى اختيار الدولة'),
  governorate: z.string().min(1, 'يرجى اختيار المحافظة'),
  area: z.string().min(1, 'يرجى اختيار المنطقة'),
  rooms: z.union([z.number(), z.string()]).optional(),
  bathrooms: z.union([z.number(), z.string()]).optional(),
  size: z.number().min(50).max(2000),
  balcony: z.string().optional(),
  parking: z.string().optional(),
  parkingSystems: z.array(z.string()).default([]),
  electricity: z.string().optional(),
  water: z.string().optional(),
  ac: z.string().optional(),
  video: z.any().optional(), // File handling
  images: z.array(z.any()).default([]), // File handling
});

export type PostAdValues = z.infer<typeof postAdSchema>;
