import { Routes, Route } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./App.css";
import API from "./api/api";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";

import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  const [search, setSearch] = useState("");

  // ================= USER (REACTIVE FIX) =================
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  });

  // sync user across app
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") {
        setUser(null);
      } else {
        setUser(JSON.parse(stored));
      }
    };

    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  // ================= CART COUNT =================
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const products = res.data.products || [];

      const count = products.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("focus", fetchCartCount);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("focus", fetchCartCount);
    };
  }, [fetchCartCount]);

  return (
    <>
      {/* NAVBAR (ROLE PASSED) */}
      <Navbar
        setSearch={setSearch}
        user={user}
        cartCount={cartCount}
      />

      {/* ROUTES */}
      <Routes>

        {/* USER ROUTES */}
        <Route path="/" element={<Home search={search} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* USER ONLY */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;