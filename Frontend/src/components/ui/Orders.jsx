import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.css";
import URL from "../../utils/service";

export default function Orders() {
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const data = sessionStorage.getItem("Temp");
    if (data) {
      setOrderData(JSON.parse(data));
    }
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await fetch(`${URL}/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setOrderData((prev) => ({ ...prev, status: "Cancelled" }));
        setOrderData(data.data);
        sessionStorage.setItem("Temp", JSON.stringify(data.data));

      } else {
        alert("Failed to cancel order.");
      }
    } catch (error) {
      alert("Error cancelling order. Try again.");
    }
  };

  return (
    <div className="order-container d-flex justify-content-center align-items-center">
      <div className="order-card d-flex flex-md-row flex-column overflow-hidden rounded shadow-lg bg-white">

        <div className="order-image-box d-flex align-items-center justify-content-center position-relative">
          <div className="image-background"></div>
          <img
            src={orderData?.image_url || "/placeholder.jpg"}
            alt="Order Item"
            className="order-image position-relative"
          />
        </div>

        <div className="order-details m-2 rounded-3 p-4 d-flex flex-column">
          <h5 className="text-white fw-bold">{orderData?.itemName || "Product Name"}</h5>
          <p className="text-white small">{orderData?.description || "Product description goes here..."}</p>
          <h4 className="fw-bold">₹{orderData?.finalPrice || "0.00"}</h4>
          <div className="order-meta">
            <p className="text-white"><strong>Name:</strong> {orderData?.fullname || "N/A"}</p>
            <p className="text-white"><strong>Email:</strong> {orderData?.email || "N/A"}</p>
            <p className="text-white"><strong>Phone:</strong> {orderData?.phone || "N/A"}</p>
            <p className="text-white"><strong>City:</strong> {orderData?.city || "N/A"}</p>
            <p className="text-white"><strong>Quantity:</strong> {orderData?.stock_quantity || "N/A"}</p>
            <p className="text-white"><strong>Status:</strong> <span className={`badge ${orderData?.status === "Cancelled" ? "bg-danger" : "bg-warning"}`}>{orderData?.status || "Pending"}</span></p>
            <p className="text-white"><strong>Order Date:</strong> {orderData?.orderDate ? new Date(orderData.orderDate).toLocaleString() : "N/A"}</p>
          </div>

          {orderData?.status !== "Cancelled" && (
            <div className="order-actions d-flex flex-column gap-2 mt-3">
              <button className="btn btn-danger w-100" onClick={(e) => { e.stopPropagation(); cancelOrder(orderData._id); }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
