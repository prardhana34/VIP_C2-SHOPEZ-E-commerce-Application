import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar({ setSearch, cartCount, user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(query);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          ShopEZ
        </Link>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* LINKS */}
        <div className="nav-links">

          {/* ================= USER NAV ================= */}
          {!isAdmin && (
            <>
              <Link to="/">Home</Link>
              <Link to="/cart">Cart ({cartCount ?? 0})</Link>
              <Link to="/orders">My Orders</Link>
            </>
          )}

          {/* ================= ADMIN NAV ================= */}
          {isAdmin && (
            <>
              <Link to="/admin">Admin Dashboard</Link>
              <Link to="/admin/orders">Admin Orders</Link>
              <Link to="/admin/products">Admin Products</Link>
              <Link to="/admin/users">Admin Users</Link>
            </>
          )}

          {/* PROFILE DROPDOWN (COMMON) */}
          {user ? (
            <div
              className="profile"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >

              <button className="profile-btn">
                {user.name || "Profile"}
              </button>

              <div className={`dropdown ${open ? "show" : ""}`}>

                <Link to="/profile">My Profile</Link>

                <button className="logout" onClick={handleLogout}>
                  Logout
                </button>

              </div>
            </div>
          ) : (
            <Link className="login-btn" to="/login">
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;