import React, { useEffect, useCallback } from "react";
import { Toaster } from "sonner";
import {
  LayoutGrid,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import CreateCategory from "../../components/create-category/CreateCategory";
import UpdateCategory from "../../components/update-category/UpdateCategory";
import DeleteCategory from "../../components/delete-category/DeleteCategory";
import useCategoryStore from "../../../../store/category/category.slice";

import "./category.css";

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination() {
  const { pagination, loading, setPage } = useCategoryStore();
  const { currentPage, totalPages, totalItems, limit } = pagination;

  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, totalItems);

  const getPageNumbers = () => {
    const delta = 2,
      range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    )
      range.push(i);
    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push("...");
    if (range[range.length - 1] !== totalPages) range.push(totalPages);
    return range;
  };

  return (
    <div className="pagination">
      <p className="pagination-info">
        Showing{" "}
        <strong>
          {from}–{to}
        </strong>{" "}
        of <strong>{totalItems}</strong> categories
      </p>

      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => setPage(1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          className="page-btn"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="page-ellipsis">
              …
            </span>
          ) : (
            <button
              key={page}
              className={`page-btn${page === currentPage ? " active" : ""}`}
              onClick={() => setPage(page)}
              disabled={loading}
            >
              {page}
            </button>
          ),
        )}

        <button
          className="page-btn"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronRight size={16} />
        </button>

        <button
          className="page-btn"
          onClick={() => setPage(totalPages)}
          disabled={currentPage === totalPages || loading}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Category() {
  const {
    categories,
    loading,
    pagination,
    search,
    fetchCategories,
    setSearch,
    setLimit,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories({ page: 1 });
  }, []);

  const handleSearch = useDebouncedCallback((value) => setSearch(value), 400);

  const handleRefresh = useCallback(() => {
    fetchCategories({
      page: pagination.currentPage,
      limit: pagination.limit,
      search,
    });
  }, [pagination, search]);

  return (
    <div className="category-page">
      <Toaster position="top-right" richColors />

      <div className="category-container">
        {/* ── Header ── */}
        <div className="category-header">
          <div className="category-header-left">
            <div className="category-icon-box">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="category-title">Categories</h1>
              <p className="category-subtitle">
                {pagination.totalItems}{" "}
                {pagination.totalItems === 1 ? "category" : "categories"} total
              </p>
            </div>
          </div>

          <div className="category-header-right">
            <button
              className="btn-icon"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? "spin" : ""} />
            </button>
            <CreateCategory />
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="category-toolbar">
          <div className="search-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              defaultValue={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search categories…"
              className="search-input"
            />
          </div>

          <select
            value={pagination.limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="limit-select"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>

        {/* ── Table Card ── */}
        <div className="category-table-card">
          {/* Skeleton */}
          {loading && categories.length === 0 ? (
            <>
              {[...Array(Math.min(pagination.limit, 5))].map((_, i) => (
                <div key={i} className="skeleton-row">
                  <div className="skeleton-box skeleton-img" />
                  <div className="skeleton-box skeleton-text" />
                  <div className="skeleton-box skeleton-btn" />
                </div>
              ))}
            </>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-box">
                <LayoutGrid size={28} color="#9ca3af" />
              </div>
              <p className="empty-title">
                {search ? `No results for "${search}"` : "No categories yet"}
              </p>
              <p className="empty-hint">
                {search
                  ? "Try a different search term."
                  : "Create your first category to get started."}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="table-header">
                <span className="table-header-cell">#</span>
                <span className="table-header-cell">Image</span>
                <span className="table-header-cell">Name</span>
                <span className="table-header-cell right">Actions</span>
              </div>

              {/* Rows */}
              <div className={`table-rows${loading ? " loading" : ""}`}>
                {categories.map((category, index) => {
                  const globalIndex =
                    (pagination.currentPage - 1) * pagination.limit + index + 1;
                  return (
                    <div key={category._id} className="table-row">
                      <span className="row-index">
                        {String(globalIndex).padStart(2, "0")}
                      </span>

                      <div className="row-image-box">
                        {category.image ? (
                          <img src={category.image} alt={category.name} />
                        ) : (
                          <LayoutGrid size={18} color="#d1d5db" />
                        )}
                      </div>

                      <p className="row-name">{category.name}</p>

                      <div className="row-actions">
                        <UpdateCategory category={category} />
                        <DeleteCategory category={category} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Pagination />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
