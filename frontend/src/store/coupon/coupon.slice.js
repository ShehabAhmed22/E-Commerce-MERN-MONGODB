import { create } from "zustand";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupon.api";

const useCouponStore = create((set, get) => ({
  // ─── Data ─────────────────────────────────────────────
  coupons: [],
  selectedCoupon: null,

  // ─── Pagination ───────────────────────────────────────
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },
  search: "",

  // ─── Status ───────────────────────────────────────────
  loading: false,
  error: null,

  // ─── Setters ──────────────────────────────────────────
  setSelectedCoupon: (c) => set({ selectedCoupon: c }),
  clearSelectedCoupon: () => set({ selectedCoupon: null }),

  setSearch: (search) => {
    set({ search });
    get().fetchCoupons({ page: 1, search });
  },

  setPage: (page) => {
    const { pagination, search } = get();
    if (page < 1 || page > pagination.totalPages) return;
    get().fetchCoupons({ page, search });
  },

  setLimit: (limit) => {
    const { search } = get();
    get().fetchCoupons({ page: 1, limit, search });
  },

  // ─── Fetch all ────────────────────────────────────────
  fetchCoupons: async (params = {}) => {
    const { pagination, search: storeSearch } = get();
    const {
      page = pagination.currentPage,
      limit = pagination.limit,
      search = storeSearch,
    } = params;

    set({ loading: true, error: null });
    try {
      const res = await getAllCoupons({ page, limit, search });

      // Your API returns: { statusCode, data: [...], message, success }
      const all = Array.isArray(res.data?.data) ? res.data.data : [];

      set({
        coupons: all,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: all.length,
          limit,
        },
        search,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Create ───────────────────────────────────────────
  addCoupon: async (data) => {
    set({ loading: true, error: null });
    try {
      await createCoupon(data);
      const { pagination, search } = get();
      await get().fetchCoupons({
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Update ───────────────────────────────────────────
  editCoupon: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await updateCoupon(id, data);
      set((s) => ({
        coupons: s.coupons.map((c) => (c._id === id ? res.data : c)),
        loading: false,
        selectedCoupon: null,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Delete ───────────────────────────────────────────
  removeCoupon: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCoupon(id);
      const { pagination, search, coupons } = get();
      const newPage =
        coupons.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;
      await get().fetchCoupons({
        page: newPage,
        limit: pagination.limit,
        search,
      });
      set({ selectedCoupon: null });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useCouponStore;
