import { z } from 'zod';

export const CompanyDepartmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
});

export type CompanyDepartment = z.infer<typeof CompanyDepartmentSchema>;

export interface DepartmentsResponse {
  status: boolean;
  message: string;
  data: CompanyDepartment[];
  errors: unknown[];
}
