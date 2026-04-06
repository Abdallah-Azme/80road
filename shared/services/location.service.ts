import api from '@/lib/api-client';
import { Country, State, City } from '../types/location';

export interface LocationResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors: any[];
}

export const locationService = {
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get<LocationResponse<Country[]>>('/countries');
    return response.data;
  },

  getStates: async (countryId: string | number): Promise<State[]> => {
    const response = await api.get<LocationResponse<State[]>>(`/countries/${countryId}/states`);
    return response.data;
  },

  getCities: async (stateId: string | number): Promise<City[]> => {
    const response = await api.get<LocationResponse<City[]>>(`/states/${stateId}/cities`);
    return response.data;
  },
};
