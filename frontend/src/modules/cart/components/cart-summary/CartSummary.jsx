import { Loader2, ShoppingBag, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import useCartStore from "../../../../store/cart/cart.slice";
import useOrderStore from "../../../../store/order/order.slice";
import "./CartSummary.css";

function CartSummary() {
  // ── Cart store ──────────────────────────────────────────────────────────────
  const {
    cart,
    loading: cartLoading,
    getSubtotal,
    getTotal,
    clearAllItems,
  } = useCartStore();

  // ── Order store ─────────────────────────────────────────────────────────────
  const { addOrder, loading: orderLoading } = useOrderStore();

  // ── Derived cart values ─────────────────────────────────────────────────────
  const subtotal = getSubtotal();
  const total = getTotal();
  const cartProducts = cart?.products ?? [];
  const itemCount = cartProducts.reduce((s, i) => s + i.quantity, 0);

  // ── Checkout ────────────────────────────────────────────────────────────────
  const onCheckout = async () => {
    if (!cartProducts.length) {
      toast.error("Your cart is empty");
      return;
    }

    const items = cartProducts.map((item) => ({
      product: item.product?._id ?? item.product,
      quantity: item.quantity,
    }));

    try {
      await addOrder({ items });
      await clearAllItems();
      toast.success("Order placed successfully! 🎉");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="cs-wrap">
      <h2 className="cs-title">Order Summary</h2>

      {/* Line items */}
      <div className="cs-lines">
        <div className="cs-line">
          <span className="cs-line__label">
            Subtotal
            <span className="cs-line__count">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </span>
          <span className="cs-line__value">${subtotal.toFixed(2)}</span>
        </div>

        <div className="cs-line">
          <span className="cs-line__label">Shipping</span>
          <span className="cs-line__value cs-line__value--free">Free</span>
        </div>
      </div>

      <div className="cs-divider" />

      {/* Total */}
      <div className="cs-total">
        <span className="cs-total__label">Total</span>
        <span className="cs-total__value">${total.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={cartLoading || orderLoading || !itemCount}
        className="cs-checkout-btn"
      >
        {orderLoading || cartLoading ? (
          <Loader2 size={16} className="cs-spin" />
        ) : (
          <ShoppingBag size={16} />
        )}
        {orderLoading
          ? "Placing Order…"
          : cartLoading
            ? "Processing…"
            : "Proceed to Checkout"}
        {!orderLoading && !cartLoading && (
          <ChevronRight size={16} className="cs-checkout-btn__arrow" />
        )}
      </button>

      <p className="cs-secure">🔒 Secure checkout — SSL encrypted</p>
    </div>
  );
}

export default CartSummary;
