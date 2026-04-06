import { useQuery } from '@tanstack/react-query';
import { locationService } from '../services/location.service';

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => locationService.getCountries(),
  });
}

export function useStates(countryId?: string | number) {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: () => locationService.getStates(countryId!),
    enabled: !!countryId,
  });
}

export function useCities(stateId?: string | number) {
  return useQuery({
    queryKey: ['cities', stateId],
    queryFn: () => locationService.getCities(stateId!),
    enabled: !!stateId,
  });
}
