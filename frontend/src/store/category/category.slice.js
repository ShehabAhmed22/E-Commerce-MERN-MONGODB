import { create } from "zustand";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.api";

const useCategoryStore = create((set, get) => ({
  // ─── Data ─────────────────────────────────────────────
  categories: [],
  selectedCategory: null,

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
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearSelectedCategory: () => set({ selectedCategory: null }),

  setSearch: (search) => {
    set({ search });
    // Reset to page 1 on new search
    get().fetchCategories({ page: 1, search });
  },

  setPage: (page) => {
    const { pagination, search } = get();
    if (page < 1 || page > pagination.totalPages) return;
    get().fetchCategories({ page, search });
  },

  setLimit: (limit) => {
    const { search } = get();
    get().fetchCategories({ page: 1, limit, search });
  },

  // ─── Fetch all (with pagination) ──────────────────────
  fetchCategories: async (params = {}) => {
    const { pagination, search: storeSearch } = get();
    const {
      page = pagination.currentPage,
      limit = pagination.limit,
      search = storeSearch,
    } = params;

    set({ loading: true, error: null });
    try {
      const res = await getAllCategories({ page, limit, search });

      // Your API shape: { data: { categories: [], meta: {} } }
      const isPaginated =
        res.data?.data?.categories !== undefined && res.data?.data?.meta;

      if (isPaginated) {
        const { categories, meta } = res.data.data;
        set({
          categories,
          pagination: {
            currentPage: meta.page ?? page,
            totalPages: meta.totalPages ?? 1,
            totalItems: meta.total ?? categories.length,
            limit: meta.limit ?? limit,
          },
          search,
          loading: false,
        });
      } else {
        // Fallback: plain array
        const all = Array.isArray(res.data) ? res.data : [];
        set({
          categories: all,
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
  addCategory: async (formData) => {
    set({ loading: true, error: null });
    try {
      await createCategory(formData);
      // Refresh current page so totals stay accurate
      const { pagination, search } = get();
      await get().fetchCategories({
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
  editCategory: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const res = await updateCategory(id, formData);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? res.data : cat,
        ),
        loading: false,
        selectedCategory: null,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // ─── Delete ───────────────────────────────────────────
  removeCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCategory(id);
      const { pagination, search, categories } = get();
      // If last item on a page > 1, go back one page
      const newPage =
        categories.length === 1 && pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;
      await get().fetchCategories({
        page: newPage,
        limit: pagination.limit,
        search,
      });
      set({ selectedCategory: null });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));

export default useCategoryStore;
