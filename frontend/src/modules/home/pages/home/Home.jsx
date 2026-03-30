import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "../../../../store/auth/auth.slice";
import useProductStore from "../../../../store/product/product.slice";
import useCategoryStore from "../../../../store/category/category.slice";
import useCartStore from "../../../../store/cart/cart.slice";
import Slider from "../../components/slider/Slider";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role;

  const {
    products,
    loading: productsLoading,
    fetchProducts,
  } = useProductStore();

  const {
    categories,
    loading: categoriesLoading,
    fetchCategories,
  } = useCategoryStore();

  const { addItem, fetchCart, cart } = useCartStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    fetchProducts({ page: 1, limit: 100 });
    fetchCategories({ page: 1, limit: 100 });
    if (user) fetchCart();
  }, []);

  // ── Add to cart then navigate to cart page ──────────────────────────────
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      navigate("/auth");
      return;
    }

    setAddingId(product._id);
    try {
      await addItem(product._id, 1);
      toast.success(`${product.name} added to cart!`);
      // navigate("/cart"); // ← navigate on success
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingId(null);
    }
  };

  // ── Filtered products ────────────────────────────────────────────────────
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category?._id === activeCategory ||
            p.category === activeCategory ||
            p.categoryId === activeCategory,
        );

  const cartCount = cart?.products?.length ?? 0;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="home">
      {/* Guest sign-in nudge */}
      {!user && (
        <div className="guest-bar">
          <span>Sign in to access your cart, orders, and exclusive deals.</span>
          <button className="guest-bar__btn" onClick={() => navigate("/auth")}>
            Sign In
          </button>
        </div>
      )}

      <main className="home__main">
        {/* ── Hero slider ── */}
        <section className="home__section">
          <Slider />
        </section>

        {/* ── Admin toolbar ── */}
        {role === "admin" && (
          <div className="home__admin-toolbar">
            <div className="home__admin-toolbar-side">
              <button
                className="btn-manage"
                onClick={() => navigate("/categories")}
              >
                ⚙️ Manage Categories
              </button>
            </div>
            <div className="home__admin-toolbar-center">Admin Panel</div>
            <div className="home__admin-toolbar-side">
              <button
                className="btn-manage"
                onClick={() => navigate("/products")}
              >
                ⚙️ Manage Products
              </button>
            </div>
          </div>
        )}

        {/* ── Categories ── */}
        <section className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">Categories</h2>
          </div>

          {categoriesLoading ? (
            <div className="home__loading">Loading categories…</div>
          ) : categories.length === 0 ? (
            <div className="home__empty">No categories found.</div>
          ) : (
            <div className="categories-row">
              <button
                className={`category-chip${activeCategory === "all" ? " active" : ""}`}
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`category-chip${activeCategory === cat._id ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat._id)}
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="category-chip__img"
                    />
                  )}
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ── Featured products ── */}
        <section className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">
              Featured Products
              {!productsLoading && (
                <span className="home__count">
                  {" "}
                  ({filteredProducts.length})
                </span>
              )}
            </h2>

            <div className="home__section-actions">
              {role === "customer" && cartCount > 0 && (
                <button className="btn-cart" onClick={() => navigate("/cart")}>
                  🛒 Cart ({cartCount})
                </button>
              )}
            </div>
          </div>

          {productsLoading ? (
            <div className="home__loading">Loading products…</div>
          ) : filteredProducts.length === 0 ? (
            <div className="home__empty">No products found.</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <div key={p._id} className="product-simple-card">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="product-simple-card__img"
                    />
                  ) : (
                    <div className="product-simple-card__no-img">🛍</div>
                  )}

                  <div className="product-simple-card__body">
                    <p className="product-simple-card__category">
                      {p.category?.name || p.category || ""}
                    </p>
                    <h3 className="product-simple-card__name">{p.name}</h3>
                    <p className="product-simple-card__price">
                      ${p.price?.toFixed(2)}
                    </p>

                    <button
                      className={`product-simple-card__btn${
                        addingId === p._id ? " adding" : ""
                      }`}
                      onClick={() => handleAddToCart(p)}
                      disabled={addingId === p._id}
                    >
                      {addingId === p._id ? "Adding…" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
