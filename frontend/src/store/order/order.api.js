import axiosInstance from "../../requestMethod";

// GET all orders (admin)
export const getAllOrders = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const query = new URLSearchParams();
  query.set("page", page);
  query.set("limit", limit);
  if (search) query.set("search", search);
  return axiosInstance.get(`/orders?${query.toString()}`);
};

// GET single order
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);

// PUT update order status
export const updateOrder = (id, data) =>
  axiosInstance.put(`/orders/${id}`, data);

// DELETE order
export const deleteOrder = (id) => axiosInstance.delete(`/orders/${id}`);
// create order
export const createOrder = (data) => axiosInstance.post(`/orders`, data);
