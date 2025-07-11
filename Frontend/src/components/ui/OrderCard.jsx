import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderCard = ({ order }) => {

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge bg-success"><i className="fa-solid fa-check-circle"></i> Delivered</span>;
      case 'Pending':
        return <span className="badge bg-warning text-dark"><i className="fa-solid fa-hourglass-half"></i> Pending</span>;
      case 'Cancelled':
        return <span className="badge bg-danger"><i className="fa-solid fa-times-circle"></i> Cancelled</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  return (
    <div className="col-md-6 mb-4">
      <div className="card shadow-sm border-0 rounded">
        <div className="card-header bg-dark text-white text-center">
          <h5 className="m-0">Order ID: {order._id}</h5>
        </div>

        <div className="card-body">

          <p className="card-text">
            <strong>Status: </strong> {getStatusBadge(order.status)}
          </p>

          <p className="card-text">
            <strong>Total Price: </strong> <span className="text-success fw-bold">₹{order.totalPrice}</span>
          </p>

          <h6 className="fw-bold">Items Ordered:</h6>
          <ul className="list-group list-group-flush">
            {order.items.map((item) => (
              <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong> <br />
                  <small>₹{item.price} x {item.quantity}</small>
                </div>
                <span className="fw-bold text-primary">₹{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-footer text-center bg-light">
          <button className="btn btn-sm btn-outline-primary">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
