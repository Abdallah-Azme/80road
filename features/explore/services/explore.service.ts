import api from '@/lib/api-client';
import { Listing, ListingSchema } from '@/lib/types';
import { ExploreFilters, ExploreResponse, ExploreRawAd } from '../types';

/**
 * Fetch explore/search listings with filters and pagination.
 */
export async function fetchExploreFeed(params?: ExploreFilters): Promise<ExploreResponse | null> {
  try {
    const response = await api.get<ExploreResponse>('/explore', { query: params });
    if (!response.status || !response.data) return null;
    
    return response;
  } catch (error) {
    console.error('[Explore Service] Error fetching ads:', error);
    return null;
  }
}

/**
 * Maps Raw Explore Ad to our internal Listing schema.
 */
export function mapRawExploreToListing(raw: ExploreRawAd): Listing {
  const propertyType = raw.answers?.find((a) => a.category_name === 'نوع العقار')?.category_value_name;
  const listingType = raw.answers?.find((a) => a.category_name === 'نوع الإعلان')?.category_value_name;

  return ListingSchema.parse({
    id: raw.id,
    title: raw.title,
    price: raw.price,
    governorate: raw.state_name,
    area: raw.city_name,
    images: raw.image?.file ? [raw.image.file] : [],
    listingType: listingType || 'N/A',
    propertyType: propertyType || 'N/A',
  });
}
