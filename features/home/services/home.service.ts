import api from '@/lib/api-client';

export interface FilterOptionValue {
  id: number;
  value: string;
}

export interface FilterCategory {
  id: number;
  name: string;
  type: string;
  values: FilterOptionValue[];
}

export interface FilterOptionsResponse {
  status: boolean;
  message: string;
  data: FilterCategory[];
}

/**
 * Fetch categories and values that should appear in the filter.
 */
export async function fetchFilterOptions(): Promise<FilterCategory[]> {
  try {
    const response = await api.get<FilterOptionsResponse>('/home/categories-appear-in-filter');
    if (response.status) return response.data;
    return [];
  } catch (error) {
    console.error('[Home Service] Error fetching filter options:', error);
    return [];
  }
}
