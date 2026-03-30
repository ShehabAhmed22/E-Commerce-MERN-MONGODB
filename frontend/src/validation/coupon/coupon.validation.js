import { z } from "zod";

// ── Create ────────────────────────────────────────────────────────────────────
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(30, "Code must be less than 30 characters")
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Only letters, numbers, _ and - allowed"),

  discount: z
    .string()
    .min(1, "Discount is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1 && Number(v) <= 100,
      "Discount must be between 1 and 100",
    ),

  discountType: z.enum(["percentage", "fixed"], {
    required_error: "Discount type is required",
  }),

  expiresAt: z
    .string()
    .min(1, "Expiration date is required")
    .refine(
      (v) => new Date(v) > new Date(),
      "Expiration date must be in the future",
    ),

  maxUses: z
    .string()
    .min(1, "Max uses is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1,
      "Max uses must be at least 1",
    ),

  isActive: z.boolean().default(true),
});

// ── Update (all optional except validation rules) ─────────────────────────────
export const couponUpdateSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(30, "Code must be less than 30 characters")
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]+$/, "Only letters, numbers, _ and - allowed"),

  discount: z
    .string()
    .min(1, "Discount is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1 && Number(v) <= 100,
      "Discount must be between 1 and 100",
    ),

  discountType: z.enum(["percentage", "fixed"], {
    required_error: "Discount type is required",
  }),

  expiresAt: z.string().min(1, "Expiration date is required"),

  maxUses: z
    .string()
    .min(1, "Max uses is required")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1,
      "Max uses must be at least 1",
    ),

  isActive: z.boolean(),
});
