import { z } from 'zod';

// ────────────────────────────────────────────────────────────
// Listing
// ────────────────────────────────────────────────────────────
export const ListingSchema = z.object({
  id: z.number(),
  listingType: z.string().optional(),
  propertyType: z.string().optional(),
  price: z.string(),
  governorate: z.string().optional(),
  area: z.string().optional(),
  title: z.string(),
  rooms: z.union([z.string(), z.number()]).optional(),
  bathrooms: z.union([z.string(), z.number()]).optional(),
  size: z.number().optional(),
  balcony: z.string().optional(),
  parking: z.string().optional(),
  parkingSystems: z.array(z.string()).optional(),
  electricity: z.string().optional(),
  water: z.string().optional(),
  ac: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  video: z.string().nullable().optional(),
  imageUrl: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
  views: z.number().optional(),
  publisherId: z.string().optional(),
  publisherName: z.string().optional(),
  publisherAvatar: z.string().optional(),
});

export type Listing = z.infer<typeof ListingSchema>;

// ────────────────────────────────────────────────────────────
// Office
// ────────────────────────────────────────────────────────────
export const OfficeSchema = z.object({
  id: z.string(),
  officeName: z.string(),
  username: z.string(),
  logo: z.string(),
  bio: z.string(),
  governorate: z.string(),
  yearsExperience: z.number(),
  activeListingsCount: z.number(),
  soldOrRentedCount: z.number(),
  totalViews: z.number(),
  rating: z.number(),
  responseTime: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  verified: z.boolean(),
  specialties: z.array(z.string()),
  sampleListings: z.array(ListingSchema),
});

export type Office = z.infer<typeof OfficeSchema>;

// ────────────────────────────────────────────────────────────
// Country
// ────────────────────────────────────────────────────────────
export const CountrySchema = z.object({
  code: z.string(),
  name: z.string(),
  flag: z.string(),
});

export type Country = z.infer<typeof CountrySchema>;

// ────────────────────────────────────────────────────────────
// Query Keys registry (prevents typos)
// ────────────────────────────────────────────────────────────
export const QUERY_KEYS = {
  listings: {
    all: ['listings'] as const,
    detail: (id: number) => ['listings', id] as const,
    explore: ['listings', 'explore'] as const,
  },
  offices: {
    all: ['offices'] as const,
    detail: (id: string) => ['offices', id] as const,
  },
  blogs: {
    all: ['blogs'] as const,
    detail: (id: number | string) => ['blogs', id] as const,
  },
} as const;

