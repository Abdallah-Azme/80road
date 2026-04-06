'use client';

import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  phoneSchema, 
  otpSchema, 
  type PhoneValues, 
  type OtpValues 
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
