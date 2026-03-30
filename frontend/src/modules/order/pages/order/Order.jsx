import React, { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  ShoppingBag,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import UpdateOrder, {
  STATUS_STYLES,
} from "../../components/update-order/UpdateOrder";
import DeleteOrder from "../../components/delete-order/DeleteOrder";
import ViewOrder from "../../components/view-order/ViewOrder";

import useOrderStore from "../../../../store/order/order.slice";
import { useAuthStore } from "../../../../store/auth/auth.slice";

import "./order.css";

function StatusBadge({ status }) {
  return (
    <span className={STATUS_STYLES[status] ?? "badge"}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

function Order() {
  const {
    orders,
    loading,
    pagination,
    search,
    fetchOrders,
    setSearch,
    setPage,
  } = useOrderStore();

  const { user } = useAuthStore(); // get current user
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      if (localSearch !== search) setSearch(localSearch);
    }, 400);
    return () => clearTimeout(t);
  }, [localSearch, search, setSearch]);

  const { currentPage, totalPages, totalItems } = pagination;

  // Filter orders based on role
  const visibleOrders =
    user?.role === "admin"
      ? orders
      : orders.filter((o) => o?.user?._id === user?._id);

  const totalRevenue = visibleOrders
    .filter((o) => o.status !== "pending")
    .reduce((s, o) => s + (o.totalPrice ?? 0), 0);

  return (
    <div className="order-page">
      <Toaster position="top-right" richColors />

      <div className="order-page__inner">
        {/* Header */}
        <div className="order-page__header">
          <div className="order-page__title-row">
            <div className="order-page__icon-wrap">
              <ShoppingBag size={20} color="#fff" />
            </div>
            <div>
              <h1 className="order-page__title">Orders</h1>
              <p className="order-page__subtitle">
                {visibleOrders.length}{" "}
                {visibleOrders.length === 1 ? "order" : "orders"} total
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchOrders()}
            disabled={loading}
            className="order-page__refresh-btn"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
          </button>
        </div>

        {/* Stats */}
        <div className="order-stats">
          {["pending", "paid", "shipped", "delivered"].map((s) => (
            <div key={s} className="order-stats__card">
              <p className="order-stats__label">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </p>
              <p className="order-stats__count">
                {visibleOrders.filter((o) => o.status === s).length}
              </p>
              <StatusBadge status={s} />
            </div>
          ))}
        </div>

        {/* Revenue */}
        <div className="order-revenue">
          <span className="order-revenue__label">
            Total Revenue (excl. pending)
          </span>
          <span className="order-revenue__value">
            ${totalRevenue.toFixed(2)}
          </span>
        </div>

        {/* Table card */}
        <div className="order-table-card">
          {/* Search */}
          <div className="order-table-card__toolbar">
            <div className="order-search">
              <Search size={15} className="order-search__icon" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by ID, status, price…"
                className="order-search__input"
              />
            </div>
          </div>

          {/* Loading / Empty */}
          {loading && visibleOrders.length === 0 ? (
            <div className="order-skeleton">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="order-skeleton__row">
                  <div className="order-skeleton__line order-skeleton__line--wide" />
                  <div className="order-skeleton__line" />
                  <div className="order-skeleton__pill" />
                  <div className="order-skeleton__pill order-skeleton__pill--sm" />
                </div>
              ))}
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="order-empty">
              <div className="order-empty__icon-wrap">
                <ShoppingBag size={28} color="#d1d5db" />
              </div>
              <p className="order-empty__title">
                {localSearch ? "No orders match your search" : "No orders yet"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="order-table-wrap">
                <table className="order-table">
                  <thead className="order-table__head">
                    <tr>
                      {[
                        "#",
                        "Order ID",
                        "Customer",
                        "Products",
                        "Total",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th key={h} className="order-table__th">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((order, index) => (
                      <tr key={order._id} className="order-table__row">
                        <td className="order-table__td order-table__td--mono">
                          {String(
                            (currentPage - 1) * pagination.limit + index + 1,
                          ).padStart(2, "0")}
                        </td>
                        <td className="order-table__td order-table__td--id">
                          {order._id}
                        </td>
                        <td className="order-table__td">
                          {order?.user?.name ?? order?.user ?? "—"}
                        </td>
                        <td className="order-table__td order-table__td--center">
                          {order?.products?.length ?? 0}
                        </td>
                        <td className="order-table__td order-table__td--price">
                          ${order?.totalPrice?.toFixed(2)}
                        </td>
                        <td className="order-table__td">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="order-table__td order-table__td--date">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="order-table__td">
                          <div className="order-table__btns">
                            {user?.role === "admin" && (
                              <ViewOrder order={order} />
                            )}
                            {user?.role === "admin" && (
                              <UpdateOrder order={order} />
                            )}
                            <DeleteOrder order={order} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="order-cards">
                {visibleOrders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card__top">
                      <div className="order-card__info">
                        <p className="order-card__id">{order._id}</p>
                        <p className="order-card__customer">
                          {order?.user?.name ?? order?.user ?? "Unknown"}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="order-card__bottom">
                      <div>
                        <span className="order-card__price">
                          ${order?.totalPrice?.toFixed(2)}
                        </span>
                        <span className="order-card__dot">·</span>
                        <span className="order-card__items">
                          {order?.products?.length ?? 0} item
                          {order?.products?.length !== 1 ? "s" : ""}
                        </span>
                        <span className="order-card__dot">·</span>
                        <span className="order-card__date">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                      <div className="order-card__btns">
                        {user?.role === "admin" && <ViewOrder order={order} />}
                        {user?.role === "admin" && (
                          <UpdateOrder order={order} />
                        )}
                        <DeleteOrder order={order} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="order-pagination">
                  <p className="order-pagination__info">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="order-pagination__btns">
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="order-pagination__btn"
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
                            className={`order-pagination__page ${
                              p === currentPage
                                ? "order-pagination__page--active"
                                : ""
                            }`}
                          >
                            {p}
                          </button>
                        );
                      }
                      if (Math.abs(p - currentPage) === 2) {
                        return (
                          <span key={p} className="order-pagination__ellipsis">
                            …
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="order-pagination__btn"
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

export default Order;
