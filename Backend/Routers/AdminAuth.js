
const express = require("express");
const AdminAuth = express.Router();
const { adminLogin, adminSignup, fetchAdminDashboard } = require("../Controllers/AdminAuth");
const { authAdminMiddleware } = require("../Middleware/authAdminMiddleware");


AdminAuth.post("/signup", adminSignup);



AdminAuth.get("/DashboardStats", authAdminMiddleware, fetchAdminDashboard).post("/login", adminLogin);

module.exports = AdminAuth;

