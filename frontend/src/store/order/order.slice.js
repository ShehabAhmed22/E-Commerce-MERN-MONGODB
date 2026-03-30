import { create } from "zustand";
import {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "./order.api";

const useOrderStore = create((set, get) => ({
  // ─── Data ─────────────────────────────────────────────
  orders: [],
  selectedOrder: null,

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
  setSelectedOrder: (o) => set({ selectedOrder: o }),
  clearSelectedOrder: () => set({ selectedOrder: null }),

  setSearch: (search) => {
    set({ search });
    get().fetchOrders({ page: 1, search });
  },

  setPage: (page) => {
    const { pagination, search } = get();
    if (page < 1 || page > pagination.totalPages) return;
    get().fetchOrders({ page, search });
  },

  // ─── Fetch all ────────────────────────────────────────
  fetchOrders: async (params = {}) => {
    const { pagination, search: storeSearch } = get();
    const {
      page = pagination.currentPage,
      limit = pagination.limit,
      search = storeSearch,
    } = params;

    set({ loading: true, error: null });
    try {
      const res = await getAllOrders({ page, limit, search });

      const isPaginated =
        res.data?.data?.orders !== undefined && res.data?.data?.meta;

      if (isPaginated) {
        const { orders, meta } = res.data.data;
        set({
          orders,
          pagination: {
            currentPage: meta.page ?? page,
            totalPages: meta.totalPages ?? 1,
            totalItems: meta.total ?? orders.length,
            limit: meta.limit ?? limit,
          },
          search,
          loading: false,
        });
      } else {
        const all = Array.isArray(res.data) ? res.data : [];
        set({
          orders: all,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: all.length,
            limit,
          },
          search,
          loading: false,
        });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Update status ────────────────────────────────────
  editOrder: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await updateOrder(id, data);
      set((s) => ({
        orders: s.orders.map((o) => (o._id === id ? res.data : o)),
        loading: false,
        selectedOrder: null,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Delete ───────────────────────────────────────────
  removeOrder: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteOrder(id);
      const { pagination, search, orders } = get();
      const newPage =
        orders.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;
      await get().fetchOrders({
        page: newPage,
        limit: pagination.limit,
        search,
      });
      set({ selectedOrder: null });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Create ───────────────────────────────────────────
  addOrder: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await createOrder(data);
      const { pagination, search } = get();
      await get().fetchOrders({
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useOrderStore;
