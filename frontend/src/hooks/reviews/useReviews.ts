import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/api';
import type { ReviewPayload } from '@/types';

export const REVIEW_KEYS = {
  byProduct: (id: string) => ['reviews', 'product', id] as const,
  pending: ['reviews', 'pending'] as const,
};

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: REVIEW_KEYS.byProduct(productId),
    queryFn: () => reviewApi.getByProduct(productId).then(r => r.data.data),
    enabled: !!productId,
  });

export const useAddReview = (productId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewPayload) => reviewApi.add(productId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: REVIEW_KEYS.byProduct(productId) }),
  });
};

export const usePendingReviews = () =>
  useQuery({ queryKey: REVIEW_KEYS.pending, queryFn: () => reviewApi.getPending().then(r => r.data.data) });

export const useApproveReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: REVIEW_KEYS.pending }),
  });
};

export const useDeleteReview = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: REVIEW_KEYS.pending }),
  });
};
