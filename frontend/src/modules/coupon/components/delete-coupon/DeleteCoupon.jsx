import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import useCouponStore from "../../../../store/coupon/coupon.slice";
import "./DeleteCoupon.css";

function DeleteCoupon({ coupon }) {
  const [isOpen, setIsOpen] = useState(false);
  const { removeCoupon, loading } = useCouponStore();

  const handleDelete = async () => {
    try {
      await removeCoupon(coupon._id);
      toast.success("Coupon deleted successfully!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete coupon");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="dc-icon-btn"
        title="Delete coupon"
      >
        <Trash2 size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Coupon"
        size="sm"
      >
        <div className="dc-body">
          <div className="dc-icon-wrap">
            <AlertTriangle size={26} className="dc-warning-icon" />
          </div>
          <div className="dc-text">
            <p className="dc-text__title">Delete &quot;{coupon?.code}&quot;?</p>
            <p className="dc-text__sub">
              This coupon will be permanently removed and can no longer be used.
            </p>
          </div>
          <div className="dc-actions">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="dc-btn dc-btn--secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="dc-btn dc-btn--danger"
            >
              {loading && <Loader2 size={15} className="dc-spinner" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteCoupon;
