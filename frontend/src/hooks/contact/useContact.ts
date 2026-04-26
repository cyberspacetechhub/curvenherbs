import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '@/api';
import type { ContactPayload } from '@/types';

const CONTACT_KEY = ['contact', 'messages'] as const;

export const useSendMessage = () =>
  useMutation({ mutationFn: (data: ContactPayload) => contactApi.send(data) });

export const useAllMessages = () =>
  useQuery({ queryKey: CONTACT_KEY, queryFn: () => contactApi.getAll().then(r => r.data.data) });

export const useMarkMessageRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACT_KEY }),
  });
};

export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACT_KEY }),
  });
};
