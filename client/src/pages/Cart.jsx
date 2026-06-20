import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id, action) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        "/cart/update",
        { productId: id, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeItem = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await API.delete("/cart/remove", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        productId: id,
      },
    });

    await fetchCart();

    window.dispatchEvent(new Event("cartUpdated"));

  } catch (err) {
    console.log(err);
  }
};

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="cart-page">

      {/* LEFT */}
      <div className="cart-left">

        <div className="cart-heading">
          <h1>Shopping Cart</h1>
          <p>Review your selected items before checkout</p>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add products to see them here</p>

            <button
              onClick={() => navigate("/")}
              className="shop-btn"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cart.map((item) => (
            <div className="cart-card" key={item.product._id}>

              <img
                src={item.product.image}
                alt=""
                className="cart-img"
              />

              <div className="cart-info">

                <h3>{item.product.title}</h3>

                <p className="price">
                  ₹{item.product.price}
                </p>

                <div className="qty">

                  <button
                    onClick={() =>
                      updateQty(item.product._id, "dec")
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(item.product._id, "inc")
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove"
                  onClick={() =>
                    removeItem(item.product._id)
                  }
                >
                  Remove
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* RIGHT SUMMARY */}
      {cart.length > 0 && (
        <div className="cart-right">

          <div className="summary">

            <h2>Order Summary</h2>

            <div className="row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="row">
              <span>Delivery</span>
              <span>FREE</span>
            </div>

            <div className="row">
              <span>Taxes</span>
              <span>Included</span>
            </div>

            <hr />

            <div className="total">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              className="checkout"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

            <p className="small">
              Secure payment • Fast delivery
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;