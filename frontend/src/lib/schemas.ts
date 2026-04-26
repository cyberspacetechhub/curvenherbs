import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  whatsappNumber: z.string().optional(),
  country: z.string().min(1, 'Select a country'),
  state: z.string().min(1, 'Select a state'),
  city: z.string().optional(),
  address: z.string().min(5, 'Enter your delivery address'),
  paymentMethod: z.enum(['Bank Transfer', 'POS', 'Cash on Delivery', 'WhatsApp Order']),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const reviewSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const testimonySchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  location: z.string().optional(),
  timeTaken: z.string().optional(),
  testimonial: z.string().min(20, 'Please share a bit more about your experience'),
  productUsed: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message is too short'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type TestimonyFormData = z.infer<typeof testimonySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
