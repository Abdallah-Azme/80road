import { fetchHomeListings, fetchListingById } from '@/features/home/services/listings.service';
// Import other server/backend actions here when created.

/**
 * The unified action registry maps string keys to actual logic functions.
 * - For Web (Server-side): executeAction calls these directly.
 * - For Mobile (APK): bridge fetches /api/mobile/[action], which calls these.
 * ALWAYS ensure these functions do NOT rely on frontend window/DOM objects!
 */
export const actionRegistry: Record<string, Function> = {
  fetchHomeListings,
  fetchListingById,
};
