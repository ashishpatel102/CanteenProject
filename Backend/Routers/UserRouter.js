const express = require('express');
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require('../Models/userModel');
const { fetchAllUsers, deleteUser, toggleRole } = require('../Controllers/fetchAllUser');
const cookieParser = require("cookie-parser");
const { authAdminMiddleware } = require('../Middleware/authAdminMiddleware');

UserRouter.use(cookieParser());


UserRouter.get('/', authAdminMiddleware, fetchAllUsers);
UserRouter.delete("/:id", authAdminMiddleware, deleteUser);
UserRouter.put("/toggle-role/:id", authAdminMiddleware, toggleRole);

module.exports = { UserRouter };