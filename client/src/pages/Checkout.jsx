import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCart(res.data.products || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [token, user, navigate]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCharge = 0;
  const totalAmount = subtotal + deliveryCharge;

  const placeOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    try {
      setLoading(true);

      await API.post(
        "/orders",
        { address, paymentMethod },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order Placed Successfully");

      // 🔥 clear cart sync
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/order-success");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">

          <h1 className="checkout-title">Checkout</h1>

          {/* ADDRESS */}
          <div className="checkout-card">

            <h3>📍 Delivery Address</h3>

            <textarea
              placeholder="Enter full delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* PAYMENT */}
          <div className="checkout-card">

            <h3>💳 Payment Method</h3>

            <label>
              <input
                type="radio"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI Payment
            </label>

            <label>
              <input
                type="radio"
                value="CARD"
                checked={paymentMethod === "CARD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card Payment
            </label>

          </div>

        </div>

        {/* RIGHT */}
        <div className="checkout-right">

          <div className="summary-card">

            <h2>🛒 Order Summary</h2>

            {cart.length === 0 ? (
              <p className="empty-text">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div className="summary-item" key={item.product._id}>

                  <img src={item.product.image} />

                  <div>
                    <p className="title">{item.product.title}</p>
                    <p className="qty">Qty: {item.quantity}</p>
                    <p className="price">₹{item.product.price}</p>
                  </div>

                </div>
              ))
            )}

            <hr />

            <div className="row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>

            <div className="row">
              <span>Payment</span>
              <span>{paymentMethod}</span>
            </div>

            <hr />

            <div className="total">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : `Place Order • ₹${totalAmount}`}
            </button>

            <p className="secure">🔒 Secure Checkout</p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;