import Product from "../../../models/Product.js";
import ApiError from "../../../utils/apiError.js";
import ApiResponse from "../../../utils/apiResponse.js";
import Pagination from "../../../utils/pagination.js";

// Create Product (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (err) {
    next(err);
  }
};

// Get all products (Public)
export const getProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const total = await Product.countDocuments();
    const pagination = new Pagination({ page, limit, total });

    const products = await Product.find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    res.json(new ApiResponse(200, { products, meta: pagination.getMeta() }));
  } catch (err) {
    next(err);
  }
};

// Get single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError(404, "Product not found"));
    res.json(new ApiResponse(200, product));
  } catch (err) {
    next(err);
  }
};

// Update product (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return next(new ApiError(404, "Product not found"));
    res.json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (err) {
    next(err);
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return next(new ApiError(404, "Product not found"));
    res.json(new ApiResponse(200, product, "Product deleted successfully"));
  } catch (err) {
    next(err);
  }
};
