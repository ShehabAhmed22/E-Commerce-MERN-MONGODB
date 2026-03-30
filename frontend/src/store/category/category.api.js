import axiosInstance from "../../requestMethod";

// GET all categories with pagination
// params: { page = 1, limit = 10, search = "" }
export const getAllCategories = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const query = new URLSearchParams();
  query.set("page", page);
  query.set("limit", limit);
  if (search) query.set("search", search);
  return axiosInstance.get(`/categories?${query.toString()}`);
};

// GET single category
export const getCategoryById = (id) => axiosInstance.get(`/categories/${id}`);

// POST create category (FormData for image upload)
export const createCategory = (data) => axiosInstance.post("/categories", data);

// PUT update category
export const updateCategory = (id, data) =>
  axiosInstance.put(`/categories/${id}`, data);

// DELETE category
export const deleteCategory = (id) => axiosInstance.delete(`/categories/${id}`);
