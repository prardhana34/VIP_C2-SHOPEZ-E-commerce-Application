import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(res.data || null);
      } catch (err) {
        console.log("Order fetch error:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="center-page">Loading...</div>;

  if (!order) return <div className="center-page">Order not found</div>;

  return (
    <div className="order-details">
      <h2>Order Details</h2>

      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Total:</b> ₹{order.totalPrice}</p>

      <div className="order-products">
        {order.products?.map((item, i) => (
          <div key={i} className="order-item">
            <img src={item.product?.image} />

            <div>
              <h4>{item.product?.title}</h4>
              <p>Qty: {item.quantity}</p>
              <p>₹{item.product?.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetails;