
const express = require("express");
const DashboardRouter = express.Router();
const { fetchAdminDashboard } = require("../Controllers/AdminDashboard");
const { authAdminMiddleware } = require("../Middleware/authAdminMiddleware");



DashboardRouter.get("/DashboardStats", authAdminMiddleware, fetchAdminDashboard)

module.exports = DashboardRouter;

