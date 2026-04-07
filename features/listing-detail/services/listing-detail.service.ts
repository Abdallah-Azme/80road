import api from '@/lib/api-client';
import { Listing, ListingSchema } from '@/lib/types';
import { z } from 'zod';

interface ListingDetailResponse {
  status: boolean;
  message: string;
  data: Listing;
}

interface ExploreListingsResponse {
  status: boolean;
  message: string;
  data: Listing[];
}

/**
 * Fetch a single listing by id from the real API.
 */
export async function fetchListingById(id: number): Promise<Listing | null> {
  try {
    const response = await api.get<ListingDetailResponse>(`/ad/${id}`);
    if (!response.status || !response.data) return null;
    
    console.log('[Listing Service] Raw API Data:', response.data);
    
    const raw = response.data as Record<string, unknown>;
    
    // Simple mapper for common snake_case mappings that might be missing
    const mappedData = {
      ...raw,
      listingType: (raw.listingType ?? raw.type ?? raw.listing_type ?? 'N/A') as string,
      propertyType: (raw.propertyType ?? raw.property_type ?? raw.category ?? 'N/A') as string,
      governorate: (raw.governorate ?? raw.governorate_name ?? 'N/A') as string,
      area: (raw.area ?? raw.area_name ?? 'N/A') as string,
      images: (raw.images ?? (raw.image ? [raw.image] : []) ?? []) as string[],
    };
    
    return ListingSchema.parse(mappedData);
  } catch (error) {
    console.error(`[Listing Service] Error fetching ad ${id}:`, error);
    return null;
  }
}

/**
 * Fetch explore/search listings.
 */
export async function fetchExploreListings(): Promise<Listing[]> {
  try {
    const response = await api.get<ExploreListingsResponse>('/explore');
    if (!response.status || !response.data) return [];
    
    return z.array(ListingSchema).parse(response.data);
  } catch (error) {
    console.error('[Listing Service] Error fetching explore ads:', error);
    return [];
  }
}
