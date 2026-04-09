import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { RegisterCompanyPayload } from '../types/auth';

export function useRegisterCompany() {
  return useMutation({
    mutationFn: (payload: RegisterCompanyPayload) => authService.registerCompany(payload),
  });
}
