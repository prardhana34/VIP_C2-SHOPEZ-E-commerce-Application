import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const [orderId, setOrderId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const id = "ORD" + Math.floor(Math.random() * 10000000);
    setOrderId(id);
  }, []);

  return (
    <div className="success-page">

      <div className="success-box">

        {/* ICON */}
        <div className="checkmark">✔</div>

        {/* TITLE */}
        <h1>Order Placed Successfully!</h1>

        <p className="sub-text">
          Thank you for shopping with ShopEZ 🎉
        </p>

        {/* ORDER ID */}
        <div className="order-id">
          Order ID: <span>{orderId}</span>
        </div>

        {/* ACTIONS */}
        <button
          className="continue-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

      </div>

    </div>
  );
}

export default OrderSuccess;