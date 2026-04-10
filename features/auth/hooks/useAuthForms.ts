'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  phoneSchema, 
  otpSchema, 
  registerCompanySchema,
  type PhoneValues, 
  type OtpValues,
  type RegisterCompanyValues
} from '../schemas/auth.schema';

export function usePhoneForm() {
  return useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema) as Resolver<PhoneValues>,
    defaultValues: { phone: '', country_id: '' },
  });
}

export function useOtpForm() {
  return useForm<OtpValues>({
    resolver: zodResolver(otpSchema) as Resolver<OtpValues>,
    defaultValues: { otp: '' },
  });
}

export function useRegisterCompanyForm() {
  return useForm<RegisterCompanyValues>({
    resolver: zodResolver(registerCompanySchema) as Resolver<RegisterCompanyValues>,
    defaultValues: {
      name: '',
      caption: '',
      country_id: '',
      state_id: '',
      phone: '',
      whatsapp_phone: '',
      company_department_id: '',
      image: null,
    },
  });
}
