import { useEffect, useState } from "react";
import API from "../api/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(1);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT
  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/products",
        {
          title,
          price,
          image,
          description,
          category,
          stock,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setCategory("");
      setStock(1);

      fetchProducts();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to add product");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="admin-page">

      <h1 className="admin-title">🛠 Admin Products</h1>

      {/* ADD PRODUCT */}
      <div className="admin-section">
        <h2>Add Product</h2>

        <form onSubmit={addProduct} className="add-product-form">

          <input placeholder="Title" value={title}
            onChange={(e) => setTitle(e.target.value)} />

          <input placeholder="Price" type="number" value={price}
            onChange={(e) => setPrice(e.target.value)} />

          <input placeholder="Image URL" value={image}
            onChange={(e) => setImage(e.target.value)} />

          <input placeholder="Category" value={category}
            onChange={(e) => setCategory(e.target.value)} />

          <input placeholder="Stock" type="number" value={stock}
            onChange={(e) => setStock(e.target.value)} />

          <textarea placeholder="Description" value={description}
            onChange={(e) => setDescription(e.target.value)} />

          <button type="submit">Add Product</button>

        </form>
      </div>

      {/* PRODUCTS LIST */}
      <div className="product-grid-admin">

        {products.map((p) => (
          <div key={p._id} className="admin-product-card">

            <img src={p.image} />
            <h3>{p.title}</h3>
            <p>{p.category}</p>
            <p className="price">₹{p.price}</p>

            <button onClick={() => deleteProduct(p._id)}>
              Delete
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default AdminProducts;