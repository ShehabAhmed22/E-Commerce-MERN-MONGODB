import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  Tag,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import CreateCoupon from "../../components/create-coupon/CreateCoupon";
import UpdateCoupon from "../../components/update-coupon/UpdateCoupon";
import DeleteCoupon from "../../components/delete-coupon/DeleteCoupon";
import useCouponStore from "../../../../store/coupon/coupon.slice";
import "./coupon.css";

// ── Helpers ──────────────────────────────────────────────────────────────────

function isExpired(expiresAt) {
  return new Date(expiresAt) < new Date();
}

function StatusBadge({ coupon }) {
  if (!coupon.isActive)
    return <span className="coup-badge coup-badge--gray">Inactive</span>;
  if (isExpired(coupon.expiresAt))
    return <span className="coup-badge coup-badge--red">Expired</span>;
  if (coupon.usedCount >= coupon.maxUses)
    return <span className="coup-badge coup-badge--amber">Exhausted</span>;
  return <span className="coup-badge coup-badge--green">Active</span>;
}

function TypeBadge({ type }) {
  return (
    <span
      className={`coup-badge ${type === "percentage" ? "coup-badge--indigo" : "coup-badge--blue"}`}
    >
      {type === "percentage" ? "%" : "$"} {type}
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

function Coupon() {
  const {
    coupons,
    loading,
    pagination,
    search,
    fetchCoupons,
    setSearch,
    setPage,
  } = useCouponStore();

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  console.log(coupons);

  // Debounce 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) setSearch(localSearch);
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch, search, setSearch]);

  const { currentPage, totalPages, totalItems } = pagination;

  // Stats
  const activeCount = coupons.filter(
    (c) => c.isActive && !isExpired(c.expiresAt) && c.usedCount < c.maxUses,
  ).length;
  const expiredCount = coupons.filter((c) => isExpired(c.expiresAt)).length;
  const exhaustedCount = coupons.filter(
    (c) => c.usedCount >= c.maxUses && !isExpired(c.expiresAt),
  ).length;
  const inactiveCount = coupons.filter((c) => !c.isActive).length;

  return (
    <div className="coupon-page">
      <Toaster position="top-right" richColors />

      <div className="coupon-page__inner">
        {/* ── Header ── */}
        <div className="coupon-page__header">
          <div className="coupon-page__title-row">
            <div className="coupon-page__icon-wrap">
              <Tag size={20} color="#fff" />
            </div>
            <div>
              <h1 className="coupon-page__title">Coupons</h1>
              <p className="coupon-page__subtitle">
                {totalItems} {totalItems === 1 ? "coupon" : "coupons"} total
              </p>
            </div>
          </div>
          <div className="coupon-page__actions">
            <button
              onClick={() => fetchCoupons()}
              disabled={loading}
              className="coupon-page__refresh-btn"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
            </button>
            <CreateCoupon />
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="coupon-stats">
          {[
            { label: "Active", count: activeCount, cls: "coup-badge--green" },
            { label: "Expired", count: expiredCount, cls: "coup-badge--red" },
            {
              label: "Exhausted",
              count: exhaustedCount,
              cls: "coup-badge--amber",
            },
            {
              label: "Inactive",
              count: inactiveCount,
              cls: "coup-badge--gray",
            },
          ].map(({ label, count, cls }) => (
            <div key={label} className="coupon-stats__card">
              <p className="coupon-stats__label">{label}</p>
              <p className="coupon-stats__count">{count}</p>
              <span className={`coup-badge ${cls}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="coupon-table-card">
          {/* Search */}
          <div className="coupon-table-card__toolbar">
            <div className="coupon-search">
              <Search size={15} className="coupon-search__icon" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by code…"
                className="coupon-search__input"
              />
            </div>
          </div>

          {/* Skeleton */}
          {loading && coupons.length === 0 ? (
            <div className="coupon-skeleton">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="coupon-skeleton__row">
                  <div className="coupon-skeleton__line coupon-skeleton__line--wide" />
                  <div className="coupon-skeleton__pill" />
                  <div className="coupon-skeleton__line" />
                  <div className="coupon-skeleton__pill coupon-skeleton__pill--sm" />
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="coupon-empty">
              <div className="coupon-empty__icon-wrap">
                <Tag size={28} color="#d1d5db" />
              </div>
              <p className="coupon-empty__title">
                {localSearch
                  ? "No coupons match your search"
                  : "No coupons yet"}
              </p>
              {!localSearch && (
                <p className="coupon-empty__sub">
                  Create your first coupon to offer discounts.
                </p>
              )}
            </div>
          ) : (
            <>
              {/* ── Desktop table ── */}
              <div className="coupon-table-wrap">
                <table className="coupon-table">
                  <thead className="coupon-table__head">
                    <tr>
                      {[
                        "#",
                        "Code",
                        "Type",
                        "Discount",
                        "Uses",
                        "Expires",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="coupon-table__th">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon, index) => (
                      <tr key={coupon._id} className="coupon-table__row">
                        <td className="coupon-table__td coupon-table__td--mono">
                          {String(
                            (currentPage - 1) * pagination.limit + index + 1,
                          ).padStart(2, "0")}
                        </td>

                        <td className="coupon-table__td">
                          <span className="coupon-code">{coupon.code}</span>
                        </td>

                        <td className="coupon-table__td">
                          <TypeBadge type={coupon.discountType} />
                        </td>

                        <td className="coupon-table__td coupon-table__td--discount">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discount}%`
                            : `$${coupon.discount.toFixed(2)}`}
                        </td>

                        <td className="coupon-table__td">
                          <span className="coupon-uses">
                            {coupon.usedCount}
                            <span className="coupon-uses__sep">/</span>
                            {coupon.maxUses}
                          </span>
                        </td>

                        <td className="coupon-table__td coupon-table__td--date">
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="coupon-table__td">
                          <StatusBadge coupon={coupon} />
                        </td>

                        <td className="coupon-table__td">
                          <div className="coupon-table__btns">
                            <UpdateCoupon coupon={coupon} />
                            <DeleteCoupon coupon={coupon} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile cards ── */}
              <div className="coupon-cards">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="coupon-card">
                    <div className="coupon-card__top">
                      <div>
                        <span className="coupon-code">{coupon.code}</span>
                        <div className="coupon-card__types">
                          <TypeBadge type={coupon.discountType} />
                        </div>
                      </div>
                      <div className="coupon-card__btns">
                        <UpdateCoupon coupon={coupon} />
                        <DeleteCoupon coupon={coupon} />
                      </div>
                    </div>
                    <div className="coupon-card__meta">
                      <span className="coupon-card__discount">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discount}% off`
                          : `$${coupon.discount.toFixed(2)} off`}
                      </span>
                      <span className="coupon-card__dot">·</span>
                      <span className="coupon-card__uses">
                        {coupon.usedCount}/{coupon.maxUses} uses
                      </span>
                      <span className="coupon-card__dot">·</span>
                      <span className="coupon-card__expires">
                        Expires{" "}
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div className="coupon-card__status">
                      <StatusBadge coupon={coupon} />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="coupon-pagination">
                  <p className="coupon-pagination__info">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="coupon-pagination__btns">
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="coupon-pagination__btn"
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
                            className={`coupon-pagination__page ${p === currentPage ? "coupon-pagination__page--active" : ""}`}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (Math.abs(p - currentPage) === 2) {
                        return (
                          <span key={p} className="coupon-pagination__ellipsis">
                            …
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="coupon-pagination__btn"
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

export default Coupon;
