/**
 * features/home/services/listings.service.ts
 *
 * All data-fetching functions for the home feature.
 * Uses ofetch (from unjs/ofetch) — no axios needed.
 * For this project the "API" is the local demo data;
 * swap the return values with real ofetch() calls when a backend exists.
 */

import { Listing, ListingSchema } from '@/lib/types';
import { z } from 'zod';

// ─── Demo data (mirrors the legacy utils/db.ts) ──────────────
export const DEMO_ADS: Listing[] = [
  {
    id: 1,
    listingType: 'للإيجار',
    propertyType: 'شقة',
    price: '450 د.ك',
    area: 'الجابرية',
    governorate: 'حولي',
    title: 'للإيجار شقة راقية في الجابرية',
    rooms: 3, bathrooms: 2, size: 150,
    balcony: 'نعم', parking: '2', parkingSystems: ['سرداب'],
    electricity: 'على المالك', water: 'على المالك', ac: 'على المالك',
    description: 'شقة مميزة في موقع هادئ، تشطيب سوبر ديلوكس.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
    ],
    video: null, views: 120,
    publisherId: 'off_1', publisherName: 'مكتب الدانة العقاري',
    publisherAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 2,
    listingType: 'للبيع',
    propertyType: 'شقة',
    price: '720 د.ك',
    area: 'السالمية',
    governorate: 'حولي',
    title: 'للبيع شقة اطلالة بحرية',
    rooms: 4, bathrooms: 3, size: 200,
    balcony: 'نعم', parking: '2', parkingSystems: ['مظلات'],
    electricity: 'على المالك', water: 'على المالك', ac: 'على المالك',
    description: 'شقة فاخرة للبيع في السالمية، اطلالة مباشرة على البحر.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
    ],
    video: null, views: 340,
    publisherId: 'off_2', publisherName: 'مكتب أبراج الكويت العقاري',
    publisherAvatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 3,
    listingType: 'للإيجار',
    propertyType: 'دور',
    price: '1,250 د.ك',
    area: 'صباح السالم',
    governorate: 'مبارك الكبير',
    title: 'للإيجار دور كامل تشطيب جديد',
    rooms: 5, bathrooms: 4, size: 400,
    balcony: 'نعم', parking: '3', parkingSystems: ['مظلات'],
    electricity: 'على المستأجر', water: 'على المالك', ac: 'على المالك',
    description: 'دور أول مصعد، تشطيب مودرن، مساحات واسعة.',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
    ],
    video: null, views: 85,
    publisherId: 'off_1', publisherName: 'مكتب الدانة العقاري',
    publisherAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 4,
    listingType: 'للإيجار',
    propertyType: 'فيلا',
    price: '850 د.ك',
    area: 'مشرف',
    governorate: 'حولي',
    title: 'للإيجار فيلا دورين',
    rooms: 6, bathrooms: 5, size: 500,
    balcony: 'لا', parking: '4', parkingSystems: ['مظلات', 'اخرى'],
    electricity: 'على المستأجر', water: 'على المستأجر', ac: 'على المستأجر',
    description: 'فيلا زاوية، حديقة كبيرة، ديوانية منعزلة.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-40b5104d57ea?q=80&w=600&auto=format&fit=crop',
    ],
    video: null, views: 210,
    publisherId: 'off_3', publisherName: 'مكتب الصفوة العقاري',
    publisherAvatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300&auto=format&fit=crop',
  },
];

// ─── Service functions ────────────────────────────────────────

/**
 * Fetch the home-page listing feed.
 * TODO: replace with:
 *   return $fetch<Listing[]>('/api/listings', { query: { limit: 6 } })
 */
export async function fetchHomeListings(): Promise<Listing[]> {
  // Validate through Zod so we catch schema drift early
  const raw = DEMO_ADS.slice(0, 6);
  return z.array(ListingSchema).parse(raw);
}

/**
 * Fetch a single listing by id.
 */
export async function fetchListingById(id: number): Promise<Listing | null> {
  const found = DEMO_ADS.find(l => l.id === id) ?? null;
  if (!found) return null;
  return ListingSchema.parse(found);
}
