import React, { useState, useEffect } from "react";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import URL from "../../../utils/service";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discounts, setDiscounts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/admin/menu`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch products.");

      const data = await response.json();
      if (!Array.isArray(data.data)) throw new Error("Invalid data format received");

      setProducts(data.data);
      setFilteredProducts(data.data);
      const initialDiscounts = {};
      data.data.forEach((product) => {
        initialDiscounts[product._id] = product.discount || 0;
      });
      setDiscounts(initialDiscounts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscountChange = (productId, value) => {
    const discountValue = Math.max(0, Math.min(100, Number(value)));
    setDiscounts((prev) => ({ ...prev, [productId]: discountValue }));
  };

  const applyDiscount = async (productId) => {
    const discountValue = discounts[productId];

    try {
      const response = await fetch(`${URL}/admin/menu/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discount: discountValue }),
      });

      if (!response.ok) throw new Error("Failed to update discount");

      alert("✅ Discount applied successfully!");
    } catch (err) {
      alert("❌ Error updating discount: " + err.message);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`${URL}/admin/menu/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      alert("🗑 Product deleted successfully!");
      const updatedProducts = products.filter((product) => product._id !== productId);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
    } catch (err) {
      alert("❌ Error deleting product: " + err.message);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => {
          return product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term) || product.price.toString().includes(term)
        });
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="mb-4 text-center fw-bold">All Products</h2>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Search by Name or Category..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form.Group>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <div className="table-responsive">
          <Table striped bordered hover className="text-center" style={{ overflow: 'hidden', boxShadow: '0px 0px 10px rbga(0,0,0,.1)' }}>
            <thead className="table-success text-white">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Discount (%)</th>
                <th>Final Price (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const discount = discounts[product._id] || 0;
                const finalPrice = product.price - (product.price * discount) / 100;

                return (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td><strong>₹{product.price}</strong></td>
                    <td>
                      <Form.Control
                        type="number"
                        value={discount}
                        onChange={(e) => handleDiscountChange(product._id, e.target.value)}
                        min="0"
                        max="100"
                      />
                    </td>
                    <td><strong>₹{finalPrice.toFixed(2)}</strong></td>
                    <td style={{ display: 'flex', whiteSpace: 'nowrap' }}>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => applyDiscount(product._id)}
                      >
                        Apply Discount
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="ms-2"
                        onClick={() => deleteProduct(product._id)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {filteredProducts.length === 0 && (
            <Alert variant="warning" className="text-center mt-3">
              😕 No products found!
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
