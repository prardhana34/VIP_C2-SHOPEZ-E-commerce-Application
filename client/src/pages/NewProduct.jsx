import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

function NewProduct() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);

  const token = localStorage.getItem("token");

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/products",
        {
          title,
          description,
          category,
          image,
          price,
          stock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Product Added Successfully");

      navigate("/admin/products");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("❌ Failed to Add Product");
    }
  };

  return (
    <div className="new-product-page">

      <div className="new-product-card">

        <h1>➕ Add New Product</h1>

        <form onSubmit={addProduct}>

          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <div className="stock-control">

            <label>Stock:</label>

            <button
              type="button"
              onClick={() =>
                setStock(stock > 1 ? stock - 1 : 1)
              }
            >
              −
            </button>

            <span>{stock}</span>

            <button
              type="button"
              onClick={() => setStock(stock + 1)}
            >
              +
            </button>

          </div>

          <button
            type="submit"
            className="add-product-btn"
          >
            Add Product
          </button>

        </form>

      </div>

    </div>
  );
}

export default NewProduct;