import * as z from 'zod';

export const phoneSchema = z.object({
  phone: z.string()
    .min(8, 'أدخل رقم هاتف صحيح')
    .max(8, 'رقم الهاتف يتكون من 8 أرقام')
    .regex(/^\d+$/, 'أدخل أرقاماً فقط'),
});

export const otpSchema = z.object({
  otp: z.string()
    .min(4, 'أدخل رمز التحقق المكون من 4 أرقام')
    .max(4)
    .regex(/^\d+$/, 'أدخل أرقاماً فقط'),
});

export type PhoneValues = z.infer<typeof phoneSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
