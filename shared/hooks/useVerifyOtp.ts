import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useUserStore } from '@/stores/user.store';
import { authStorage } from '../utils/auth-storage';
import { useRouter, useSearchParams } from 'next/navigation';
import type { VerifyOtpPayload, AuthResponse, VerifyOtpData } from '../types/auth';

export const useVerifyOtp = () => {
  const login = useUserStore(s => s.login);
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: async (response: AuthResponse<VerifyOtpData>) => {
      const { user, token } = response.data;
      
      // Persist token in cookie (999 days) + localStorage + Capacitor
      // MUST await this before redirecting — otherwise the middleware
      // cookie check fires before the cookie is actually written in production.
      await authStorage.setToken(token);

      // Update global user state
      login({
        id: user.id,
        phone: user.country_code,
        name: user.name || 'مستخدم',
        avatar: user.image,
        token: token,
      });

      // Redirect to the intended page, or the mandatory quick-start if it's their first time,
      // or just default to quick-start setup as requested.
      const callbackUrl = searchParams.get('callbackUrl');
      
      if (callbackUrl && callbackUrl !== '/') {
        router.replace(callbackUrl);
      } else {
        // Default destination after login is now the quick-start setup flow
        router.replace('/quick-start?mode=edit');
      }
    },
    onError: (error: Error | unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('OTP Verification error:', message);
    },
  });
};
