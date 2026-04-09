import api from '@/lib/api-client';
import type { AuthResponse, LoginPayload, VerifyOtpPayload, VerifyOtpData, RegisterCompanyPayload } from '../types/auth';

export const authService = {
  /**
   * Send OTP to the user's phone number
   */
  login: async (payload: LoginPayload): Promise<AuthResponse<[]>> => {
    return api.post<AuthResponse<[]>>('/auth/login', {
      country_id: payload.country_id,
      phone: payload.phone,
    });
  },

  /**
   * Resend the OTP to the user's phone number
   */
  resendOtp: async (payload: { phone: string; country_id: string | number }): Promise<AuthResponse<[]>> => {
    return api.post<AuthResponse<[]>>('/auth/resend-otp', {
      country_id: payload.country_id,
      phone: payload.phone,
    });
  },

  /**
   * Verify the OTP and login the user
   */
  verifyOtp: async (payload: VerifyOtpPayload): Promise<AuthResponse<VerifyOtpData>> => {
    return api.post<AuthResponse<VerifyOtpData>>('/auth/verify-otp', {
      country_id: payload.country_id,
      phone: payload.phone,
      otp: payload.code,
    });
  },
  /**
   * Logout the user
   */
  logout: async (): Promise<AuthResponse<[]>> => {
    return api.post<AuthResponse<[]>>('/auth/logout');
  },

  /**
   * Register a new company
   */
  registerCompany: async (payload: RegisterCompanyPayload): Promise<AuthResponse<[]>> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    return api.post<AuthResponse<[]>>('/auth/register-company', formData);
  },
};

