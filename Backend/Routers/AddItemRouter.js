

const express = require("express");
const { AddItemHandaler, upload } = require("../Controllers/AddItemHandaler");
const { authAdminMiddleware } = require("../Middleware/authAdminMiddleware");
const AddItemRouter = express.Router();



AddItemRouter.post("/", authAdminMiddleware, upload.single("image"), AddItemHandaler);

module.exports = { AddItemRouter };


