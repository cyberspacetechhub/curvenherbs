import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testimonyApi } from '@/api';

export const TESTIMONY_KEYS = {
  approved: ['testimonies', 'approved'] as const,
  pending: ['testimonies', 'pending'] as const,
};

export const useTestimonies = () =>
  useQuery({ queryKey: TESTIMONY_KEYS.approved, queryFn: () => testimonyApi.getApproved().then(r => r.data.data) });

export const useSubmitTestimony = () =>
  useMutation({ mutationFn: (data: FormData) => testimonyApi.submit(data) });

export const usePendingTestimonies = () =>
  useQuery({ queryKey: TESTIMONY_KEYS.pending, queryFn: () => testimonyApi.getPending().then(r => r.data.data) });

export const useApproveTestimony = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonyApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TESTIMONY_KEYS.pending });
      qc.invalidateQueries({ queryKey: TESTIMONY_KEYS.approved });
    },
  });
};

export const useDeleteTestimony = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonyApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TESTIMONY_KEYS.pending }),
  });
};
