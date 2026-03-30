import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import useProductStore from "../../../../store/product/product.slice";
import "./DeleteProduct.css";

function DeleteProduct({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const { removeProduct, loading } = useProductStore();

  const handleDelete = async () => {
    try {
      await removeProduct(product._id);
      toast.success("Product deleted successfully!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="dp-icon-btn"
        title="Delete product"
      >
        <Trash2 size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="dp-body">
          <div className="dp-icon-wrap">
            <AlertTriangle size={26} className="dp-warning-icon" />
          </div>

          <div className="dp-text">
            <p className="dp-text__title">
              Delete &quot;{product?.name}&quot;?
            </p>
            <p className="dp-text__sub">
              This action cannot be undone. The product will be permanently
              removed.
            </p>
          </div>

          <div className="dp-actions">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="dp-btn dp-btn--secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="dp-btn dp-btn--danger"
            >
              {loading && <Loader2 size={15} className="dp-spinner" />}
              {loading ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DeleteProduct;
