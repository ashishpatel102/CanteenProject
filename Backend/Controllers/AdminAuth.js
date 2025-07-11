
const argon2 = require("argon2");
const { UserModel } = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const { Order } = require("../Models/Order");

async function adminLogin(req, res) {
    const { Username, Password } = req.body;

    try {
        const user = await UserModel.findOne({ Username, Password });

        if (!user || user.role !== "admin") {
            return res.status(401).json({ message: "Admin not found!" });
        }

        const token = jwt.sign(
            { id: user._id, Username: user.Username, role: user.role, Email: user.Email, Phone: user.Phone }, 'ashish84k', { expiresIn: "1d" }
        );

        res.cookie("Token", token, {
            httpOnly: true,
            secure: true, // ✅ true if using https
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ message: "Login successful", data: user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}


async function adminSignup(req, res) {

    const { Username, Email, Phone, Password, role = "admin", SecretKey } = req.body;

    if (!SecretKey || SecretKey !== "ashish84k") {
        return res.status(403).json({ message: "Invalid Secret Key" });
    }

    if (role !== "admin") {
        return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await UserModel.findOne({ Email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    try {
        const newAdmin = new UserModel({
            Username,
            Email,
            Phone,
            Password,
            role,
        });

        await newAdmin.save();

        const token = jwt.sign(
            { id: newAdmin._id, Username, role, Email, Phone },
            "ashish84k",
            { expiresIn: "1d" }
        );

        res.cookie("Token", token, {
            httpOnly: true,
            secure: true, // ✅ true if using https
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ message: "Admin Registered & Logged In Successfully", token, user: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}


async function fetchAdminDashboard(req, res) {
    try {
        const totalOrders = await Order.countDocuments();

        const totalEarningsResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].total : 0;

        const pendingOrders = await Order.countDocuments({ status: "Pending" });

        res.status(200).json({ totalOrders, totalEarnings, pendingOrders });

    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
}


module.exports = { adminLogin, adminSignup, fetchAdminDashboard };
