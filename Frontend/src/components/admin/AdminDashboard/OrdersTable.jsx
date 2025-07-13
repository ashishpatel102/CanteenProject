import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import URL from "../../../utils/service";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${URL}/api/Admin/Orders`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(
        `${URL}/api/Admin/Orders/${orderId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      alert("Order deleted successfully!");
      setOrders(orders.filter((order) => order._id !== orderId));
    } catch (error) {
      alert("Error deleting order: " + error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${URL}/api/Admin/Orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      alert("Order status updated!");
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order?.user?.Username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.finalPrice.toString().includes(searchQuery)
  );


  return (
    <div className="mt-4 position-relative">
      <h1 className="mb-4 text-center text-primary fw-bold">Recent Orders</h1>

      <div className="mb-3 form-group">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by Username, Item, Status, or Price..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedUser && (
        <div className="modal-content shadow-lg rounded " style={{ width: "100%", position: 'absolute', left: '-10%', top: '-30%', zIndex: '1000' }}>

          <div className="modal-header bg-light" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h5 className="modal-title text-primary">📦 Order Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setSelectedUser(null)}
              style={{ background: 'red', padding: '10px', display: 'flex', justifyContent: 'center', alignContent: 'center', color: 'white' }}
            ><i class="fa-solid fa-circle-xmark"></i></button>
          </div>


          <div className="modal-body overflow-auto">
            <div className="row" >

              <div className="col-lg-6 col-md-12 border-end px-3 text-start">
                <h6 className="text-primary">🛒 Order Information</h6>
                <hr />
                <p><strong>Item ID:</strong> {selectedUser._id}</p>
                <p><strong>Item Name:</strong> {selectedUser.itemName}</p>
                <p><strong>Order Date:</strong> {new Date(selectedUser.orderDate).toLocaleString()}</p>
                <p><strong>Price:</strong> ₹{selectedUser.price}</p>
                <p><strong>Quantity:</strong> {selectedUser.stock_quantity}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Total Amount:</strong> ₹{selectedUser.finalPrice}</p>
                <p><strong>Discount:</strong> {selectedUser.discount}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>


              <div className="col-lg-6 col-md-12 px-3 text-start">
                <h6 className="text-primary">👤 User Information</h6>
                <hr />
                <p><strong>Email:</strong> {selectedUser.user.Email}</p>
                <p><strong>Phone:</strong> {selectedUser.user.Phone}</p>
                <p><strong>Full Name:</strong> {selectedUser.fullname}</p>
                <p><strong>Role:</strong> {selectedUser.user.role}</p>

                <h6 className="text-primary mt-3">📍 Address</h6>
                <hr />
                <p><strong>City:</strong> {selectedUser.city}</p>
                <p><strong>Country:</strong> {selectedUser.country}</p>
                <p><strong>Full Address:</strong> {selectedUser.fullAddress}</p>
                <p><strong>Pincode:</strong> {selectedUser.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <p className="text-center">Loading Orders...</p>}

      {error && <p className="text-danger text-center">Error: {error}</p>}

      {!loading && !error && filteredOrders.length > 0 ? (
        <table className="table table-hover m-2" style={{ overflow: 'hidden', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,.1)' }}>
          <thead className="table-success text-center">
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Item</th>
              <th>FinalPrice</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id}>
                <td>{index + 1}</td>
                <td>{order?.user?.Username}</td>
                <td>{order.itemName}</td>
                <td>₹{order.finalPrice}</td>
                <td>{order.stock_quantity}</td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <i class="fa-solid fa-trash btn cursor-pointer" onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(order._id);
                  }}></i>
                </td>
                <td className="text-center">
                  <i class="fa-solid fa-circle-info cursor-pointer btn" onClick={() => setSelectedUser(order)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center text-danger fw-bold">No matching orders found!</p>
      )}
    </div>
  );
};

export default OrdersTable;
