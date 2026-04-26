import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsletterApi } from '@/api';

export const useSubscribe = () =>
  useMutation({ mutationFn: (email: string) => newsletterApi.subscribe(email) });

export const useUnsubscribe = () =>
  useMutation({ mutationFn: (email: string) => newsletterApi.unsubscribe(email) });

export const useAllSubscribers = () =>
  useQuery({ queryKey: ['newsletter', 'subscribers'], queryFn: () => newsletterApi.getAll().then(r => r.data.data) });
