require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmailHandler = async (userEmail, userName, userMessage) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: userEmail,
      subject: `New Feedback from ${userName}`,
      text: `User Email: ${userEmail}\n\nMessage:\n${userMessage}`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: " + info.response);
    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = { sendEmailHandler };
