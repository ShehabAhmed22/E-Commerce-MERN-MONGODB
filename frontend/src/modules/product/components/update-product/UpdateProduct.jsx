import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, ImagePlus, Loader2, ChevronDown } from "lucide-react";

import Modal from "../../../../components/modal/modal";

import { productUpdateSchema } from "../../../../validation/product/product.validation";
import useProductStore from "../../../../store/product/product.slice";
import useCategoryStore from "../../../../store/category/category.slice"; // ← real store
import "./UpdateProduct.css";

function UpdateProduct({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const { editProduct, loading: productLoading } = useProductStore();
  const {
    categories,
    fetchCategories,
    loading: catLoading,
  } = useCategoryStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productUpdateSchema) });

  const imageFile = watch("image");

  /* Pre-fill when modal opens */
  useEffect(() => {
    if (isOpen && product) {
      reset({
        name: product.name,
        description: product.description,
        price: String(product.price),
        quantity: String(product.quantity),
        // handle both populated object and raw id
        category: product.category?._id || product.category || "",
      });
      setPreview(product.image || null);

      // Fetch categories if store is empty
      if (categories.length === 0) fetchCategories();
    }
  }, [isOpen, product, reset, categories.length, fetchCategories]);

  /* Live preview on new file pick */
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
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("quantity", data.quantity);
    formData.append("category", data.category);
    if (data.image?.[0]) formData.append("image", data.image[0]);

    try {
      await editProduct(product._id, formData);
      toast.success("Product updated successfully!");
      handleClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update product");
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
        onClick={() => setIsOpen(true)}
        className="up-icon-btn"
        title="Edit product"
      >
        <Pencil size={15} />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Update Product"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="up-form">
          <div className="up-grid">
            {/* ── Name ── */}
            <div className="up-field up-field--full">
              <label className="up-label">Product Name</label>
              <input
                {...register("name")}
                placeholder="e.g. Wireless Headphones"
                className={`up-input ${errors.name ? "up-input--error" : ""}`}
              />
              {errors.name && <p className="up-error">{errors.name.message}</p>}
            </div>

            {/* ── Price ── */}
            <div className="up-field">
              <label className="up-label">Price ($)</label>
              <div className="up-input-prefix-wrap">
                <span className="up-input-prefix">$</span>
                <input
                  {...register("price")}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`up-input up-input--prefix ${errors.price ? "up-input--error" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="up-error">{errors.price.message}</p>
              )}
            </div>

            {/* ── Quantity ── */}
            <div className="up-field">
              <label className="up-label">Quantity</label>
              <input
                {...register("quantity")}
                type="number"
                min="0"
                placeholder="0"
                className={`up-input ${errors.quantity ? "up-input--error" : ""}`}
              />
              {errors.quantity && (
                <p className="up-error">{errors.quantity.message}</p>
              )}
            </div>

            {/* ── Category ── */}
            <div className="up-field up-field--full">
              <label className="up-label">Category</label>
              <div className="up-select-wrap">
                <select
                  {...register("category")}
                  className={`up-input up-select ${errors.category ? "up-input--error" : ""}`}
                  disabled={catLoading}
                >
                  <option value="">
                    {catLoading ? "Loading categories…" : "Select a category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} className="up-select-icon" />
              </div>
              {errors.category && (
                <p className="up-error">{errors.category.message}</p>
              )}
            </div>

            {/* ── Description ── */}
            <div className="up-field up-field--full">
              <label className="up-label">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe the product…"
                className={`up-input up-textarea ${errors.description ? "up-input--error" : ""}`}
              />
              {errors.description && (
                <p className="up-error">{errors.description.message}</p>
              )}
            </div>

            {/* ── Image ── */}
            <div className="up-field up-field--full">
              <label className="up-label">
                Product Image
                <span className="up-label-hint">
                  (leave empty to keep current)
                </span>
              </label>
              <label
                className={`up-upload ${errors.image ? "up-upload--error" : ""}`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="up-upload__preview"
                  />
                ) : (
                  <div className="up-upload__placeholder">
                    <ImagePlus size={30} />
                    <span>Click to change image</span>
                  </div>
                )}
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="up-upload__input"
                />
              </label>
              {errors.image && (
                <p className="up-error">{errors.image.message}</p>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="up-actions">
            <button
              type="button"
              onClick={handleClose}
              className="up-btn up-btn--secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={productLoading}
              className="up-btn up-btn--primary"
            >
              {productLoading && <Loader2 size={15} className="up-spinner" />}
              {productLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default UpdateProduct;
