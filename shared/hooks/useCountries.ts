import { useQuery } from '@tanstack/react-query';
import { getCountries } from '../services/countries.service';

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: getCountries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - countries don't change often
  });
};
