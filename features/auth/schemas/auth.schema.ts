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

export const registerCompanySchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(255),
  caption: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل').max(255),
  country_id: z.union([z.string(), z.number()]).refine(val => !!val, 'يرجى اختيار الدولة'),
  state_id: z.union([z.string(), z.number()]).refine(val => !!val, 'يرجى اختيار المحافظة'),
  phone: z.string().regex(/^\d{9,15}$/, 'رقم الهاتف يجب أن يكون بين 9 و 15 رقماً'),
  whatsapp_phone: z.string().regex(/^\d{9,15}$/, 'رقم الواتساب يجب أن يكون بين 9 و 15 رقماً'),
  company_department_id: z.union([z.string(), z.number()]).refine(val => !!val, 'يرجى اختيار القسم'),
  image: z.any().refine((file) => file instanceof File, "يرجى رفع صورة الشركة"),
});

export type PhoneValues = z.infer<typeof phoneSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type RegisterCompanyValues = z.infer<typeof registerCompanySchema>;
