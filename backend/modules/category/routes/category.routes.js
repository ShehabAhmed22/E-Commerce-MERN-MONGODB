import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controller/category.controller.js";

import {
  authenticate,
  authorize,
} from "../../../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/:id", getCategory);

// Admin
router.post("/", authenticate, authorize("admin"), createCategory);
router.put("/:id", authenticate, authorize("admin"), updateCategory);
router.delete("/:id", authenticate, authorize("admin"), deleteCategory);

export default router;
