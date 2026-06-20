import { useEffect, useState, useCallback } from "react";
import API from "../api/api";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchProducts()]);
      setLoading(false);
    };
    load();
  }, [fetchOrders, fetchProducts]);

  const updateStatus = async (id, status) => {
    await API.put(
      `/orders/${id}`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  const deleteProduct = async (id) => {
    await API.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="admin-page">

      <h1 className="admin-title">🛠 Admin Dashboard</h1>

      {/* PRODUCTS */}
      <div className="admin-section">

        <h2>Products Management</h2>

        {products.length === 0 ? (
          <p className="muted">No products found</p>
        ) : (
          <div className="product-grid-admin">

            {products.map((p) => (
              <div key={p._id} className="admin-product-card">

                <img src={p.image} />

                <h3>{p.title || p.name}</h3>

                <p className="price">₹ {p.price}</p>

                <button
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete Product
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* ORDERS */}
      <div className="admin-section">

        <h2>Orders Management</h2>

        {orders.length === 0 ? (
          <p className="muted">No orders found</p>
        ) : (
          <div className="order-list">

            {orders.map((o) => (
              <div key={o._id} className="order-card-admin">

                <div className="order-top">

                  <div>
                    <span>Order ID</span>
                    <p>{o._id}</p>
                  </div>

                  <div>
                    <span>Total</span>
                    <p className="price">₹ {o.totalPrice}</p>
                  </div>

                  <div>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateStatus(o._id, e.target.value)
                      }
                    >
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>

                </div>

                <div className="order-items">

                  {o.products?.map((item, i) => (
                    <div key={i} className="order-item">

                      <img src={item.product?.image} />

                      <div>
                        <h4>{item.product?.title}</h4>
                        <p>Qty: {item.quantity}</p>
                        <p className="price">
                          ₹ {item.product?.price}
                        </p>
                      </div>

                    </div>
                  ))}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;