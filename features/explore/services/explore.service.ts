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
 * Handles both 'answers' (legacy/detailed) and 'categories' (shorthand) response formats.
 */
export function mapRawExploreToListing(raw: ExploreRawAd): Listing {
  // Try to find property type in either 'answers' or 'categories'
  const propertyType = 
    raw.answers?.find((a) => a.category_name === 'نوع العقار')?.category_value_name ||
    raw.categories?.find((c) => c.name === 'نوع العقار')?.value;

  const listingType = 
    raw.answers?.find((a) => a.category_name === 'نوع الإعلان')?.category_value_name ||
    raw.categories?.find((c) => c.name === 'نوع الإعلان')?.value;

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
