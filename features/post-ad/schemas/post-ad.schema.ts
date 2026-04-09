import * as z from 'zod';

export const postAdSchema = z.object({
  // Location IDs or Names depending on selection
  country: z.union([z.string(), z.number()]).optional(),
  governorate: z.union([z.string(), z.number()]).optional(),
  area: z.union([z.string(), z.number()]).optional(),

  // Media handling
  // `video` is the local File object for preview + chunked upload
  video: z.any().optional().nullable(),
  images: z.array(z.any()).default([]),

  // Paths returned from /merge-chunks — used when submitting the ad
  video_paths: z.array(z.string()).default([]),

  // Dynamic category values can be stored here or at the root
  category_values_ids: z.record(z.string(), z.any()).default({}),
}).catchall(z.any());

export type PostAdValues = z.infer<typeof postAdSchema>;
