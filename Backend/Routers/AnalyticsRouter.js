const express = require("express");
const { UserModel } = require("../Models/userModel");
const { Order } = require("../Models/Order");
const AnalyticsRouter = express.Router();
const { authAdminMiddleware } = require('../Middleware/authAdminMiddleware');

const getMonthName = (monthNumber) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNumber];
};

AnalyticsRouter.get("/", authAdminMiddleware, async (req, res) => {
  try {

    const totalUsers = await UserModel.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$finalPrice" }
        }
      }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalAmount : 0;

    const orders = await Order.find({}, "orderDate totalAmount userId");

    let monthlyData = {};

    orders.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const month = getMonthName(orderDate.getMonth());

      if (!monthlyData[month]) {
        monthlyData[month] = { sales: 0, users: new Set() };
      }

      monthlyData[month].sales += order.totalAmount;

      monthlyData[month].users.add(order.userId);
    });

    const chartData = Object.keys(monthlyData).map(month => ({
      name: month,
      sales: monthlyData[month].sales,
      users: monthlyData[month].users.size
    }));

    res.json({
      users: totalUsers,
      orders: totalOrders,
      revenue: totalRevenue,
      chartData
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { AnalyticsRouter };
