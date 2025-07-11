const { MenuItem } = require('../Models/MenuItem');
const { Offer } = require('../Models/Offer');
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimeType = allowedTypes.test(file.mimetype);

//     if (extName && mimeType) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only images (JPEG, PNG, GIF) are allowed!"), false);
//     }
// };

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const addOffer = async (req, res) => {
  try {
    const { title, category, discount, startDate, endDate } = req.body;

    if (!title || !category || !discount || !startDate || !endDate) {

      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    const serverOrigin = `${req.protocol}://${req.get("host")}`;
    const imagePath = req.file ? `${serverOrigin}/uploads/${req.file.filename}` : `${serverOrigin}/uploads/default.png`;

    console.log("Offer Data:", req.body);
    console.log("Image Path:", imagePath);

    const newOffer = new Offer({
      title,
      category,
      discount,
      startDate,
      endDate,
      image: imagePath,
    });

    await newOffer.save();
    res.status(201).json({ success: true, message: "Offer added successfully!", offer: newOffer });

  } catch (error) {
    console.error("Error in adding offer:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
};


const getOffer = async (req, res) => {



  try {
    const today = new Date();
    const offers = await Offer.find({ endDate: { $gte: today }, isActive: true });

    res.status(200).json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
}

const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found!" });
    }

    if (offer.image) {
      const imagePath = path.join(__dirname, "..", offer.image.replace(`${req.protocol}://${req.get("host")}/`, ""));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Offer image deleted:", imagePath);
      }
    }

    await Offer.findByIdAndDelete(id);
    res.json({ success: true, message: "Offer and image deleted successfully!" });

  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ success: false, message: "Server error!" });
  }
};


const autoDeleteExpiredOffers = async () => {
  try {
    const now = new Date();
    const expiredOffers = await Offer.find({ endDate: { $lte: now } });

    if (expiredOffers.length > 0) {
      for (const offer of expiredOffers) {
        if (offer.image) {
          const imagePath = path.join(__dirname, "..", offer.image.replace(`${req.protocol}://${req.get("host")}/`, ""));
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("Expired offer image deleted:", imagePath);
          }
        }
      }

      await Offer.deleteMany({ endDate: { $lte: now } });
      console.log(`${expiredOffers.length} expired offers and their images deleted successfully.`);
    }
  } catch (error) {
    console.error("Error deleting expired offers:", error);
  }
};

setInterval(autoDeleteExpiredOffers, 3600000);



async function getDiscountOffer(req, res) {

  try {
    const discount = parseInt(req.params.discount);

    if (isNaN(discount)) {
      return res.status(400).json({ success: false, message: "Invalid discount value" });
    }


    const offers = await MenuItem.find({ discount });
    console.log(offers);

    if (!offers.length) {
      return res.status(404).json({ success: false, message: "No offers found with this discount" });
    }

    res.json({ success: true, offers });
  } catch (error) {
    console.error("Error fetching discount offers:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { getOffer, deleteOffer, addOffer, getDiscountOffer, upload };
