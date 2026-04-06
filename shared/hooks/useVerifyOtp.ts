import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useUserStore } from '@/stores/user.store';
import { authStorage } from '../utils/auth-storage';
import { useRouter } from 'next/navigation';
import type { VerifyOtpPayload, AuthResponse, VerifyOtpData } from '../types/auth';

export const useVerifyOtp = () => {
  const login = useUserStore(s => s.login);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: (response: AuthResponse<VerifyOtpData>) => {
      const { user, token } = response.data;
      
      // Update unified storage for Middleware (cookies) and Capacitor (native)
      authStorage.setToken(token);

      // Update global user state (this uses persistence already)
      login({
        id: user.id,
        phone: user.country_code, // Payload uses ID, response uses code
        name: user.name || 'مستخدم',
        avatar: user.image,
        token: token,
      });

      console.log('OTP verified successfully:', response.message);
      
      // Redirect to quick-start OR home
      router.replace('/quick-start');
    },
    onError: (error: Error | unknown) => {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('OTP Verification error:', message);
    },
  });
};
