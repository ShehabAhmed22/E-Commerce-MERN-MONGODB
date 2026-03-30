import React from "react";
import { toast } from "sonner";
import { Trash2, Plus, Minus, Loader2, ShoppingCart } from "lucide-react";

import useCartStore from "../../../../store/cart/cart.slice";
import "./CartProducts.css";

function CartProducts() {
  const { cart, loading, updateItem, removeItem, clearAllItems } =
    useCartStore();
  const products = cart?.products ?? [];

  const handleQtyChange = async (productId, current, delta) => {
    const next = current + delta;
    if (next < 1) return;
    try {
      await updateItem(productId, next);
    } catch {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success("Item removed");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleClear = async () => {
    try {
      await clearAllItems();
      toast.success("Cart cleared");
    } catch {
      toast.error("Failed to clear cart");
    }
  };

  if (loading && !products.length) {
    return (
      <div className="cp-skeleton">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="cp-skeleton__row">
            <div className="cp-skeleton__img" />
            <div className="cp-skeleton__lines">
              <div className="cp-skeleton__line cp-skeleton__line--wide" />
              <div className="cp-skeleton__line cp-skeleton__line--narrow" />
            </div>
            <div className="cp-skeleton__pill" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="cp-empty">
        <div className="cp-empty__icon">
          <ShoppingCart size={32} color="#d1d5db" />
        </div>
        <p className="cp-empty__title">Your cart is empty</p>
        <p className="cp-empty__sub">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="cp-wrap">
      {/* Header */}
      <div className="cp-header">
        <h2 className="cp-header__title">
          Cart
          <span className="cp-header__count">{products.length}</span>
        </h2>
        <button
          onClick={handleClear}
          disabled={loading}
          className="cp-clear-btn"
        >
          {loading ? (
            <Loader2 size={14} className="cp-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="cp-list">
        {products.map((item) => {
          const product = item.product;
          const subtotal = (product?.price ?? 0) * item.quantity;

          return (
            <div key={item._id ?? product?._id} className="cp-item">
              {/* Image */}
              <div className="cp-item__img-wrap">
                {product?.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cp-item__img"
                  />
                ) : (
                  <ShoppingCart size={18} color="#d1d5db" />
                )}
              </div>

              {/* Info */}
              <div className="cp-item__info">
                <p className="cp-item__name">{product?.name ?? "—"}</p>
                <p className="cp-item__price">${product?.price?.toFixed(2)}</p>
              </div>

              {/* Qty controls */}
              <div className="cp-item__qty">
                <button
                  className="cp-qty-btn"
                  onClick={() =>
                    handleQtyChange(product._id, item.quantity, -1)
                  }
                  disabled={loading || item.quantity <= 1}
                >
                  <Minus size={13} />
                </button>
                <span className="cp-qty-value">{item.quantity}</span>
                <button
                  className="cp-qty-btn"
                  onClick={() => handleQtyChange(product._id, item.quantity, 1)}
                  disabled={loading}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Subtotal */}
              <p className="cp-item__subtotal">${subtotal.toFixed(2)}</p>

              {/* Remove */}
              <button
                className="cp-item__remove"
                onClick={() => handleRemove(product._id)}
                disabled={loading}
                title="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CartProducts;
