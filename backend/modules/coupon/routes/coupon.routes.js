import express from "express";
import {
  authenticate,
  authorize,
} from "../../../middlewares/auth.middleware.js";
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from "../controller/coupon.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getCoupons);
router.post("/", authenticate, authenticate, authorize("admin"), createCoupon);
router.put("/:id", authenticate, authorize("admin"), updateCoupon);
router.delete("/:id", authenticate, authorize("admin"), deleteCoupon);

export default router;
