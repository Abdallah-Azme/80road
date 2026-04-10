import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { LoginPayload, AuthResponse } from '../types/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response: AuthResponse<[]>) => {
      console.log('OTP sent successfully:', response.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error('Login error:', error);
    },
  });
};
