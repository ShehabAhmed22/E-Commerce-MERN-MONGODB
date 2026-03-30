import express from "express";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controller/cart.controller.js";

const router = express.Router();

router.use(authenticate);

// ─── Must define specific routes BEFORE /:productId ───────────────────────
router.get("/", getCart); // GET    /cart
router.post("/", addToCart); // POST   /cart
router.put("/:productId", updateCartItem); // PUT    /cart/:productId
router.delete("/:productId", removeFromCart); // DELETE /cart/:productId  ✅ matches axiosInstance.delete(`/cart/${productId}`)
router.delete("/", clearCart); // DELETE /cart              ✅ matches axiosInstance.delete("/cart")

export default router;
