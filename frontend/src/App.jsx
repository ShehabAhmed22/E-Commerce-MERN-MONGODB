import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";

import { useAuthStore } from "./store/auth/auth.slice";
import Navbar from "./components/navbar/NaveBare";
import Auth from "./modules/auth/Auth";
import Category from "./modules/category/pages/category/Category";
import Product from "./modules/product/pages/product/Product";
import Coupon from "./modules/coupon/pages/coupon/Coupon";
import Order from "./modules/order/pages/order/Order";
import Cart from "./modules/cart/pages/cart/Cart";
import Home from "./modules/home/pages/home/home";

// ── Guards ────────────────────────────────────────────────────

function ProtectedRoute({ children }) {
  const { user, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

// ── Splash loader ─────────────────────────────────────────────

function SplashLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070710",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader2
        size={30}
        color="#63b3ed"
        style={{ animation: "spin 0.75s linear infinite" }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Layout — INSIDE BrowserRouter so useLocation() works ─────

function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main style={{ minHeight: isAuthPage ? "100vh" : "calc(100vh - 60px)" }}>
        <Routes>
          {/* Public */}
          <Route
            path="/auth"
            element={
              <GuestRoute>
                <Auth />
              </GuestRoute>
            }
          />

          {/* Home — public */}
          <Route path="/" element={<Home />} />

          {/* Customer routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/products"
            element={
              <AdminRoute>
                <Product />
              </AdminRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <AdminRoute>
                <Category />
              </AdminRoute>
            }
          />
          <Route
            path="/coupons"
            element={
              <AdminRoute>
                <Coupon />
              </AdminRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <protectedRoute>
                <Order />
              </protectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

// ── App ───────────────────────────────────────────────────────

export default function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <SplashLoader />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0e0e1a",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "#e8e8f0",
            fontFamily: "'Outfit', sans-serif",
          },
        }}
      />
      <Layout />
    </BrowserRouter>
  );
}
