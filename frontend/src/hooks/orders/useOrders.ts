import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api';
import type { PlaceOrderPayload, UpdateOrderStatusPayload, CouponValidatePayload } from '@/types';

export const ORDER_KEYS = {
  all: ['orders'] as const,
  list: (filters?: object) => ['orders', 'list', filters] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
  tracking: (id: string) => ['orders', 'tracking', id] as const,
};

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: PlaceOrderPayload) => orderApi.place(data).then(r => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDER_KEYS.all }),
  });
};

export const useValidateCoupon = () =>
  useMutation({ mutationFn: (data: CouponValidatePayload) => orderApi.validateCoupon(data).then(r => r.data.data) });

export const useOrderTracking = (id: string) =>
  useQuery({
    queryKey: ORDER_KEYS.tracking(id),
    queryFn: () => orderApi.getTracking(id).then(r => r.data.data),
    enabled: !!id,
  });

// Public order detail — uses the tracking endpoint which is publicly accessible
export const usePublicOrder = (id: string) =>
  useQuery({
    queryKey: [...ORDER_KEYS.detail(id), 'public'],
    queryFn: () => orderApi.getPublic(id).then(r => r.data.data),
    enabled: !!id,
    retry: false,
  });

export const useMarkOrderReceived = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.markReceived(id).then(r => r.data),
    onSuccess: (_data, id) => qc.invalidateQueries({ queryKey: ORDER_KEYS.tracking(id) }),
  });
};

// Admin hooks
export const useAllOrders = (filters?: { status?: string }) =>
  useQuery({
    queryKey: ORDER_KEYS.list(filters),
    queryFn: () => orderApi.getAll(filters).then(r => r.data.data),
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => orderApi.getById(id).then(r => r.data.data),
    enabled: !!id,
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusPayload }) => orderApi.updateStatus(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: ORDER_KEYS.tracking(id) });
      qc.invalidateQueries({ queryKey: ORDER_KEYS.all });
    },
  });
};
