import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Loader2, ChevronDown, Tag } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { couponSchema } from "../../../../validation/coupon/coupon.validation";
import useCouponStore from "../../../../store/coupon/coupon.slice";
import "./CreateCoupon.css";

function CreateCoupon() {
  const [isOpen, setIsOpen] = useState(false);
  const { addCoupon, loading } = useCouponStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discountType: "percentage",
      isActive: true,
    },
  });

  const discountType = watch("discountType");
  const isActive = watch("isActive");

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
      await addCoupon(payload);
      toast.success("Coupon created successfully!");
      reset();
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="cc-trigger-btn">
        <Plus size={16} />
        New Coupon
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create Coupon"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="cc-form">
          <div className="cc-grid">
            {/* ── Code ── */}
            <div className="cc-field cc-field--full">
              <label className="cc-label">Coupon Code</label>
              <div className="cc-input-icon-wrap">
                <Tag size={14} className="cc-input-icon" />
                <input
                  {...register("code")}
                  placeholder="e.g. SUMMER20"
                  style={{ textTransform: "uppercase" }}
                  className={`cc-input cc-input--icon ${errors.code ? "cc-input--error" : ""}`}
                />
              </div>
              {errors.code && <p className="cc-error">{errors.code.message}</p>}
            </div>

            {/* ── Discount Type ── */}
            <div className="cc-field">
              <label className="cc-label">Type</label>
              <div className="cc-select-wrap">
                <select
                  {...register("discountType")}
                  className={`cc-input cc-select ${errors.discountType ? "cc-input--error" : ""}`}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed ($)</option>
                </select>
                <ChevronDown size={14} className="cc-select-icon" />
              </div>
              {errors.discountType && (
                <p className="cc-error">{errors.discountType.message}</p>
              )}
            </div>

            {/* ── Discount Value ── */}
            <div className="cc-field">
              <label className="cc-label">
                Discount {discountType === "percentage" ? "(%)" : "($)"}
              </label>
              <div className="cc-input-prefix-wrap">
                <span className="cc-input-prefix">
                  {discountType === "percentage" ? "%" : "$"}
                </span>
                <input
                  {...register("discount")}
                  type="number"
                  min="1"
                  max={discountType === "percentage" ? "100" : undefined}
                  step="0.01"
                  placeholder={discountType === "percentage" ? "20" : "10.00"}
                  className={`cc-input cc-input--prefix ${errors.discount ? "cc-input--error" : ""}`}
                />
              </div>
              {errors.discount && (
                <p className="cc-error">{errors.discount.message}</p>
              )}
            </div>

            {/* ── Expiry Date ── */}
            <div className="cc-field">
              <label className="cc-label">Expires At</label>
              <input
                {...register("expiresAt")}
                type="date"
                min={minDateStr}
                className={`cc-input ${errors.expiresAt ? "cc-input--error" : ""}`}
              />
              {errors.expiresAt && (
                <p className="cc-error">{errors.expiresAt.message}</p>
              )}
            </div>

            {/* ── Max Uses ── */}
            <div className="cc-field">
              <label className="cc-label">Max Uses</label>
              <input
                {...register("maxUses")}
                type="number"
                min="1"
                placeholder="1"
                className={`cc-input ${errors.maxUses ? "cc-input--error" : ""}`}
              />
              {errors.maxUses && (
                <p className="cc-error">{errors.maxUses.message}</p>
              )}
            </div>

            {/* ── Is Active ── */}
            <div className="cc-field cc-field--full">
              <button
                type="button"
                onClick={() => setValue("isActive", !isActive)}
                className={`cc-toggle ${isActive ? "cc-toggle--on" : "cc-toggle--off"}`}
              >
                <span className="cc-toggle__track">
                  <span className="cc-toggle__thumb" />
                </span>
                <span className="cc-toggle__label">
                  {isActive
                    ? "Active — coupon is usable"
                    : "Inactive — coupon is disabled"}
                </span>
              </button>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="cc-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cc-btn cc-btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cc-btn cc-btn--primary"
            >
              {loading && <Loader2 size={15} className="cc-spinner" />}
              {loading ? "Creating…" : "Create Coupon"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CreateCoupon;
