'use client';

import { useMutation } from '@tanstack/react-query';
import { initiateCall } from '../services/listing-detail.service';

/**
 * Hook to initiate a call for an ad.
 * Returns the mutation state and the initiate function.
 */
export function useCallAd() {
  return useMutation({
    mutationFn: (adId: number) => initiateCall(adId),
    onSuccess: (response) => {
      // If payment_url is provided, redirect to it
      if (response.status && response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      }
    },
    onError: (error) => {
      console.error('[useCallAd] Error initiating call:', error);
    },
  });
}
