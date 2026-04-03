import * as z from 'zod';

export const quickStartSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(50, 'الاسم طويل جداً'),
  purpose: z.string().min(1, 'يرجى اختيار ما تبحث عنه'),
  propertyType: z.string().min(1, 'يرجى اختيار نوع العقار'),
  governorate: z.string().min(1, 'يرجى اختيار المحافظة'),
  area: z.string().min(1, 'يرجى اختيار المنطقة'),
});

export type QuickStartValues = z.infer<typeof quickStartSchema>;
