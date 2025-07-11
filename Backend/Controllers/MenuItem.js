const { MenuItem } = require("../Models/MenuItem");
const jwt = require("jsonwebtoken");
const { Cart } = require("../Models/Cart ");

async function getItems(req, res) {

    try {
        let { page = 1, limit = 20, sortBy = "createdAt", order = "desc" } = req.query;

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

async function setItems(req, res) {
    try {

        const { name, description, price, image_url, stock_quantity, available } = req.body;

        if (!name || !price || !image_url) {
            return res.status(400).json({ success: false, message: "Name, Price & Image URL are required" });
        }

        const newItem = new MenuItem({ name, description, price, image_url, stock_quantity, available });

        await newItem.save();
        res.status(201).json({ success: true, message: "Item added successfully", data: newItem });
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ success: false, message: "Failed to add item" });
    }
}

async function addToCart(req, res) {
    try {

        const token = req.cookies?.Token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - Token missing" });
        }

        const decoded = await jwt.verify(token, "ashish84k");
        const userId = decoded.UserId;


        const item = await MenuItem.findById(req.body.id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        let cartItem = await Cart.findOne({ userId, itemId: req.body.id });

        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cartItem = new Cart({ userId, itemId: req.body.id, quantity: 1 });
        }

        await cartItem.save();

        res.json({ success: true, message: "Item added to cart successfully", data: cartItem });

    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({ success: false, message: "Failed to add item to cart" });
    }
}


async function getToCart(req, res) {
    try {
        const token = req.cookies?.Token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - Token missing" });
        }

        const decoded = await jwt.verify(token, "ashish84k");
        const userId = decoded.UserId;

        const cartItems = await Cart.find({ userId });

        if (!cartItems.length) {
            return res.json({ success: true, message: "Cart is empty", data: [] });
        }

        const itemIds = cartItems.map(cartItem => cartItem.itemId);
        const menuItems = await MenuItem.find({ _id: { $in: itemIds } });

        const cartWithDetails = cartItems.map(cartItem => {
            const item = menuItems.find(menuItem => menuItem._id.toString() === cartItem.itemId.toString());

            return {
                ...item?._doc
            };
        });

        res.json({ success: true, message: "Cart fetched successfully", data: cartWithDetails });

    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, message: "Failed to fetch cart items" });
    }
}




async function removeFromCart(req, res) {
    try {
        const token = req.cookies?.Token;
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized - Token missing" });

        const decoded = await jwt.verify(token, "ashish84k");
        const userId = decoded.UserId;


        const { id } = req.body;


        if (!id || !userId) {
            return res.status(400).json({ success: false, message: "Item ID is required!" });
        }


        const deletedItem = await Cart.findOneAndDelete({ userId, itemId: id });


        if (!deletedItem) {
            return res.status(404).json({ success: false, message: "Item not found in cart!" });
        }

        res.json({ success: true, message: "Item removed successfully!", data: deletedItem });

    } catch (error) {
        console.error("❌ Error removing item:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const UpdateMenu = async (req, res) => {
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
};



module.exports = { getToCart, addToCart, getItems, setItems, removeFromCart, UpdateMenu };
