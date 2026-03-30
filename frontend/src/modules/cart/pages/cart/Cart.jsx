import React, { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { ShoppingCart, Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CartProducts from "../../components/cart-products/CartProducts";
import CartSummary from "../../components/cart-summary/CartSummary";
import useCartStore from "../../../../store/cart/cart.slice";
import "./cart.css";

function Cart() {
  const { fetchCart, loading, cart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart().catch(() => toast.error("Failed to load cart"));
  }, [fetchCart]);

  const handleCheckout = () => {
    toast.info("Redirecting to checkout…");
  };

  const products = cart?.products ?? [];
  const isEmpty = !loading && products.length === 0;

  return (
    <div className="cart-page">
      <Toaster position="top-right" richColors />

      <div className="cart-page__inner">
        {/* ── Page header ── */}
        <div className="cart-page__header">
          <button className="cart-page__back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={16} />
            Back to Shop
          </button>

          <div className="cart-page__header-main">
            <div className="cart-page__icon-wrap">
              <ShoppingCart size={20} color="#fff" />
            </div>
            <div>
              <h1 className="cart-page__title">Shopping Cart</h1>
              <p className="cart-page__subtitle">
                {loading
                  ? "Loading your cart…"
                  : products.length === 0
                    ? "Your cart is empty"
                    : `${products.length} item${products.length > 1 ? "s" : ""} in your cart`}
              </p>
            </div>
          </div>
        </div>

        {isEmpty ? (
          /* ── Empty state ── */
          <div className="cart-page__empty">
            <div className="cart-page__empty-icon">
              <ShoppingCart size={48} />
            </div>
            <h2 className="cart-page__empty-title">Your cart is empty</h2>
            <p className="cart-page__empty-sub">
              Add some products to get started
            </p>
            <button
              className="cart-page__empty-btn"
              onClick={() => navigate("/")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-page__layout">
            {/* ── LEFT: Products list + Order Details ── */}
            <div className="cart-page__left">
              {/* Products card */}
              <div className="cart-card">
                <CartProducts />
              </div>

              {/* Order Details card */}
              <div className="cart-card cart-order-details">
                <div className="cod__header">
                  <Package size={18} />
                  <h3 className="cod__title">Order Details</h3>
                </div>

                <div className="cod__list">
                  {products.map((item) => {
                    const p = item.product;
                    const subtotal = (p?.price ?? 0) * (item.quantity ?? 1);
                    return (
                      <div key={item._id ?? p?._id} className="cod__row">
                        {/* Image */}
                        <div className="cod__img-wrap">
                          {p?.image ? (
                            <img
                              src={p.image}
                              alt={p?.name}
                              className="cod__img"
                            />
                          ) : (
                            <div className="cod__no-img">🛍</div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="cod__info">
                          <p className="cod__name">{p?.name ?? "—"}</p>
                          {p?.category?.name && (
                            <p className="cod__cat">{p.category.name}</p>
                          )}
                          <p className="cod__unit-price">
                            ${p?.price?.toFixed(2)} × {item.quantity}
                          </p>
                        </div>

                        {/* Subtotal */}
                        <p className="cod__subtotal">${subtotal.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Totals inside order details */}
                <div className="cod__footer">
                  <div className="cod__footer-row">
                    <span>Subtotal</span>
                    <span>
                      $
                      {products
                        .reduce(
                          (s, i) =>
                            s + (i.product?.price ?? 0) * (i.quantity ?? 1),
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="cod__footer-row">
                    <span>Shipping</span>
                    <span className="cod__free">Free</span>
                  </div>
                  <div className="cod__footer-row cod__footer-row--total">
                    <span>Total</span>
                    <span>
                      $
                      {products
                        .reduce(
                          (s, i) =>
                            s + (i.product?.price ?? 0) * (i.quantity ?? 1),
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Summary + coupon ── */}
            <div className="cart-page__summary">
              <CartSummary onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
