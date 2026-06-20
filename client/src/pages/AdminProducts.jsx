import { useEffect, useState } from "react";
import API from "../api/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

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

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-page">

      <h1 className="admin-title">
        📦 Product Management
      </h1>

      <div className="product-grid-admin">

        {products.map((product) => (
          <div
            key={product._id}
            className="admin-product-card"
          >
            <img
              src={product.image}
              alt={product.title}
            />

            <h3>{product.title}</h3>

            <p className="product-category">
              {product.category}
            </p>

            <p className="product-desc">
              {product.description}
            </p>

            <p className="price">
              ₹ {product.price}
            </p>

            <p className="stock">
              Stock: {product.stock}
            </p>

            <button
              onClick={() =>
                deleteProduct(product._id)
              }
            >
              Delete Product
            </button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default AdminProducts;