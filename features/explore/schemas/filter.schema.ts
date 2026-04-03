import * as z from 'zod';

export const exploreFilterSchema = z.object({
  propertyType: z.string().optional().default(''),
  governorate: z.string().optional().default(''),
  priceRange: z.array(z.number()).length(2).default([50, 2000]),
});

export type ExploreFilterValues = z.infer<typeof exploreFilterSchema>;
