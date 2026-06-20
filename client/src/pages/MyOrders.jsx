import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("orders response:", res.data);

      const data =
        res.data?.orders ||
        res.data?.data ||
        res.data ||
        [];

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleBuyAgain = async (e, product) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("cartUpdated"));

      alert("Added to cart!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="orders-page">

      <h2 className="orders-title">📦 My Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h3>No Orders Yet</h3>
          <p>Your placed orders will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">

          {orders.map((order) => (
            <div
              key={order._id}
              className="order-card"
              onClick={() => navigate(`/order/${order._id}`)}
            >

              <div className="order-header">

                <div>
                  <p className="label">ORDER ID</p>
                  <p className="value small">{order._id}</p>
                </div>

                <div>
                  <p className="label">STATUS</p>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </div>

                <div>
                  <p className="label">TOTAL</p>
                  <p className="price">₹{order.totalPrice}</p>
                </div>

              </div>

              <div className="order-products">

                {(order.products || []).map((item, i) => (
                  <div className="order-item" key={i}>

                    <img src={item.product?.image} />

                    <div className="order-info">

                      <h4>{item.product?.title}</h4>

                      <p>Qty: {item.quantity}</p>

                      <p className="item-price">
                        ₹{item.product?.price}
                      </p>

                    </div>

                    <button
                      className="buy-again"
                      onClick={(e) =>
                        handleBuyAgain(e, item.product)
                      }
                    >
                      Buy Again
                    </button>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default MyOrders;