import Order from "../../../models/Order.js";
import Product from "../../../models/Product.js";
import Cart from "../../../models/Cart.js";
import ApiError from "../../../utils/apiError.js";
import ApiResponse from "../../../utils/apiResponse.js";
import Pagination from "../../../utils/pagination.js";

// Create Order
export const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    // Build products array matching Order schema + calculate total
    let totalPrice = 0;
    const products = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return next(new ApiError(404, "Product not found"));
      totalPrice += product.price * item.quantity;
      products.push({
        product: item.product,
        quantity: item.quantity,
        productPrice: product.price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products,
      totalPrice,
      status: "pending",
    });

    // Clear the user's cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { products: [] } },
    );

    res
      .status(201)
      .json(new ApiResponse(201, order, "Order created successfully"));
  } catch (err) {
    next(err);
  }
};

// Get My Orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("products.product");
    res.json(new ApiResponse(200, orders));
  } catch (err) {
    next(err);
  }
};

// Update Order (e.g., status)
export const updateOrder = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ApiError(404, "Order not found"));

    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return next(new ApiError(403, "Forbidden"));
    }

    order.status = status || order.status;
    await order.save();

    res.json(new ApiResponse(200, order, "Order updated successfully"));
  } catch (err) {
    next(err);
  }
};

// Cancel Order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ApiError(404, "Order not found"));
    if (order.user.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, "Forbidden"));
    }
    order.status = "cancelled";
    await order.save();
    res.json(new ApiResponse(200, order, "Order cancelled successfully"));
  } catch (err) {
    next(err);
  }
};

// Get All Orders (Admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const total = await Order.countDocuments();
    const pagination = new Pagination({ page, limit, total });

    const orders = await Order.find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 })
      .populate("products.product")
      .populate("user", "name email");

    res.json(new ApiResponse(200, { orders, meta: pagination.getMeta() }));
  } catch (err) {
    next(err);
  }
};

// Order Stats (Admin)
export const getOrderStats = async (req, res, next) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.json(new ApiResponse(200, stats));
  } catch (err) {
    next(err);
  }
};
