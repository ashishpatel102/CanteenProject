const express = require("express");
const { sendEmailHandler } = require("../Controllers/sendEmailHandler");
const EmailRouter = express.Router();

EmailRouter.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log(name, email, message);

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required (name, email, message)" });
    }

    console.log(`📩 Sending email to: ${email}, Subject: New Message from ${name}`);

    // ✅ Sending Email
    const response = await sendEmailHandler(email, `New Message from ${name}`, message);

    // ✅ Response
    res.status(200).json(response);

  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = { EmailRouter };
