import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function Home({ search = "" }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const productsRef = useRef(null);

  const categories = [
    { name: "Electronics", icon: "⚡" },
    { name: "Groceries", icon: "🛒" },
    { name: "Stationery", icon: "📝" },
    { name: "Home & Kitchen", icon: "🏠" },
    { name: "Fashion", icon: "👕" },
    { name: "Furniture", icon: "🪑" },
  ];

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first 🙏");

    await API.post(
      "/cart/add",
      { productId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Added to cart 🛒");
  };

  const filteredProducts = products
    .filter((p) =>
      (p.title || p.name || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      selectedCategory ? p.category === selectedCategory : true
    );

  return (
    <div className="home-container">

      {/* HERO SECTION (PRO BALANCED) */}
      <div className="hero-section">

        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=2000&q=80"
          alt="Shopez Banner"
        />

        {/* CONTENT (RESTORED) */}
        <div className="hero-content">
          <h1>Welcome to Shopez 🛍️</h1>

          <p>
            Discover premium watches, fashion, electronics & daily essentials — all in one place.
          </p>

          <button
            onClick={() =>
              productsRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Shop Now ✨
          </button>
        </div>

      </div>

      {/* CATEGORY */}
      <div className="category-section">
        <h2>Shop by Categories</h2>

        <div className="category-grid">
          <div
            className={`category-chip ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            🛍️ All
          </div>

          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`category-chip ${
                selectedCategory === cat.name ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.icon} {cat.name}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div ref={productsRef} className="products-section">
        <h2>Featured Products</h2>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="product-card"
onClick={() => {
  if (product?._id) navigate(`/product/${product._id}`);
}}            >
              <img src={product.image} alt="" />
              <h3>{product.title || product.name}</h3>
              <p className="price">₹{product.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;