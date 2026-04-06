import * as z from 'zod';

export const phoneSchema = z.object({
  phone: z.string().min(5, 'أدخل رقم هاتف صحيح'),
  country_id: z.union([z.string(), z.number()]),
});

export const otpSchema = z.object({
  otp: z.string()
    .min(4, 'أدخل رمز التحقق المكون من 4 أرقام')
    .max(4)
    .regex(/^\d+$/, 'أدخل أرقاماً فقط'),
});

export type PhoneValues = z.infer<typeof phoneSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
