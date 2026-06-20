import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, productsRes, ordersRes] =
        await Promise.all([
          API.get("/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          API.get("/products"),
          API.get("/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      setUsers(usersRes.data || []);
      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateBanner = () => {
    localStorage.setItem("heroBanner", bannerUrl);
    alert("Banner Updated Successfully!");
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-dashboard-title">
        🛠 Admin Dashboard - ShopEZ
      </h1>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <h2>{users.length}</h2>
          <button onClick={() => navigate("/admin/users")}>
            View All
          </button>
        </div>

        <div className="dashboard-card">
          <h3>All Products</h3>
          <h2>{products.length}</h2>
          <button onClick={() => navigate("/admin/products")}>
            View All
          </button>
        </div>

        <div className="dashboard-card">
          <h3>All Orders</h3>
          <h2>{orders.length}</h2>
          <button onClick={() => navigate("/admin/orders")}>
            View All
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Add Product</h3>
          <h2>+</h2>
          <button onClick={() => navigate("/admin/new-product")}>
            Add Now
          </button>
        </div>
      </div>

      <div className="banner-section">
        <h2>🎨 Banner Update</h2>

        <input
          type="text"
          placeholder="Paste Banner Image URL"
          value={bannerUrl}
          onChange={(e) => setBannerUrl(e.target.value)}
        />

        <button onClick={updateBanner}>
          Update Banner
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;