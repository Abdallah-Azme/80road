import api from '@/lib/api-client';
import { Blog } from '@/features/blogs/types';
import { Listing } from '@/lib/types';

export interface FilterHistoryPayload {
  name?: string;
  category_values_ids: number[];
  state_id: number;
  city_id: number;
}

export interface FilterHistoryResponse {
  status: boolean;
  message: string;
  data: unknown[];
  errors: unknown[];
}

export interface CategoryValue {
  id: number;
  value: string;
}

export interface CategoryFilter {
  id: number;
  name: string;
  type: string;
  values: CategoryValue[];
}

export interface CategoryFilterResponse {
  status: boolean;
  message: string;
  data: CategoryFilter[];
  errors: unknown[];
}

export interface HomeHeader {
  id: number;
  title: string;
  caption: string;
  image: string;
}

export interface HomeCategory {
  id: number;
  value: string;
  icon: string;
}

export interface HomeFooter {
  id: number;
  title: string;
  button_action: string;
  description: string;
  image: string;
  url: string | null;
}

export interface HomeDataResponse {
  status: boolean;
  message: string;
  data: {
    header: HomeHeader[];
    categories: HomeCategory[];
    blogs: Blog[];
    footer: HomeFooter[];
  };
  errors: unknown[];
}

export const homeService = {
  saveFilterHistory: async (payload: FilterHistoryPayload): Promise<FilterHistoryResponse> => {
    return api.post<FilterHistoryResponse>('/home/filter-history', payload);
  },

  getCategoriesAppearInFilter: async (): Promise<CategoryFilter[]> => {
    const response = await api.get<CategoryFilterResponse>('/home/categories-appear-in-filter');
    return response.data;
  },

  getHomeData: async (): Promise<HomeDataResponse['data']> => {
    const response = await api.get<HomeDataResponse>('/home');
    return response.data;
  },

  getAdsByHistory: async (): Promise<Listing[]> => {
    const response = await api.get<{ status: boolean; data: any[] }>('/home/ads-by-history');
    if (response.status && response.data) {
        // We use the mapper from explore service if available, or a simple one here
        // For now, let's just return the data and assume it's mapped or we map it in the component
        return response.data; 
    }
    return [];
  },
};
