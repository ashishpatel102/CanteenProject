const express = require('express');
const { setItems, getItems, getToCart, addToCart, removeFromCart, UpdateMenu } = require('../Controllers/MenuItem');
const { getItemsAdmin, UpdateDiscountAdmin, DeleteAdminMinu } = require('../Controllers/MenuAdminHandaler');
const { authAdminMiddleware } = require('../Middleware/authAdminMiddleware');
const { authMiddleware } = require('../Middleware/authMiddleware');
const MenuRouter = express.Router();


MenuRouter.get('/menu', authMiddleware, getItems).post('/menu', authAdminMiddleware, setItems).patch("/menu/:id", authAdminMiddleware, UpdateMenu);
MenuRouter.get('/menu/Cart', getToCart).post('/menu/Cart', authMiddleware, addToCart).delete('/menu/Cart/remove', authMiddleware, removeFromCart);
MenuRouter.get('/admin/menu', authAdminMiddleware, getItemsAdmin,).delete("/admin/menu/:id", authAdminMiddleware, DeleteAdminMinu).patch('/admin/menu/:id', authAdminMiddleware, UpdateDiscountAdmin)



module.exports = { MenuRouter }

