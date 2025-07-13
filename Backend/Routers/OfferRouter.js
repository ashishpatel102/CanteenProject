const express = require('express');
const OfferRouter = express.Router();
const { addOffer, getOffer, deleteOffer, getDiscountOffer, upload } = require('../Controllers/OfferHandler');
const { authAdminMiddleware } = require('../Middleware/authAdminMiddleware');
const { authMiddleware } = require('../Middleware/authMiddleware');


OfferRouter.get('/offers', getOffer).get('/offers/discount/:discount', authMiddleware, getDiscountOffer).post('/offers/add', authAdminMiddleware, upload.single("image"), addOffer).delete("/offers/:id", authAdminMiddleware, deleteOffer);


module.exports = { OfferRouter }

