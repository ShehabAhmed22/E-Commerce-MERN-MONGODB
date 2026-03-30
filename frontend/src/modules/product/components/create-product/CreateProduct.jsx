import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, ImagePlus, Loader2, ChevronDown } from "lucide-react";

import Modal from "../../../../components/modal/modal";
import { productSchema } from "../../../../validation/product/product.validation";
import useProductStore from "../../../../store/product/product.slice";
import useCategoryStore from "../../../../store/category/category.slice";
import upload from "../../../../upload"; // ← your cloudinary upload
import "./CreateProduct.css";

function CreateProduct() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { addProduct, loading: productLoading } = useProductStore();
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
  } = useForm({ resolver: zodResolver(productSchema) });

  const imageFile = watch("image");

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, categories.length, fetchCategories]);

  useEffect(() => {
    if (imageFile?.[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [imageFile]);

  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // Upload image to Cloudinary first, get back the URL
      const imageUrl = await upload(data.image[0]);

      if (!imageUrl) {
        toast.error("Image upload failed, please try again.");
        return;
      }

      // Now send plain JSON to your backend
      await addProduct({
        name: data.name,
        description: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),
        category: data.category,
        image: imageUrl, // ← Cloudinary URL string
      });

      toast.success("Product created successfully!");
      reset();
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    reset();
    setPreview(null);
    setIsOpen(false);
  };

  const isLoading = uploading || productLoading;

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="cp-trigger-btn">
        <Plus size={16} />
        New Product
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Create Product"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="cp-form">
          <div className="cp-grid">
            {/* ── Name ── */}
            <div className="cp-field cp-field--full">
              <label className="cp-label">Product Name</label>
              <input
                {...register("name")}
                placeholder="e.g. Wireless Headphones"
                className={`cp-input ${errors.name ? "cp-input--error" : ""}`}
              />
              {errors.name && <p className="cp-error">{errors.name.message}</p>}
            </div>

            {/* ── Price ── */}
            <div className="cp-field">
              <label className="cp-label">Price ($)</label>
              <div className="cp-input-prefix-wrap">
                <span className="cp-input-prefix">$</span>
                <input
                  {...register("price")}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={`cp-input cp-input--prefix ${errors.price ? "cp-input--error" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="cp-error">{errors.price.message}</p>
              )}
            </div>

            {/* ── Quantity ── */}
            <div className="cp-field">
              <label className="cp-label">Quantity</label>
              <input
                {...register("quantity")}
                type="number"
                min="0"
                placeholder="0"
                className={`cp-input ${errors.quantity ? "cp-input--error" : ""}`}
              />
              {errors.quantity && (
                <p className="cp-error">{errors.quantity.message}</p>
              )}
            </div>

            {/* ── Category ── */}
            <div className="cp-field cp-field--full">
              <label className="cp-label">Category</label>
              <div className="cp-select-wrap">
                <select
                  {...register("category")}
                  className={`cp-input cp-select ${errors.category ? "cp-input--error" : ""}`}
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
                <ChevronDown size={15} className="cp-select-icon" />
              </div>
              {errors.category && (
                <p className="cp-error">{errors.category.message}</p>
              )}
            </div>

            {/* ── Description ── */}
            <div className="cp-field cp-field--full">
              <label className="cp-label">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Describe the product…"
                className={`cp-input cp-textarea ${errors.description ? "cp-input--error" : ""}`}
              />
              {errors.description && (
                <p className="cp-error">{errors.description.message}</p>
              )}
            </div>

            {/* ── Image ── */}
            <div className="cp-field cp-field--full">
              <label className="cp-label">Product Image</label>
              <label
                className={`cp-upload ${errors.image ? "cp-upload--error" : ""}`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="cp-upload__preview"
                  />
                ) : (
                  <div className="cp-upload__placeholder">
                    <ImagePlus size={30} />
                    <span>Click to upload image</span>
                    <span className="cp-upload__hint">
                      PNG, JPG, WEBP — max 5 MB
                    </span>
                  </div>
                )}
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="cp-upload__input"
                />
              </label>
              {errors.image && (
                <p className="cp-error">{errors.image.message}</p>
              )}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="cp-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cp-btn cp-btn--secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cp-btn cp-btn--primary"
            >
              {isLoading && <Loader2 size={15} className="cp-spinner" />}
              {uploading
                ? "Uploading…"
                : productLoading
                  ? "Creating…"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CreateProduct;
