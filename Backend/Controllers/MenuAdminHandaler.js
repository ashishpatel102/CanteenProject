const { MenuItem } = require("../Models/MenuItem");
const jwt = require("jsonwebtoken");
const { Cart } = require("../Models/Cart ");

async function getItemsAdmin(req, res) {

    try {

        let { page = 1, limit = 100, sortBy = "createdAt", order = "desc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        order = order === "desc" ? -1 : 1;

        const items = await MenuItem.find({})
            .sort({ [sortBy]: order })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalItems = await MenuItem.countDocuments();

        res.json({
            success: true,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            data: items,
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


async function UpdateDiscountAdmin(req, res) {
    const { id } = req.params;
    const { discount } = req.body;

    try {
        const product = await MenuItem.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const validDiscount = Math.max(0, Math.min(100, Number(discount)));

        const finalPrice = product.price - (product.price * validDiscount) / 100;

        const updatedProduct = await MenuItem.findByIdAndUpdate(
            id,
            { discount: validDiscount, finalPrice: finalPrice },
            { new: true }
        );

        res.json({ message: "Discount updated successfully", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


const DeleteAdminMinu = async (req, res) => {
    try {
        const deletedProduct = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully", data: deletedProduct });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


module.exports = { getItemsAdmin, UpdateDiscountAdmin, DeleteAdminMinu };