import api from '@/lib/api-client';
import { Listing } from '@/lib/types';
import { mapRawExploreToListing } from '@/features/explore/services/explore.service';
import { ExploreRawAd } from '@/features/explore/types';

interface ListingDetailResponse {
  status: boolean;
  message: string;
  data: ExploreRawAd;
}

/**
 * Fetch a single listing by id from the real API.
 */
export async function fetchListingById(id: number): Promise<Listing | null> {
  try {
    const response = await api.get<ListingDetailResponse>(`/ad/${id}`);
    if (!response.status || !response.data) return null;
    
    // Use the central mapper to handle is_liked, categories, etc.
    return mapRawExploreToListing(response.data);
  } catch (error) {
    console.error(`[Listing Service] Error fetching ad ${id}:`, error);
    return null;
  }
}
