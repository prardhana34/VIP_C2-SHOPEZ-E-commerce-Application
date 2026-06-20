import { useEffect, useState } from "react";
import API from "../api/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-page">

      <h1 className="admin-title">📦 Admin Orders</h1>

      <div className="order-list">

        {orders.length === 0 ? (
          <p className="muted">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card-admin">

              {/* TOP SECTION */}
              <div className="order-top">

                <div>
                  <span>ORDER ID</span>
                  <p>{order._id}</p>
                </div>

                <div>
                  <span>USER</span>
                  <p>{order.user?.name}</p>
                  <small className="muted">
                    {order.user?.email}
                  </small>
                </div>

                <div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </div>

              </div>

              {/* PRODUCTS */}
              <div className="order-items">

                {order.products?.map((item, i) => (
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

              {/* TOTAL */}
              <div className="order-total">
                Total: ₹ {order.totalPrice}
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default AdminOrders;