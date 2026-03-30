import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  Package,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import CreateProduct from "../../components/create-product/CreateProduct";
import UpdateProduct from "../../components/update-product/UpdateProduct";
import DeleteProduct from "../../components/delete-product/DeleteProduct";
import useProductStore from "../../../../store/product/product.slice";
import "./product.css";

/* ── Quantity badge helper ── */
function QtyBadge({ qty }) {
  const cls =
    qty > 10
      ? "badge badge--green"
      : qty > 0
        ? "badge badge--amber"
        : "badge badge--red";
  return <span className={cls}>{qty}</span>;
}

function Product() {
  const {
    products,
    loading,
    pagination,
    search,
    fetchProducts,
    setSearch,
    setPage,
  } = useProductStore();

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /* Debounce search — 400 ms */
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) setSearch(localSearch);
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch, search, setSearch]);

  const { currentPage, totalPages, totalItems } = pagination;

  return (
    <div className="product-page">
      <Toaster position="top-right" richColors />

      <div className="product-page__inner">
        {/* ── Header ── */}
        <div className="product-page__header">
          <div className="product-page__title-row">
            <div className="product-page__icon-wrap">
              <Package size={20} color="#fff" />
            </div>
            <div>
              <h1 className="product-page__title">Products</h1>
              <p className="product-page__subtitle">
                {totalItems} {totalItems === 1 ? "product" : "products"} total
              </p>
            </div>
          </div>

          <div className="product-page__actions">
            <button
              onClick={() => fetchProducts()}
              disabled={loading}
              className="product-page__refresh-btn"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
            </button>
            <CreateProduct />
          </div>
        </div>

        {/* ── Table card ── */}
        <div className="product-table-card">
          {/* Search bar */}
          <div className="product-table-card__toolbar">
            <div className="product-search">
              <Search size={15} className="product-search__icon" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by name, category, price…"
                className="product-search__input"
              />
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && products.length === 0 ? (
            <div className="product-skeleton">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="product-skeleton__row">
                  <div className="product-skeleton__img" />
                  <div className="product-skeleton__lines">
                    <div className="product-skeleton__line product-skeleton__line--wide" />
                    <div className="product-skeleton__line product-skeleton__line--narrow" />
                  </div>
                  <div className="product-skeleton__pill" />
                  <div className="product-skeleton__pill product-skeleton__pill--sm" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="product-empty">
              <div className="product-empty__icon-wrap">
                <Package size={28} color="#d1d5db" />
              </div>
              <p className="product-empty__title">
                {localSearch
                  ? "No products match your search"
                  : "No products yet"}
              </p>
              {!localSearch && (
                <p className="product-empty__sub">
                  Create your first product to get started.
                </p>
              )}
            </div>
          ) : (
            <>
              {/* ── Desktop table ── */}
              <div className="product-table-wrap">
                <table className="product-table">
                  <thead className="product-table__head">
                    <tr>
                      {[
                        "#",
                        "Image",
                        "Name",
                        "Category",
                        "Price",
                        "Qty",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="product-table__th">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product._id} className="product-table__row">
                        {/* Index */}
                        <td className="product-table__td product-table__td--mono">
                          {String(
                            (currentPage - 1) * pagination.limit + index + 1,
                          ).padStart(2, "0")}
                        </td>

                        {/* Image */}
                        <td className="product-table__td">
                          <div className="product-img">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-img__src"
                              />
                            ) : (
                              <Package size={16} color="#d1d5db" />
                            )}
                          </div>
                        </td>

                        {/* Name + desc */}
                        <td className="product-table__td product-table__td--name">
                          <p className="product-name">{product.name}</p>
                          <p className="product-desc">{product.description}</p>
                        </td>

                        {/* Category */}
                        <td className="product-table__td">
                          <span className="badge badge--indigo">
                            {product.category?.name || "—"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="product-table__td product-table__td--price">
                          ${product.price?.toFixed(2)}
                        </td>

                        {/* Qty */}
                        <td className="product-table__td">
                          <QtyBadge qty={product.quantity} />
                        </td>

                        {/* Actions */}
                        <td className="product-table__td">
                          <div className="product-table__btns">
                            <UpdateProduct product={product} />
                            <DeleteProduct product={product} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="product-cards">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <div className="product-card__img-wrap">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-card__img"
                        />
                      ) : (
                        <Package size={20} color="#d1d5db" />
                      )}
                    </div>
                    <div className="product-card__info">
                      <div className="product-card__top">
                        <p className="product-card__name">{product.name}</p>
                        <div className="product-card__btns">
                          <UpdateProduct product={product} />
                          <DeleteProduct product={product} />
                        </div>
                      </div>
                      <p className="product-card__desc">
                        {product.description}
                      </p>
                      <div className="product-card__meta">
                        <span className="product-card__price">
                          ${product.price?.toFixed(2)}
                        </span>
                        <span className="product-card__dot">·</span>
                        <span className="product-card__qty">
                          Qty: {product.quantity}
                        </span>
                        {product.category?.name && (
                          <>
                            <span className="product-card__dot">·</span>
                            <span className="badge badge--indigo badge--sm">
                              {product.category.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="product-pagination">
                  <p className="product-pagination__info">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="product-pagination__btns">
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="product-pagination__btn"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const p = i + 1;
                      if (
                        p === 1 ||
                        p === totalPages ||
                        Math.abs(p - currentPage) <= 1
                      ) {
                        return (
                          <button
                            key={p}
                            onClick={() => setPage(p)}
                            disabled={loading}
                            className={`product-pagination__page ${p === currentPage ? "product-pagination__page--active" : ""}`}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (Math.abs(p - currentPage) === 2) {
                        return (
                          <span
                            key={p}
                            className="product-pagination__ellipsis"
                          >
                            …
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="product-pagination__btn"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
