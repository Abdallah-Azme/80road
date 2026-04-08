import * as z from 'zod';

export const postAdSchema = z.object({
  // Location IDs or Names depending on selection
  country: z.union([z.string(), z.number()]).optional(),
  governorate: z.union([z.string(), z.number()]).optional(),
  area: z.union([z.string(), z.number()]).optional(),
  
  // Dynamic fields will be added via catchall or specific mappings
  // Media handling
  video: z.any().optional(),
  images: z.array(z.any()).default([]),
  
  // Dynamic category values can be stored here or at the root
  category_values_ids: z.record(z.string(), z.any()).default({}),
}).catchall(z.any());

export type PostAdValues = z.infer<typeof postAdSchema>;
