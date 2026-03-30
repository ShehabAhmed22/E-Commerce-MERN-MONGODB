import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ── Create ──────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),

  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Price must be a positive number",
    ),

  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0,
      "Quantity must be 0 or more",
    ),

  category: z.string().min(1, "Category is required"),

  image: z
    .any()
    .refine((f) => f?.length > 0, "Image is required")
    .refine((f) => f?.[0]?.size <= MAX_FILE_SIZE, "Max image size is 5 MB")
    .refine(
      (f) => ACCEPTED_TYPES.includes(f?.[0]?.type),
      "Only JPG, PNG, WEBP allowed",
    ),
});

// ── Update (image optional) ──────────────────────────────────────────────────
export const productUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),

  price: z
    .string()
    .min(1, "Price is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) > 0,
      "Price must be a positive number",
    ),

  quantity: z
    .string()
    .min(1, "Quantity is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0,
      "Quantity must be 0 or more",
    ),

  category: z.string().min(1, "Category is required"),

  image: z
    .any()
    .optional()
    .refine(
      (f) => !f?.length || f?.[0]?.size <= MAX_FILE_SIZE,
      "Max image size is 5 MB",
    )
    .refine(
      (f) => !f?.length || ACCEPTED_TYPES.includes(f?.[0]?.type),
      "Only JPG, PNG, WEBP allowed",
    ),
});
