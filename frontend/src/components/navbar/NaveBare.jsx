import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Tag,
  ClipboardList,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../../store/auth/auth.slice";
import "./NaveBare.css";

// ─── Full NAV links ─────────────────────────────────────────────────────
const FULL_NAV_LINKS = [
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Get initials for avatar
  const name = user?.name || user?.data?.name || "U";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  // Determine visible links based on role
  const NAV_LINKS =
    user?.role === "admin"
      ? FULL_NAV_LINKS
      : FULL_NAV_LINKS.filter((link) => ["/orders", "/cart"].includes(link.to));

  return (
    <header className="nb-root">
      <nav className="nb-inner">
        {/* Brand */}
        <NavLink to="/" className="nb-brand">
          <span className="nb-brand-mark">◈</span>
          <span className="nb-brand-name">Nexus</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="nb-links">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nb-link ${isActive ? "nb-link--active" : ""}`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="nb-right">
          <div className="nb-avatar">{initials}</div>
          <button className="nb-logout" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Mobile burger */}
          <button
            className="nb-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nb-drawer ${menuOpen ? "nb-drawer--open" : ""}`}>
        <ul className="nb-drawer-links">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `nb-drawer-link ${isActive ? "nb-drawer-link--active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className="nb-drawer-logout" onClick={handleLogout}>
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
}
