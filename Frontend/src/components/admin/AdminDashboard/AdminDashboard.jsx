import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardStats from "./DashboardStats";
import OrdersTable from "./OrdersTable";
import UsersList from "./UsersList";
import SidebarToggleButton from "./SidebarToggleButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import useVerify from "../../../utils/VeryfyAdmin";
import AddItem from "./AddItem";
import AllProducts from "./AllProducts";
import AdminOffers from "./AdminOffers";
import PaymentList from "../PaymentList";



const AdminDashboard = () => {
  useVerify();
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 993);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 993);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex">

      {window.innerWidth < 993 && <SidebarToggleButton toggleSidebar={toggleSidebar} />}

      {isSidebarOpen && (
        <div className="sidebar-container">
          <Sidebar setActiveSection={setActiveSection} />
        </div>
      )}

      <div className="main-content container-fluid p-4">
        {activeSection === "Dashboard" && <DashboardStats />}
        {activeSection === "Orders" && <OrdersTable />}
        {activeSection === "Users" && <UsersList />}
        {activeSection === "Add Item" && <AddItem />}
        {activeSection === "All Products" && <AllProducts />}
        {activeSection === "Admin Offers" && <AdminOffers />}
        {activeSection === "PaymentList" && <PaymentList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
