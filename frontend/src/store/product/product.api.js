import axiosInstance from "../../requestMethod";

// GET all products with optional pagination/search
export const getAllProducts = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const query = new URLSearchParams();
  query.set("page", page);
  query.set("limit", limit);
  if (search) query.set("search", search);
  return axiosInstance.get(`/products?${query.toString()}`);
};

// GET single product
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);

// POST create product (FormData for image upload)
export const createProduct = (data) => axiosInstance.post("/products", data);

// PUT update product
export const updateProduct = (id, data) =>
  axiosInstance.put(`/products/${id}`, data);

// DELETE product
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
