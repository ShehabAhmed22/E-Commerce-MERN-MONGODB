import React, { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import useCategoryStore from "../../../../store/category/category.slice";
import "./DeleteCategory.css";

function DeleteCategory({ category }) {
  const [isOpen, setIsOpen] = useState(false);
  const { removeCategory, loading } = useCategoryStore();

  const handleDelete = async () => {
    try {
      await removeCategory(category._id);
      toast.success("Category deleted successfully!");
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <>
      <button
        className="btn-delete-trigger"
        onClick={() => setIsOpen(true)}
        title="Delete category"
      >
        <Trash2 size={16} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Delete Category"
        size="sm"
      >
        {/* Warning */}
        <div className="delete-warning">
          <div className="delete-icon-circle">
            <AlertTriangle color="#ef4444" size={26} />
          </div>
          <div>
            <p className="delete-warning-title">
              Delete &quot;{category?.name}&quot;?
            </p>
            <p className="delete-warning-desc">
              This action cannot be undone. The category will be permanently
              removed.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="delete-actions">
          <button
            type="button"
            className="btn-cancel-delete"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="btn-confirm-delete"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 size={15} className="spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default DeleteCategory;
