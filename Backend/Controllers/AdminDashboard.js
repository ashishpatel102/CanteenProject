
const jwt = require("jsonwebtoken");
const { Order } = require("../Models/Order");
const { Payment } = require("../Models/Pyment");


async function fetchAdminDashboard(req, res) {
    try {
        const totalOrders = await Order.countDocuments();

        const totalEarningsResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$finalPrice" } } },
        ]);
        const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].total : 0;

        const pendingOrders = await Order.countDocuments({ status: "Pending" });

        res.status(200).json({ totalOrders, totalEarnings, pendingOrders });

    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
}


module.exports = { fetchAdminDashboard };
