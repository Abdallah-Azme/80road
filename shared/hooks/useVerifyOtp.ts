import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'next/navigation';
import type { VerifyOtpPayload, AuthResponse, VerifyOtpData } from '../types/auth';

export const useVerifyOtp = () => {
  const login = useUserStore(s => s.login);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authService.verifyOtp(payload),
    onSuccess: (response: AuthResponse<VerifyOtpData>) => {
      const { user, token } = response.data;
      
      // Update global user state (this uses persistence already)
      login({
        id: user.id,
        phone: user.country_code + ' ' + (user as any).phone, // Combine for display if needed
        name: user.name || 'مستخدم',
        avatar: user.image,
        token: token,
      });

      console.log('OTP verified successfully:', response.message);
      
      // Redirect to quick-start OR home
      router.replace('/quick-start');
    },
    onError: (error: any) => {
      console.error('OTP Verification error:', error);
    },
  });
};
