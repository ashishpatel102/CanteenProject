import React, { useState } from "react";
import { FaHome, FaList, FaUser, FaTag, FaPlus, FaBoxOpen, FaCreditCard } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ setActiveSection }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Orders", icon: <FaList /> },
    { name: "Users", icon: <FaUser /> },
    { name: "All Products", icon: <FaBoxOpen /> },
    { name: "Add Item", icon: <FaPlus /> },
    { name: "Admin Offers", icon: <FaTag /> },
    { name: "PaymentList", icon: <FaCreditCard /> },
  ];

  return (
    <div >
      <h4 className="text-center mb-4 fw-bold text-uppercase">Admin Panel</h4>
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="nav-item"
            style={{
              background: activeItem === item.name ? "#ddffdf" : "transparent",
              borderRadius: "10px",
              transition: "0.3s",
            }}
          >
            <button
              onClick={() => {
                setActiveSection(item.name);
                setActiveItem(item.name);
              }}
              className="nav-link btn-link text-dark d-flex align-items-center py-3 px-3 rounded"
              style={{ fontSize: "16px" }}
            >
              {item.icon} <span className="ms-2">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
