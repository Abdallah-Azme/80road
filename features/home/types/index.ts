import { Listing } from '@/lib/types';

// Re-export so consumers import from a single feature barrel
export type { Listing };

export interface HomePageProps {
  initialCountryCode?: string;
}

export type QuickActionId = 'rent' | 'sale' | 'hotels';

export interface QuickAction {
  id: QuickActionId;
  label: string;
  href: string;
}

export type PaymentStatus = 'IDLE' | 'STARTING' | 'VERIFYING' | 'CONFIRMING' | 'SUCCESS';
