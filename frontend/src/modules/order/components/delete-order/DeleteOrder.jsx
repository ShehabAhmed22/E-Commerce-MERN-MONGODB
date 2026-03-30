import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import useOrderStore from "../../../../store/order/order.slice";
import "./DeleteOrder.css";

function DeleteOrder({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const { removeOrder, loading } = useOrderStore();

  const handleDelete = async () => {
    try {
      await removeOrder(order._id);
      toast.success("Order deleted successfully!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="do-icon-btn"
        title="Delete order"
      >
        <Trash2 size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Order"
        size="sm"
      >
        <div className="do-body">
          <div className="do-icon-wrap">
            <AlertTriangle size={26} className="do-warning-icon" />
          </div>
          <div className="do-text">
            <p className="do-text__title">Delete this order?</p>
            <p className="do-text__mono">{order?._id}</p>
            <p className="do-text__sub">This action cannot be undone.</p>
          </div>
          <div className="do-actions">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="do-btn do-btn--secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="do-btn do-btn--danger"
            >
              {loading && <Loader2 size={15} className="do-spin" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteOrder;
