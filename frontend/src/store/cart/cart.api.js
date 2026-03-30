import axiosInstance from "../../requestMethod";

// GET user cart
export const getCart = () => axiosInstance.get("/cart");

// POST add product to cart
export const addToCart = (data) => axiosInstance.post("/cart", data);
// data: { productId, quantity }

// PUT update product quantity in cart
export const updateCartItem = (productId, data) =>
  axiosInstance.put(`/cart/${productId}`, data);
// data: { quantity }

// DELETE remove product from cart
export const removeFromCart = (productId) =>
  axiosInstance.delete(`/cart/${productId}`);

// DELETE clear entire cart
export const clearCart = () => axiosInstance.delete("/cart");

// POST apply coupon
export const applyCoupon = (code) =>
  axiosInstance.post("/cart/coupon", { code });

// DELETE remove coupon
export const removeCoupon = () => axiosInstance.delete("/cart/coupon");
