import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/api';

export const useCountries = () =>
  useQuery({ queryKey: ['locations', 'countries'], queryFn: () => locationApi.getCountries().then(r => r.data.data), staleTime: Infinity });

export const useStates = (countryCode: string) =>
  useQuery({
    queryKey: ['locations', 'states', countryCode],
    queryFn: () => locationApi.getStates(countryCode).then(r => r.data.data),
    enabled: !!countryCode,
    staleTime: Infinity,
  });

export const useCities = (countryCode: string, stateCode: string) =>
  useQuery({
    queryKey: ['locations', 'cities', countryCode, stateCode],
    queryFn: () => locationApi.getCities(countryCode, stateCode).then(r => r.data.data),
    enabled: !!countryCode && !!stateCode,
    staleTime: Infinity,
  });
