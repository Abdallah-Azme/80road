import { Listing, ListingSchema } from '@/lib/types';
import { z } from 'zod';
import { DEMO_ADS } from '@/features/home/services/listings.service';

const SAMPLE_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-a-view-of-the-city-at-night-1763-large.mp4';

export const DEMO_EXPLORE_ADS: Listing[] = [
  {
    id: 201, listingType: 'للبيع', propertyType: 'فيلا', price: '450,000 د.ك',
    area: 'الخيران', governorate: 'الأحمدي', title: 'فيلا مودرن في الخيران السكني',
    rooms: 6, bathrooms: 7, size: 600,
    description: 'فيلا تصميم حديث مع مسبح وإطلالة بحرية.',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&auto=format&fit=crop'],
    video: SAMPLE_VIDEO, views: 1540,
    publisherId: 'off_4', publisherName: 'مكتب المروج للوساطة',
    publisherAvatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 202, listingType: 'للإيجار', propertyType: 'شقة', price: '550 د.ك',
    area: 'الصديق', governorate: 'حولي', title: 'شقة فاخرة تشطيب VIP',
    rooms: 3, bathrooms: 3, size: 180,
    description: 'شقة في الصديق تشطيب راقي جداً.',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop'],
    video: SAMPLE_VIDEO, views: 890,
    publisherId: 'off_1', publisherName: 'مكتب الدانة العقاري',
    publisherAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop',
  },
];

const ALL_LISTINGS = [...DEMO_ADS, ...DEMO_EXPLORE_ADS];

export async function fetchListingById(id: number): Promise<Listing | null> {
  const found = ALL_LISTINGS.find(l => l.id === id) ?? null;
  if (!found) return null;
  return ListingSchema.parse(found);
}

export async function fetchExploreListings(): Promise<Listing[]> {
  return z.array(ListingSchema).parse(DEMO_EXPLORE_ADS);
}
