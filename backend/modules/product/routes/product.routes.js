import express from "express";
import {
  authenticate,
  authorize,
} from "../../../middlewares/auth.middleware.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/", authenticate, authorize("admin"), createProduct);
router.put("/:id", authenticate, authorize("admin"), updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default router;
