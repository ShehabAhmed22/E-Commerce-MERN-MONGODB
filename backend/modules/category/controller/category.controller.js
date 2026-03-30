import Category from "../../../models/Category.js";
import ApiError from "../../../utils/apiError.js";
import ApiResponse from "../../../utils/apiResponse.js";
import Pagination from "../../../utils/pagination.js";

/**
 *  @desc Create Category
 *  @route POST /api/v1/category
 *  @access Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, category, "Category created successfully"));
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc Get Categories
 *  @route GET /api/v1/category
 *  @access Public
 */
export const getCategories = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const total = await Category.countDocuments();
    const pagination = new Pagination({ page, limit, total });

    const categories = await Category.find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .sort({ createdAt: -1 });

    res.json(
      new ApiResponse(200, {
        categories,
        meta: pagination.getMeta(),
      }),
    );
  } catch (err) {
    next(err);
  }
};

/**
 *  @desc Get Category
 *  @route GET /api/v1/category/:id
 *  @access Public
 */
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(new ApiError(404, "Category not found"));
    res.json(new ApiResponse(200, category));
  } catch (err) {
    next(err);
  }
};

// Update Category (admin)
/**
 *
 * @desc Update Category
 * @route PUT /api/v1/category/:id
 * @access Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) return next(new ApiError(404, "Category not found"));

    res.json(new ApiResponse(200, category, "Category updated"));
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @desc Delete Category
 * @route DELETE /api/v1/category/:id
 * @access Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new ApiError(404, "Category not found"));
    res.json(new ApiResponse(200, category, "Category deleted"));
  } catch (err) {
    next(err);
  }
};
