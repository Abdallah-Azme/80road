import api from '@/lib/api-client';
import { Country } from '../types/country';

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<{ data: Country[] }>('/countries');
  return response.data;
};
