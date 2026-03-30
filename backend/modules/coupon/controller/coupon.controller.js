import Coupon from "../../../models/Coupon.js";
import ApiError from "../../../utils/apiError.js";
import ApiResponse from "../../../utils/apiResponse.js";

// Create coupon (Admin)
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, coupon, "Coupon created successfully"));
  } catch (err) {
    next(err);
  }
};

// Get all coupons (Admin)
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(new ApiResponse(200, coupons));
  } catch (err) {
    next(err);
  }
};

// Update coupon (Admin)
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coupon) return next(new ApiError(404, "Coupon not found"));
    res.json(new ApiResponse(200, coupon, "Coupon updated successfully"));
  } catch (err) {
    next(err);
  }
};

// Delete coupon (Admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return next(new ApiError(404, "Coupon not found"));
    res.json(new ApiResponse(200, coupon, "Coupon deleted successfully"));
  } catch (err) {
    next(err);
  }
};
