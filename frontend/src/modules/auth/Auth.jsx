import "./auth.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import {
  loginSchema,
  registerSchema,
} from "../../validation/auth/auth.validation";
import { useAuthStore } from "../../store/auth/auth.slice";

// ─── Field Component ──────────────────────────────────────────

function Field({
  id,
  label,
  type = "text",
  placeholder,
  error,
  registration,
  autoComplete,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="af-group">
      <label htmlFor={id} className="af-label">
        {label}
      </label>
      <div className={isPassword ? "af-pw-wrap" : ""}>
        <input
          id={id}
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            "af-input",
            isPassword ? "af-input--pw" : "",
            error ? "af-input--err" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          {...registration}
        />
        {isPassword && (
          <button
            type="button"
            className="af-eye"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label="Toggle password"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <span className="af-error">{error}</span>}
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────

function LoginForm({ onSwitch }) {
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    const res = await login(data);
    if (res.success) {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="auth-heading">Sign in to your workspace</p>

      <Field
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        registration={register("email")}
      />
      <Field
        id="login-pass"
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        registration={register("password")}
      />

      <button type="submit" className="af-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 size={15} className="af-spin" /> Signing in…
          </>
        ) : (
          <>
            Sign In <ArrowRight size={15} />
          </>
        )}
      </button>

      <p className="auth-switch">
        No account yet?{" "}
        <button type="button" className="auth-switch-btn" onClick={onSwitch}>
          Create one
        </button>
      </p>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────

function RegisterForm({ onSwitch }) {
  const { signup, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async ({ name, email, password }) => {
    const res = await signup({ name, email, password });
    if (res.success) {
      toast.success("Account created!");
      navigate("/");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <p className="auth-heading">Create your account</p>

      <Field
        id="reg-name"
        label="Full Name"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.name?.message}
        registration={register("name")}
      />
      <Field
        id="reg-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        registration={register("email")}
      />
      <Field
        id="reg-pass"
        label="Password"
        type="password"
        placeholder="Min 6 chars, 1 uppercase, 1 number"
        autoComplete="new-password"
        error={errors.password?.message}
        registration={register("password")}
      />
      <Field
        id="reg-confirm"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />

      <button type="submit" className="af-btn" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 size={15} className="af-spin" /> Creating…
          </>
        ) : (
          <>
            Create Account <ArrowRight size={15} />
          </>
        )}
      </button>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" className="auth-switch-btn" onClick={onSwitch}>
          Sign in
        </button>
      </p>
    </form>
  );
}

// ─── Auth Page ────────────────────────────────────────────────

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const isLogin = mode === "login";

  return (
    <div className="auth-root">
      {/* ── Background ── */}
      <div className="auth-bg">
        <div className="auth-grid" />
        <div className="auth-orb auth-orb--a" />
        <div className="auth-orb auth-orb--b" />
      </div>

      {/* ── Content ── */}
      <div className="auth-wrap">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand-mark">◈</span>
          <span className="auth-brand-name">Nexus</span>
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
            <div
              className={`auth-tab-pill ${!isLogin ? "auth-tab-pill--right" : ""}`}
            />
          </div>

          {/* Login Panel */}
          <div
            className={`auth-panel ${isLogin ? "auth-panel--in" : "auth-panel--out"}`}
          >
            <LoginForm onSwitch={() => setMode("register")} />
          </div>

          {/* Register Panel */}
          <div
            className={`auth-panel ${!isLogin ? "auth-panel--in" : "auth-panel--out"}`}
          >
            <RegisterForm onSwitch={() => setMode("login")} />
          </div>
        </div>

        <p className="auth-legal">
          By continuing you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
