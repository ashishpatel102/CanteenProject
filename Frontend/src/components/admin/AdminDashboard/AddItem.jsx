import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import URL from "../../../utils/service";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock_quantity: "",
    available: true,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("stock_quantity", formData.stock_quantity);
    formDataToSend.append("available", formData.available);
    if (image) formDataToSend.append("image", image);

    try {
      const response = await fetch(`${URL}/api/add-item`, {
        method: "POST",
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      alert("✅ " + data.message);
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock_quantity: "",
        available: true,
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light">
      <div className="p-4 rounded shadow-lg bg-white" style={{ width: "450px", borderRadius: "20px" }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: "#FF5722" }}> Add New Item</h2>

        {imagePreview && (
          <div className="text-center mb-3">
            <img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", borderRadius: "10px" }} />
          </div>
        )}


        <div className="mb-3">
          <label className="form-label fw-bold">Upload Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Item Name</label>
            <input type="text" className="form-control" placeholder="Enter item name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Price (₹)</label>
            <input type="number" className="form-control" placeholder="Enter price" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Category</label>
            <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Stock Quantity</label>
            <input type="number" className="form-control" placeholder="Enter stock quantity" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Description</label>
            <textarea className="form-control" placeholder="Write a short description..." rows="3" name="description" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="availability" checked={formData.available} onChange={() => setFormData({ ...formData, available: !formData.available })} />
            <label className="form-check-label fw-bold" htmlFor="availability">Available</label>
          </div>

          <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: "#FF5722", color: "white", borderRadius: "10px", padding: "10px" }} disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
