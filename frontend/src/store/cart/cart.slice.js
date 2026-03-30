import { create } from "zustand";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "./cart.api";

const extractCart = (res) => res.data?.data ?? res.data ?? null;

const useCartStore = create((set, get) => ({
  // ─── Data ─────────────────────────────────────────────
  cart: null,

  // ─── Status ───────────────────────────────────────────
  loading: false,
  error: null,

  // ─── Fetch cart ───────────────────────────────────────
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getCart();
      set({ cart: extractCart(res), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Add item ─────────────────────────────────────────
  addItem: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const res = await addToCart({ productId, quantity });
      set({ cart: extractCart(res), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Update quantity ──────────────────────────────────
  updateItem: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      const res = await updateCartItem(productId, { quantity });
      set({ cart: extractCart(res), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Remove item ──────────────────────────────────────
  removeItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      const res = await removeFromCart(productId);
      set({ cart: extractCart(res), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Clear cart ───────────────────────────────────────
  clearAllItems: async () => {
    set({ loading: true, error: null });
    try {
      await clearCart();
      set({ cart: null, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Computed helpers ─────────────────────────────────
  getSubtotal: () => {
    const { cart } = get();
    if (!cart?.products?.length) return 0;
    return cart.products.reduce((sum, item) => {
      const price = item.product?.price ?? 0;
      return sum + price * item.quantity;
    }, 0);
  },

  getTotal: () => get().getSubtotal(),
}));

export default useCartStore;
