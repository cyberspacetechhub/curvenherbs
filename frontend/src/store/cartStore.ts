import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const existing = get().items.find(i => i.product._id === product._id);
        if (existing) {
          set({ items: get().items.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },

      removeItem: (productId) => set({ items: get().items.filter(i => i.product._id !== productId) }),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) return get().removeItem(productId);
        set({ items: get().items.map(i => i.product._id === productId ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () => get().items.reduce((sum, i) => {
        const price = i.product.discountedPrice ?? i.product.price;
        return sum + price * i.quantity;
      }, 0),
    }),
    { name: 'curvenherbs-cart' }
  )
);
