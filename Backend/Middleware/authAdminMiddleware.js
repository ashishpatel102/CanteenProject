const jwt = require('jsonwebtoken');
const { UserModel } = require('../Models/userModel');


const authAdminMiddleware = async (req, res, next) => {

  console.log("hii");

  try {
    const token = req.cookies.Token;


    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized! No token found." });
    }

    const decoded = jwt.verify(token, "ashish84k");

    if (!decoded || !decoded.role) {
      return res.status(401).json({ success: false, message: "Unauthorized! User not found." });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access Forbidden! You are not an Admin." });
    }

    req.userId = decoded.UserId;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Authentication Error:", error);
    res.status(401).json({ success: false, message: "Unauthorized! Invalid token." });
  }
};

module.exports = { authAdminMiddleware }