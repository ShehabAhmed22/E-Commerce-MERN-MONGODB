import express from "express";
import {
  authenticate,
  authorize,
} from "../../../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  updateOrder,
  cancelOrder,
  getAllOrders,
  getOrderStats,
} from "../controller/order.controller.js";

const router = express.Router();

// User routes
router.post("/", authenticate, createOrder);
router.get("/my", authenticate, getMyOrders);
router.put("/:id", authenticate, updateOrder);
router.put("/:id/cancel", authenticate, cancelOrder);

// Admin routes
router.get("/", authenticate, getAllOrders);
router.get("/stats", authenticate, authorize("admin"), getOrderStats);

export default router;
