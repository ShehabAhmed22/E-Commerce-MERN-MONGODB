import axiosInstance from "../../requestMethod";

// GET all coupons with pagination + search
export const getAllCoupons = (params = {}) => {
  const { page = 1, limit = 10, search = "" } = params;
  const query = new URLSearchParams();
  query.set("page", page);
  query.set("limit", limit);
  if (search) query.set("search", search);
  return axiosInstance.get(`/coupons?${query.toString()}`);
};

// GET single coupon
export const getCouponById = (id) => axiosInstance.get(`/coupons/${id}`);

// POST create coupon
export const createCoupon = (data) => axiosInstance.post("/coupons", data);

// PUT update coupon
export const updateCoupon = (id, data) =>
  axiosInstance.put(`/coupons/${id}`, data);

// DELETE coupon
export const deleteCoupon = (id) => axiosInstance.delete(`/coupons/${id}`);
