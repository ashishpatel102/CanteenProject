import React, { useEffect, useState } from "react";
import { FaUtensils, FaMoneyBillWave, FaClock } from "react-icons/fa";
import URL from "../../../utils/service";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalEarnings: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${URL}/api/Admin/DashboardStats`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();

      setStats(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {loading ? (
        <p className="text-center">Loading Dashboard Stats...</p>
      ) : error ? (
        <p className="text-danger text-center">Error: {error}</p>
      ) : (
        [
          { title: "Total Orders", count: stats.totalOrders, icon: <FaUtensils />, color: "#ff7b54" },
          { title: "Total Earnings", count: `₹${stats.totalEarnings}`, icon: <FaMoneyBillWave />, color: "#4CAF50" },
          { title: "Pending Orders", count: stats.pendingOrders, icon: <FaClock />, color: "#FFC107" },
        ].map((stat, index) => (
          <div className="col text-center rounded-3 p-3 m-1" key={index} style={{ background: `linear-gradient(135deg, ${stat.color}, #ffffff)` }}>
            <div className="stat-card" >
              <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
              <div>
                <h4>{stat.count}</h4>
                <p>{stat.title}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DashboardStats;
