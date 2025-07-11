const { MenuItem } = require("../Models/MenuItem");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function AddItemHandaler(req, res) {
    try {
        console.log("Received Data:", req.body);
        console.log("Received File:", req.file);

        const { name, description, price, category, stock_quantity, available } = req.body;

        if (!name || !description || !price || !category || !stock_quantity || !req.file) {
            return res.status(400).json({ error: "❌ Missing Required Fields" });
        }

        const serverOrigin = `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${serverOrigin}/uploads/${req.file.filename}`;

        const newItem = new MenuItem({
            name,
            description,
            price,
            category,
            stock_quantity,
            available: available === "true",
            image_url: imageUrl
        });

        await newItem.save();
        res.status(201).json({ message: "✅ Item Added Successfully!", item: newItem });

    } catch (error) {
        console.error("❌ Error Adding Item:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: "❌ Validation Error", details: error.message });
        }

        if (error.code === 11000) {
            return res.status(409).json({ error: "❌ Duplicate Item Found", details: error.keyValue });
        }

        res.status(500).json({ error: "❌ Internal Server Error", details: error.message });
    }
}

module.exports = { AddItemHandaler, upload };
