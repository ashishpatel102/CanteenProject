import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import verify from "../../utils/Veryfy";
import "./OrderAll.css";
import URL from "../../utils/service";

const OrderAll = () => {
  verify();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${URL}/api/orders`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        if (data.success && Array.isArray(data.orders)) {

          setOrders(data.orders);
        } else {
          setError("No orders found.");
        }
      } catch (err) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: "Cancelled" } : order
          )
        );
      } else {
        alert("Failed to cancel order.");
      }
    } catch (error) {
      alert("Error cancelling order. Try again.");
    }
  };

  const removeOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to remove this order?")) return;
    try {
      const response = await fetch(`${URL}/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== orderId));
      } else {
        alert("Failed to remove order from database.");
      }
    } catch (error) {
      alert("Error removing order. Try again.");
    }
  };

  const handleOrderClick = (order) => {
    sessionStorage.setItem("Temp", JSON.stringify(order));
    navigate(`/orders`);
  };

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  return (
    <div className="orderall ">

      <h2 className="text-center mb-4">My Orders</h2>


      <div className="p-2 mb-4 OrderAll-nav">
        {["All", "Delivered", "Completed", "Pending", "Cancelled"].map((status) => (
          <button
            key={status}
            className={`btn mx-1 ${filter === status ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>


      {loading ? (
        <div className="container p-0 m-0" style={{ gridTemplateColumns: '1fr' }} >
          <div className="col text-center text-secondary">Loading orders...</div>
        </div>
      ) : error ? (
        <div className="container p-0 m-0" style={{ gridTemplateColumns: '1fr' }} >
          <div className="col text-center text-danger">{error}</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="container p-0 m-0" style={{ gridTemplateColumns: '1fr' }} >
          <div className="col text-center text-warning bg-light">No Orders Found</div>
        </div>
      ) : (
        <div className="container p-0 m-0">

          {filteredOrders.map((order) => (
            <div key={order._id} className="col" style={{ position: 'relative' }}>
              <div className="OrderAll-Card" style={{ cursor: "pointer" }}>
                <div className="OrderAll-Card-body" style={{ width: 'auto' }}>
                  <img
                    src={order.image_url}
                    alt={order.itemName}
                    className="rounded-circle mb-3"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                  <div>
                    <h5 className="mb-2">{order.itemName}</h5>
                    <p className="text-muted mb-2">₹{order.finalPrice}</p>

                    <span
                      className={`badge ${order.status === "Delivered"
                        ? "text-success"
                        : order.status === "Pending"
                          ? "text-warning"
                          : "text-danger"
                        }`}
                    >
                      {order.status}
                    </span>

                    <button
                      className="btn"
                      onClick={() => handleOrderClick(order)}
                      style={{ padding: "0", margin: "10px" }}
                    >
                      <i className="fa-solid fa-circle-info text-dark"></i>
                    </button>

                    {order.status === "Cancelled" && (
                      <button
                        className="btn text-danger"
                        onClick={() => removeOrder(order._id)}
                        style={{ padding: "0", margin: "10px" }}
                      >
                        <i className="fa-solid fa-trash text-dark"></i>
                      </button>
                    )}
                  </div>

                  {order.status !== "Delivered" && order.status !== "Cancelled" && (
                    <button
                      className="btn text-danger"
                      style={{ position: 'absolute', right: '0%' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelOrder(order._id);
                      }}
                    >
                      <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
          }
        </div>
      )}
    </div >
  );
};

export default OrderAll;




