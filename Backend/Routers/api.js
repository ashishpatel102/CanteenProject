
const express = require('express');
const { getApi, setApi, orderCancel, OrderRemove } = require('../Controllers/apiHandler');
const { getAdminApi, setAdminApi, deleteAdminApi } = require('../Controllers/apiAdminHandler');
const { authMiddleware } = require('../Middleware/authMiddleware');
const { Order } = require('../Models/Order');
const { authAdminMiddleware } = require('../Middleware/authAdminMiddleware');
const apiRouter = express.Router();



apiRouter.get("/orders", authMiddleware, getApi).post("/orders", authMiddleware, setApi).delete("/orders/:id", authMiddleware, OrderRemove).patch('/orders/:orderId/cancel', authMiddleware, orderCancel);
apiRouter.get("/Admin/Orders", authAdminMiddleware, getAdminApi).put("/Admin/Orders/:id", authAdminMiddleware, setAdminApi).delete("/Admin/Orders/:id", authAdminMiddleware, deleteAdminApi)

module.exports = { apiRouter }
