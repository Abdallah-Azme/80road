import * as z from 'zod';

export const exploreFilterSchema = z.object({
  category_values_ids: z.array(z.union([z.string(), z.number()])).default([]),
  country_id: z.union([z.string(), z.number()]).optional().default(''),
  state_id: z.union([z.string(), z.number()]).optional().default(''),
  city_id: z.union([z.string(), z.number()]).optional().default(''),
  priceRange: z.array(z.number()).length(2).default([50, 2000]),
});

export type ExploreFilterValues = z.infer<typeof exploreFilterSchema>;
