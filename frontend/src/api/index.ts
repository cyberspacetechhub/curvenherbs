import api from './axios';
import type {
  LoginPayload, RegisterPayload, UpdateProfilePayload, ChangePasswordPayload,
  ProductFilters, PlaceOrderPayload, UpdateOrderStatusPayload,
  ReviewPayload, ContactPayload,
  CouponValidatePayload, CouponPayload, AdminPayload, UpdateAdminPayload
} from '@/types';

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: LoginPayload) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.get('/auth/refresh'),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const userApi = {
  register: (data: RegisterPayload) => api.post('/users/register', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: UpdateProfilePayload) => api.put('/users/profile', data),
  changePassword: (data: ChangePasswordPayload) => api.put('/users/change-password', data),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productApi = {
  getAll: (filters?: ProductFilters) => api.get('/products', { params: filters }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  create: (data: FormData) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const orderApi = {
  place: (data: PlaceOrderPayload) => api.post('/orders', data),
  validateCoupon: (data: CouponValidatePayload) => api.post('/orders/validate-coupon', data),
  getTracking: (id: string) => api.get(`/orders/${id}/tracking`),
  markReceived: (id: string) => api.patch(`/orders/${id}/mark-received`),
  // Admin
  getAll: (filters?: { status?: string }) => api.get('/orders', { params: filters }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: UpdateOrderStatusPayload) => api.put(`/orders/${id}/status`, data),
};

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const reviewApi = {
  add: (productId: string, data: ReviewPayload) => api.post(`/reviews/products/${productId}`, data),
  getByProduct: (productId: string) => api.get(`/reviews/products/${productId}`),
  // Admin
  getPending: () => api.get('/reviews/pending'),
  approve: (id: string) => api.put(`/reviews/${id}/approve`),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// ─── Testimonies ─────────────────────────────────────────────────────────────
export const testimonyApi = {
  submit: (data: FormData) => api.post('/testimonies', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getApproved: () => api.get('/testimonies'),
  // Admin
  getPending: () => api.get('/testimonies/pending'),
  approve: (id: string) => api.put(`/testimonies/${id}/approve`),
  delete: (id: string) => api.delete(`/testimonies/${id}`),
};

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email: string) => api.post('/newsletter/unsubscribe', { email }),
  // Admin
  getAll: () => api.get('/newsletter'),
};

// ─── Contact ─────────────────────────────────────────────────────────────────
export const contactApi = {
  send: (data: ContactPayload) => api.post('/contact', data),
  // Admin
  getAll: () => api.get('/contact'),
  markRead: (id: string) => api.put(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

// ─── Locations ───────────────────────────────────────────────────────────────
export const locationApi = {
  getCountries: () => api.get('/locations/countries'),
  getStates: (countryCode: string) => api.get(`/locations/countries/${countryCode}/states`),
  getCities: (countryCode: string, stateCode: string) => api.get(`/locations/countries/${countryCode}/states/${stateCode}/cities`),
};

// ─── Analytics (Admin) ───────────────────────────────────────────────────────
export const analyticsApi = {
  overview: () => api.get('/analytics/overview'),
  revenue: (period?: string) => api.get('/analytics/revenue', { params: { period } }),
  revenueComparison: () => api.get('/analytics/revenue/comparison'),
  topProducts: (limit?: number) => api.get('/analytics/top-products', { params: { limit } }),
  ordersByStatus: () => api.get('/analytics/orders/status'),
  ordersByPayment: () => api.get('/analytics/orders/payment-method'),
  customerGrowth: (period?: string) => api.get('/analytics/customers/growth', { params: { period } }),
  categories: () => api.get('/analytics/categories'),
};

// ─── Upload (Admin) ──────────────────────────────────────────────────────────
export const uploadApi = {
  upload: (file: File, folder?: string) => {
    const form = new FormData();
    form.append('image', file);
    return api.post(`/upload${folder ? `?folder=${folder}` : ''}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  delete: (publicId: string) => api.delete('/upload', { data: { publicId } }),
};

// ─── Coupons (Admin) ───────────────────────────────────────────────────────────────────
export const couponApi = {
  getAll: () => api.get('/coupons'),
  create: (data: CouponPayload) => api.post('/coupons', data),
  update: (id: string, data: Partial<CouponPayload>) => api.put(`/coupons/${id}`, data),
  toggle: (id: string) => api.patch(`/coupons/${id}/toggle`),
  delete: (id: string) => api.delete(`/coupons/${id}`),
};

// ─── Admins (Superadmin) ─────────────────────────────────────────────────────
export const adminApi = {
  create: (data: AdminPayload) => api.post('/admins', data),
  getAll: () => api.get('/admins'),
  getById: (id: string) => api.get(`/admins/${id}`),
  update: (id: string, data: UpdateAdminPayload) => api.put(`/admins/${id}`, data),
  toggleActive: (id: string) => api.patch(`/admins/${id}/toggle-active`),
  delete: (id: string) => api.delete(`/admins/${id}`),
};
