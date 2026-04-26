import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api';

export const useOverviewStats = () =>
  useQuery({ queryKey: ['analytics', 'overview'], queryFn: () => analyticsApi.overview().then(r => r.data.data) });

export const useRevenueChart = (period?: string) =>
  useQuery({ queryKey: ['analytics', 'revenue', period], queryFn: () => analyticsApi.revenue(period).then(r => r.data.data) });

export const useRevenueComparison = () =>
  useQuery({ queryKey: ['analytics', 'revenue', 'comparison'], queryFn: () => analyticsApi.revenueComparison().then(r => r.data.data) });

export const useTopProducts = (limit?: number) =>
  useQuery({ queryKey: ['analytics', 'top-products', limit], queryFn: () => analyticsApi.topProducts(limit).then(r => r.data.data) });

export const useOrdersByStatus = () =>
  useQuery({ queryKey: ['analytics', 'orders', 'status'], queryFn: () => analyticsApi.ordersByStatus().then(r => r.data.data) });

export const useOrdersByPayment = () =>
  useQuery({ queryKey: ['analytics', 'orders', 'payment'], queryFn: () => analyticsApi.ordersByPayment().then(r => r.data.data) });

export const useCustomerGrowth = (period?: string) =>
  useQuery({ queryKey: ['analytics', 'customers', 'growth', period], queryFn: () => analyticsApi.customerGrowth(period).then(r => r.data.data) });

export const useCategoryBreakdown = () =>
  useQuery({ queryKey: ['analytics', 'categories'], queryFn: () => analyticsApi.categories().then(r => r.data.data) });
