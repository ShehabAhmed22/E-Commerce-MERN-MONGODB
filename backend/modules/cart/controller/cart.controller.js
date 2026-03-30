import Cart from "../../../models/Cart.js";
import ApiError from "../../../utils/apiError.js";
import ApiResponse from "../../../utils/apiResponse.js";

// ─── Add or update cart item ───────────────────────────────────────────────
// POST /cart    body: { productId, quantity }
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) return next(new ApiError(400, "productId is required"));

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [{ product: productId, quantity }],
      });
    } else {
      const index = cart.products.findIndex(
        (i) => i.product.toString() === productId,
      );

      if (index > -1) {
        cart.products[index].quantity += quantity; // increment if exists
      } else {
        cart.products.push({ product: productId, quantity }); // add new
      }

      await cart.save();
    }

    await cart.populate("products.product");
    res.json(new ApiResponse(200, cart, "Cart updated successfully"));
  } catch (err) {
    next(err);
  }
};

// ─── Get user cart ─────────────────────────────────────────────────────────
// GET /cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product",
    );
    res.json(new ApiResponse(200, cart || { products: [] }));
  } catch (err) {
    next(err);
  }
};

// ─── Update item quantity ──────────────────────────────────────────────────
// PUT /cart/:productId    body: { quantity }
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return next(new ApiError(400, "Quantity must be at least 1"));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new ApiError(404, "Cart not found"));

    const index = cart.products.findIndex(
      (i) => i.product.toString() === productId,
    );
    if (index === -1) return next(new ApiError(404, "Product not in cart"));

    cart.products[index].quantity = quantity;
    await cart.save();
    await cart.populate("products.product");

    res.json(new ApiResponse(200, cart, "Quantity updated successfully"));
  } catch (err) {
    next(err);
  }
};

// ─── Remove single item ────────────────────────────────────────────────────
// DELETE /cart/:productId   ✅ productId in URL params
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params; // ✅ from URL not body

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new ApiError(404, "Cart not found"));

    cart.products = cart.products.filter(
      (i) => i.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate("products.product");

    res.json(new ApiResponse(200, cart, "Item removed successfully"));
  } catch (err) {
    next(err);
  }
};

// ─── Clear entire cart ─────────────────────────────────────────────────────
// DELETE /cart   ✅ same base route — no /clear suffix
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { products: [] },
      { new: true },
    );
    res.json(new ApiResponse(200, cart, "Cart cleared successfully"));
  } catch (err) {
    next(err);
  }
};
