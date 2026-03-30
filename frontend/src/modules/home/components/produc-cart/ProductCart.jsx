import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, userRole }) => {
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  // ── Normalise API fields ───────────────────────────────
  const name = product.name || "Unnamed Product";
  const price = product.price ?? 0;
  const discount = product.discount ?? null;
  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? product.reviewsCount ?? 0;
  const isNew = product.isNew ?? false;
  const category = product.category?.name || product.category || "";
  const image = product.image || product.imageUrl || product.thumbnail || null;

  const finalPrice = discount
    ? (price * (1 - discount / 100)).toFixed(2)
    : price.toFixed(2);

  const handleAddToCart = () => {
    setAdded(true);
    onAddToCart && onAddToCart(product);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="product-card">
      {/* Badges */}
      <div className="product-card__badge-wrap">
        {isNew && <span className="badge badge--new">New</span>}
        {discount && <span className="badge badge--sale">-{discount}%</span>}
      </div>

      {/* Image */}
      <div className="product-card__img-wrap">
        {image ? (
          <img src={image} alt={name} className="product-card__img" />
        ) : (
          <div className="product-card__no-img">🛍</div>
        )}
        <div className="product-card__overlay">
          <button className="product-card__quick-view">Quick View</button>
        </div>
      </div>

      {/* Body */}
      <div className="product-card__body">
        {category && <p className="product-card__category">{category}</p>}
        <h3 className="product-card__name">{name}</h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="product-card__rating">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`star ${s <= Math.round(rating) ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
            {reviews > 0 && (
              <span className="product-card__reviews">({reviews})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="product-card__price-row">
          <span className="product-card__price">${finalPrice}</span>
          {discount && (
            <span className="product-card__original">${price.toFixed(2)}</span>
          )}
        </div>

        {/* Actions */}
        <button
          className={`btn btn--primary product-card__cart-btn ${added ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
