import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Loader2, ChevronDown, Tag } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { couponUpdateSchema } from "../../../../validation/coupon/coupon.validation";
import useCouponStore from "../../../../store/coupon/coupon.slice";
import "./UpdateCoupon.css";

function UpdateCoupon({ coupon }) {
  const [isOpen, setIsOpen] = useState(false);
  const { editCoupon, loading } = useCouponStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponUpdateSchema),
    defaultValues: { discountType: "percentage", isActive: true },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");

  // Pre-fill on open
  useEffect(() => {
    if (isOpen && coupon) {
      // Format date for input[type=date]
      const dateStr = coupon.expiresAt
        ? new Date(coupon.expiresAt).toISOString().split("T")[0]
        : "";

      reset({
        code: coupon.code,
        discount: String(coupon.discount),
        discountType: coupon.discountType,
        expiresAt: dateStr,
        maxUses: String(coupon.maxUses),
        isActive: coupon.isActive,
      });
    }
  }, [isOpen, coupon, reset]);

  const onSubmit = async (data) => {
    const payload = {
      code: data.code.toUpperCase(),
      discount: Number(data.discount),
      discountType: data.discountType,
      expiresAt: new Date(data.expiresAt).toISOString(),
      maxUses: Number(data.maxUses),
      isActive: data.isActive,
    };

    try {
      await editCoupon(coupon._id, payload);
      toast.success("Coupon updated successfully!");
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update coupon");
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="uc-icon-btn"
        title="Edit coupon"
      >
        <Pencil size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Update Coupon"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="uc-form">
          <div className="uc-grid">
            {/* ── Code ── */}
            <div className="uc-field uc-field--full">
              <label className="uc-label">Coupon Code</label>
              <div className="uc-input-icon-wrap">
                <Tag size={14} className="uc-input-icon" />
                <input
                  {...register("code")}
                  placeholder="e.g. SUMMER20"
                  style={{ textTransform: "uppercase" }}
                  className={`uc-input uc-input--icon ${errors.code ? "uc-input--error" : ""}`}
                />
              </div>
              {errors.code && <p className="uc-error">{errors.code.message}</p>}
            </div>

            {/* ── Type ── */}
            <div className="uc-field">
              <label className="uc-label">Type</label>
              <div className="uc-select-wrap">
                <select
                  {...register("discountType")}
                  className={`uc-input uc-select ${errors.discountType ? "uc-input--error" : ""}`}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
                <ChevronDown size={14} className="uc-select-icon" />
              </div>
              {errors.discountType && (
                <p className="uc-error">{errors.discountType.message}</p>
              )}
            </div>

            {/* ── Discount ── */}
            <div className="uc-field">
              <label className="uc-label">
                Discount {discountType === "percentage" ? "(%)" : "($)"}
              </label>
              <div className="uc-input-prefix-wrap">
                <span className="uc-input-prefix">
                  {discountType === "percentage" ? "%" : "$"}
                </span>
                <input
                  {...register("discount")}
                  type="number"
                  min="1"
                  max={discountType === "percentage" ? "100" : undefined}
                  step="0.01"
                  placeholder={discountType === "percentage" ? "20" : "10.00"}
                  className={`uc-input uc-input--prefix ${errors.discount ? "uc-input--error" : ""}`}
                />
              </div>
              {errors.discount && (
                <p className="uc-error">{errors.discount.message}</p>
              )}
            </div>

            {/* ── Expiry ── */}
            <div className="uc-field">
              <label className="uc-label">Expires At</label>
              <input
                {...register("expiresAt")}
                type="date"
                className={`uc-input ${errors.expiresAt ? "uc-input--error" : ""}`}
              />
              {errors.expiresAt && (
                <p className="uc-error">{errors.expiresAt.message}</p>
              )}
            </div>

            {/* ── Max Uses ── */}
            <div className="uc-field">
              <label className="uc-label">Max Uses</label>
              <input
                {...register("maxUses")}
                type="number"
                min="1"
                placeholder="1"
                className={`uc-input ${errors.maxUses ? "uc-input--error" : ""}`}
              />
              {errors.maxUses && (
                <p className="uc-error">{errors.maxUses.message}</p>
              )}
            </div>

            {/* ── Is Active ── */}
            <div className="uc-field uc-field--full">
              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                className={`uc-toggle ${isActive ? "uc-toggle--on" : "uc-toggle--off"}`}
              >
                <span className="uc-toggle__track">
                  <span className="uc-toggle__thumb" />
                </span>
                <span className="uc-toggle__label">
                  {isActive
                    ? "Active — coupon is usable"
                    : "Inactive — coupon is disabled"}
                </span>
              </button>
            </div>
          </div>

          <div className="uc-actions">
            <button
              type="button"
              onClick={handleClose}
              className="uc-btn uc-btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="uc-btn uc-btn--primary"
            >
              {loading && <Loader2 size={15} className="uc-spinner" />}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default UpdateCoupon;
