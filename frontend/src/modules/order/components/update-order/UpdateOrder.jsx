import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Loader2, ChevronDown } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { orderUpdateSchema } from "../../../../validation/order/order.validation";
import useOrderStore from "../../../../store/order/order.slice";
import "./UpdateOrder.css";

const STATUS_OPTIONS = ["pending", "paid", "shipped", "delivered"];

export const STATUS_STYLES = {
  pending: "badge badge--amber",
  paid: "badge badge--blue",
  shipped: "badge badge--purple",
  delivered: "badge badge--green",
};

function UpdateOrder({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const { editOrder, loading } = useOrderStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(orderUpdateSchema) });

  useEffect(() => {
    if (isOpen && order) reset({ status: order.status });
  }, [isOpen, order, reset]);

  const onSubmit = async (data) => {
    try {
      await editOrder(order._id, data);
      toast.success("Order status updated!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update order");
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
        className="uo-icon-btn"
        title="Edit order"
      >
        <Pencil size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Update Order Status"
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="uo-form">
          {/* Order summary */}
          <div className="uo-info">
            <div className="uo-info__row">
              <span className="uo-info__label">Order ID</span>
              <span className="uo-info__value uo-info__value--mono">
                {order?._id}
              </span>
            </div>
            <div className="uo-info__row">
              <span className="uo-info__label">Total</span>
              <span className="uo-info__value uo-info__value--bold">
                ${order?.totalPrice?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status select */}
          <div className="uo-field">
            <label className="uo-label">Status</label>
            <div className="uo-select-wrap">
              <select
                {...register("status")}
                className={`uo-input uo-select ${errors.status ? "uo-input--error" : ""}`}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="uo-select-icon" />
            </div>
            {errors.status && (
              <p className="uo-error">{errors.status.message}</p>
            )}
          </div>

          <div className="uo-actions">
            <button
              type="button"
              onClick={handleClose}
              className="uo-btn uo-btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="uo-btn uo-btn--primary"
            >
              {loading && <Loader2 size={15} className="uo-spin" />}
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default UpdateOrder;
