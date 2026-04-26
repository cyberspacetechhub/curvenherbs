// ─── Common ──────────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface LoginPayload { email: string; password: string; }
export interface RegisterPayload { firstName: string; lastName: string; email: string; phone: string; password: string; }
export interface ChangePasswordPayload { oldPassword: string; newPassword: string; }

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: 'Admin' | 'User';
  createdAt: string;
}

export interface UpdateProfilePayload { firstName?: string; lastName?: string; phone?: string; }

// ─── Admin ───────────────────────────────────────────────────────────────────
export interface Admin extends User {
  role: 'superadmin' | 'manager' | 'support';
  isActive: boolean;
  lastLogin?: string;
}

export interface AdminPayload { firstName: string; lastName: string; email: string; phone: string; password: string; role: Admin['role']; }
export interface UpdateAdminPayload { firstName?: string; lastName?: string; phone?: string; role?: Admin['role']; }

// ─── Product ─────────────────────────────────────────────────────────────────
export type ProductCategory = 'Weight Gain' | 'Curve Enhancement' | 'Flat Tummy' | 'Combo Packs' | 'Topical' | 'Suppository';
export type ProductSubCategory = 'Syrup' | 'Powder' | 'Cream' | 'Oil' | 'Set';

export interface ProductImage { url: string; alt: string; isMain: boolean; publicId?: string; }
export interface ProductIngredient { name: string; description: string; }

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  isInHouse: boolean;
  formulationNote: string;
  category: ProductCategory;
  subCategory?: ProductSubCategory;
  price: number;
  discountedPrice?: number;
  currency: string;
  stock: number;
  isInStock: boolean;
  images: ProductImage[];
  keyBenefits: string[];
  ingredients: ProductIngredient[];
  usageInstructions?: string;
  recommendedFor?: string;
  expectedResults?: string;
  sizeVolume?: string;
  packSize?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  inStock?: boolean;
  tag?: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'Pending' | 'Payment Received' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'Bank Transfer' | 'POS' | 'Cash on Delivery' | 'WhatsApp Order';

export interface OrderCustomer { name: string; email: string; phone: string; whatsappNumber?: string; location: string; address: string; }
export interface OrderItem { product: Product | string; quantity: number; priceAtPurchase: number; }

export interface Order {
  _id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  orderSource: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  customer: OrderCustomer;
  items: { product: string; quantity: number }[];
  paymentMethod: PaymentMethod;
  notes?: string;
  couponCode?: string;
}

export interface UpdateOrderStatusPayload { status: OrderStatus; note?: string; }

export interface CouponValidatePayload { code: string; totalAmount: number; }
export interface CouponValidateResult { discount: number; couponId: string; }

// ─── Coupon ───────────────────────────────────────────────────────────────────
export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CouponPayload {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  expiresAt?: string;
  isActive?: boolean;
}

// ─── Order Tracking ──────────────────────────────────────────────────────────
export interface OrderTracking {
  _id: string;
  order: string;
  status: OrderStatus;
  note?: string;
  updatedBy?: string;
  createdAt: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  product: string;
  customerName: string;
  rating: number;
  comment?: string;
  verified: boolean;
  approved: boolean;
  createdAt: string;
}

export interface ReviewPayload { customerName: string; rating: number; comment?: string; }

// ─── Testimony ───────────────────────────────────────────────────────────────
export interface Testimony {
  _id: string;
  customerName: string;
  location?: string;
  beforeImage?: string;
  afterImage?: string;
  timeTaken?: string;
  testimonial: string;
  productUsed?: { _id: string; name: string; slug: string };
  rating?: number;
  approved: boolean;
  createdAt: string;
}

export interface TestimonyPayload { customerName: string; location?: string; timeTaken?: string; testimonial: string; productUsed?: string; rating?: number; }

// ─── Newsletter ───────────────────────────────────────────────────────────────
export interface NewsletterSubscriber { _id: string; email: string; isSubscribed: boolean; createdAt: string; }

// ─── Contact ─────────────────────────────────────────────────────────────────
export interface ContactMessage { _id: string; name: string; phone?: string; email?: string; message: string; isRead: boolean; createdAt: string; }
export interface ContactPayload { name: string; phone?: string; email?: string; message: string; }

// ─── Location ────────────────────────────────────────────────────────────────
export interface Country { name: string; code: string; currency: string; phoneCode: string; flag: string; }
export interface State { name: string; code: string; }
export interface City { name: string; }

// ─── Cart (client-side only) ─────────────────────────────────────────────────
export interface CartItem { product: Product; quantity: number; }

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface OverviewStats {
  orders: { total: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
  revenue: { total: number };
  products: { total: number; outOfStock: number };
  customers: { total: number };
  newsletter: { subscribers: number };
  inbox: { unread: number };
  moderation: { pendingReviews: number; pendingTestimonies: number };
}

export interface RevenueChartPoint { label: string; revenue: number; orders: number; }
export interface TopProduct { _id: string; name: string; slug: string; totalSold: number; totalRevenue: number; }
export interface StatusBreakdown { status: string; count: number; }
export interface PaymentBreakdown { method: string; count: number; revenue: number; }
export interface RevenueComparison { monthly: { current: number; previous: number; changePercent: number }; weekly: { current: number; previous: number; changePercent: number }; thisMonthOrders: number; lastMonthOrders: number; }
export interface CustomerGrowthPoint { label: string; newCustomers: number; }
export interface CategoryBreakdown { category: string; totalSold: number; totalRevenue: number; }
