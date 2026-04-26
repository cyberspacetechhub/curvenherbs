import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api';
import type { ProductFilters } from '@/types';

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => ['products', 'list', filters] as const,
  detail: (slug: string) => ['products', 'detail', slug] as const,
};

export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: PRODUCT_KEYS.list(filters),
    queryFn: () => productApi.getAll(filters).then(r => r.data.data),
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: PRODUCT_KEYS.detail(slug),
    queryFn: () => productApi.getBySlug(slug).then(r => r.data.data),
    enabled: !!slug,
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => productApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => productApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCT_KEYS.all }),
  });
};
