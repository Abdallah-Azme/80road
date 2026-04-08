import api from '@/lib/api-client';

export interface CategoryValue {
  id: number;
  value: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'select' | 'number' | 'range' | 'boolean';
  values: CategoryValue[];
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: Category[];
  errors: unknown[];
}

export const postAdService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data;
  },

  createAd: async (formData: FormData): Promise<{ status: boolean; message: string }> => {
    return api.post<{ status: boolean; message: string }>('/ad', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
