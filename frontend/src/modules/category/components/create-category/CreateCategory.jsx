import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Loader2, ImagePlus, X } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { categorySchema } from "../../../../validation/category/category.validation";
import useCategoryStore from "../../../../store/category/category.slice";
import "./createCategory.css";

function CreateCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const { addCategory, loading } = useCategoryStore();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(categorySchema) });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    try {
      await addCategory({ name: data.name }); // name فقط
      toast.success("Category created successfully!");
      reset();
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category");
    }
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    setIsOpen(false);
  };

  const { ref: rhfRef, ...imageRegister } = register("image", {
    onChange: handleImageChange,
  });

  return (
    <>
      <button className="btn-create" onClick={() => setIsOpen(true)}>
        <Plus size={16} />
        New Category
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Create Category">
        <form className="create-form" onSubmit={handleSubmit(onSubmit)}>
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
              Category Image{" "}
              <span className="form-label-optional">(optional)</span>
            </label>

            {preview ? (
              <div className="image-preview-wrapper">
                <img src={preview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  className="image-preview-remove"
                  onClick={clearImage}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="image-upload-zone" htmlFor="category-image">
                <ImagePlus size={24} className="image-upload-icon" />
                <span className="image-upload-text">Click to upload image</span>
                <span className="image-upload-hint">
                  PNG, JPG, WEBP up to 5MB
                </span>
              </label>
            )}

            <input
              id="category-image"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="image-input-hidden"
              {...imageRegister}
              ref={(el) => {
                rhfRef(el);
                fileInputRef.current = el;
              }}
            />
            {errors.image && (
              <p className="form-error">{errors.image.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading && <Loader2 size={15} className="spin" />}
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CreateCategory;
