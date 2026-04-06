import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(3, { message: 'الاسم يجب أن يكون أكثر من 3 حروف' }).max(255).optional(),
  caption: z.string().min(3, { message: 'الوصف يجب أن يكون أكثر من 3 حروف' }).max(255).optional(),
  image: z.any().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
