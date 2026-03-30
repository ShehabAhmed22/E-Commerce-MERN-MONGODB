import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },

    discount: {
      type: Number,
      required: [true, "Discount is required"],
      min: [1, "Discount must be at least 1"],
      max: [100, "Discount cannot exceed 100"],
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },

    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },

    maxUses: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// check if coupon is valid
couponSchema.methods.isValid = function () {
  return (
    this.isActive &&
    this.expiresAt > Date.now() &&
    this.usedCount < this.maxUses
  );
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
