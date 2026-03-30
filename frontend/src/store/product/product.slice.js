import { create } from "zustand";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.api";

const useProductStore = create((set, get) => ({
  // ─── Data ─────────────────────────────────────────────
  products: [],
  selectedProduct: null,

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
  setSelectedProduct: (p) => set({ selectedProduct: p }),
  clearSelectedProduct: () => set({ selectedProduct: null }),

  setSearch: (search) => {
    set({ search });
    get().fetchProducts({ page: 1, search });
  },

  setPage: (page) => {
    const { pagination, search } = get();
    if (page < 1 || page > pagination.totalPages) return;
    get().fetchProducts({ page, search });
  },

  setLimit: (limit) => {
    const { search } = get();
    get().fetchProducts({ page: 1, limit, search });
  },

  // ─── Fetch all (with pagination) ──────────────────────
  fetchProducts: async (params = {}) => {
    const { pagination, search: storeSearch } = get();
    const {
      page = pagination.currentPage,
      limit = pagination.limit,
      search = storeSearch,
    } = params;

    set({ loading: true, error: null });
    try {
      const res = await getAllProducts({ page, limit, search });

      // Support paginated shape: { data: { products: [], meta: {} } }
      const isPaginated =
        res.data?.data?.products !== undefined && res.data?.data?.meta;

      if (isPaginated) {
        const { products, meta } = res.data.data;
        set({
          products,
          pagination: {
            currentPage: meta.page ?? page,
            totalPages: meta.totalPages ?? 1,
            totalItems: meta.total ?? products.length,
            limit: meta.limit ?? limit,
          },
          search,
          loading: false,
        });
      } else {
        // Fallback: plain array
        const all = Array.isArray(res.data) ? res.data : [];
        set({
          products: all,
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

  // ─── Create ───────────────────────────────────────────
  addProduct: async (formData) => {
    set({ loading: true, error: null });
    try {
      await createProduct(formData);
      const { pagination, search } = get();
      await get().fetchProducts({
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
  editProduct: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const res = await updateProduct(id, formData);
      set((s) => ({
        products: s.products.map((p) => (p._id === id ? res.data : p)),
        loading: false,
        selectedProduct: null,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Delete ───────────────────────────────────────────
  removeProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(id);
      const { pagination, search, products } = get();
      const newPage =
        products.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;
      await get().fetchProducts({
        page: newPage,
        limit: pagination.limit,
        search,
      });
      set({ selectedProduct: null });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useProductStore;
