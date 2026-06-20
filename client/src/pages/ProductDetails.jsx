import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data || null);
      } catch (err) {
        console.log("Product fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) return alert("Login required");

    try {
      await API.post(
        "/cart/add",
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/cart");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="center-page">Loading...</div>;
  }

  if (!product) {
    return <div className="center-page">Product not found</div>;
  }

  return (
    <div className="product-details">
      <img src={product.image} alt="" />

      <div className="product-info">
        <h1>{product.title || product.name}</h1>

        <p className="price">₹ {product.price}</p>

        <p className="desc">{product.description}</p>

        <button onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductDetails;