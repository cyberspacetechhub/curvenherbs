import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponApi } from '@/api';
import type { CouponPayload } from '@/types';

const COUPON_KEY = ['coupons'] as const;

export const useCoupons = () =>
  useQuery({ queryKey: COUPON_KEY, queryFn: () => couponApi.getAll().then(r => r.data.data) });

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CouponPayload) => couponApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPON_KEY }),
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponPayload> }) => couponApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPON_KEY }),
  });
};

export const useToggleCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponApi.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPON_KEY }),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: COUPON_KEY }),
  });
};
