import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, ImagePlus, Loader2 } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { categoryUpdateSchema } from "../../../../validation/category/category.validation";
import useCategoryStore from "../../../../store/category/category.slice";
import "./updateCategory.css";

function UpdateCategory({ category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const { editCategory, loading } = useCategoryStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(categoryUpdateSchema) });

  const imageFile = watch("image");

  // Pre-fill form when modal opens
  useEffect(() => {
    if (isOpen && category) {
      reset({ name: category.name });
      setPreview(category.image || null);
    }
  }, [isOpen, category, reset]);

  // Live preview on new file pick
  useEffect(() => {
    if (imageFile?.[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    try {
      await editCategory(category._id, formData);
      toast.success("Category updated successfully!");
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update category");
    }
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="btn-edit-trigger"
        onClick={() => setIsOpen(true)}
        title="Edit category"
      >
        <Pencil size={16} />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Update Category">
        <form className="update-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="form-field">
            <label className="form-label">Category Name</label>
            <input
              {...register("name")}
              placeholder="e.g. Electronics"
              className={`form-input${errors.name ? " input-error" : ""}`}
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          {/* Image Upload */}
          <div className="form-field">
            <label className="form-label">
              Category Image
              <span className="form-label-hint">
                (optional — keep existing if empty)
              </span>
            </label>
            <label
              className={`upload-label${errors.image ? " upload-error" : ""}`}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="upload-preview" />
              ) : (
                <div className="upload-placeholder">
                  <ImagePlus size={28} />
                  <span>Click to change image</span>
                </div>
              )}
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                className="upload-input"
              />
            </label>
            {errors.image && (
              <p className="form-error">{errors.image.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading && <Loader2 size={15} className="spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default UpdateCategory;
