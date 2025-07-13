import React, { useState, useEffect } from "react";
import { Table, Button, Form, Spinner, Container, Row, Col, Alert } from "react-bootstrap";
import URL from "../../../utils/service";

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOffer, setNewOffer] = useState({
    title: "",
    category: "",
    discount: "",
    startDate: "",
    endDate: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${URL}/admin/offers`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch offers!");

      const data = await response.json();

      if (!Array.isArray(data.offers)) throw new Error("Invalid response format!");

      setOffers(data.offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setNewOffer((prev) => ({ ...prev, image: file }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleAddOffer = async () => {
    const formData = new FormData();

    Object.entries(newOffer).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(`${URL}/admin/offers/add`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to add offer!");

      alert("✅ Offer Added!");
      setNewOffer({
        title: "",
        category: "",
        discount: "",
        startDate: "",
        endDate: "",
        image: null,
      });
      setPreviewImage(null);
      fetchOffers();
    } catch (error) {
      console.error("Error adding offer:", error);
      setError("Failed to add offer. Try again.");
    }
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`${URL}/admin/offers/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete offer!");

      fetchOffers();
    } catch (error) {
      console.error("Error deleting offer:", error);
      setError("Failed to delete offer. Try again.");
    }
  };

  return (
    <div className="adminOffers">


      <h2 className="mb-4 text-center text-primary fw-bold">Manage Offers</h2>
      <Container className="mt-4 container" style={{}}>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="p-4 mb-4 border rounded shadow">
          <h4 className="text-secondary mb-3"><i class="fa-solid fa-add"></i> Add New Offer</h4>
          <Form>
            <Row className="g-3">
              <Col md={6} xs={12}>
                <label className="fw-bold">Title</label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={newOffer.title}
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                />
              </Col>
              <Col md={6} xs={12}>
                <label className="fw-bold">Category</label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={newOffer.category}
                  onChange={(e) => setNewOffer({ ...newOffer, category: e.target.value })}
                />
              </Col>
              <Col md={4} xs={12}>
                <label className="fw-bold">Discount (%)</label>
                <Form.Control
                  type="number"
                  placeholder="Discount"
                  value={newOffer.discount}
                  onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
                />
              </Col>
              <Col md={4} xs={12}>
                <label className="fw-bold">Start Date</label>
                <Form.Control
                  type="date"
                  value={newOffer.startDate}
                  onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
                />
              </Col>
              <Col md={4} xs={12}>
                <label className="fw-bold">End Date</label>
                <Form.Control
                  type="date"
                  value={newOffer.endDate}
                  onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
                />
              </Col>
              <Col xs={12}>
                <label className="fw-bold">Image Upload</label>
                <Form.Control type="file" onChange={handleImageUpload} />
                {previewImage && <img src={previewImage} alt="Preview" className="mt-2" width={100} />}
              </Col>
              <Col xs={12} className="text-center">
                <Button variant="success" onClick={handleAddOffer} className="w-50 fw-bold mt-3">
                  <i class="fa-solid fa-plus"></i> Add Offer
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="p-3 border rounded shadow">
          <h4 className="text-secondary">📋 Existing Offers</h4>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" size="lg" />
            </div>
          ) : offers.length === 0 ? (
            <p className="text-center text-muted">No offers available.</p>
          ) : (
            <Table responsive striped bordered hover className="text-center">
              <thead className="bg-dark text-white">
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Discount</th>
                  <th>Valid Till</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id}>
                    <td>{offer.title}</td>
                    <td>{offer.category}</td>
                    <td className="text-success fw-bold">{offer.discount}%</td>
                    <td className="text-danger fw-bold">{new Date(offer.endDate).toLocaleDateString()}</td>
                    <td>
                      <i class="fa-solid fa-trash btn" onClick={() => handleDeleteOffer(offer._id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </div>
  );
};

export default AdminOffers;
