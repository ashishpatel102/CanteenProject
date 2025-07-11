const { UserModel } = require("../Models/userModel");
const jwt = require('jsonwebtoken');

async function getLogin(req, res) {
    return res.json({ name: 'Ashish Patel', password: 11991911 });
}
async function postLogin(req, res) {

    const { Username, Password } = req.body;

    if (!Username) {
        return res.status(400).json({ message: "Username are required.", error: "NULL" });
    }
    if (!Password) {
        return res.status(400).json({ message: "Password are required.", error: "NULL" });
    }

    try {
        var newUser = await UserModel.findOne({ Username });

        if (!newUser) {
            return res.status(401).json({ message: "User name Wrong", error: "User Not Found" });
        }
        const currentUser = await UserModel.findOne({ Username, Password });

        if (!currentUser) {
            return res.status(401).json({ message: "User Not Found Please try again.", error: "User Not Found" });
        }

        const Token = jwt.sign(
            { Username: currentUser.Username, UserId: currentUser._id, role: 'user', Email: currentUser.Email, Phone: currentUser.Phone },
            "ashish84k",
            { expiresIn: "1d" }
        );

        res.cookie("Token", Token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ message: "Login Successful!", data: currentUser });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({ message: "Unexpected server error.", error: "Server Error" });
    }
}

async function getSignUp(req, res) {
    return res.json({ name: 'Ashish Patel', password: 11991911 });
}
async function postSignUp(req, res) {
    const { Username, Password, Email, Phone, role } = req.body;

    if (!Username || !Password || !Email) {
        return res.status(400).json({ message: "Username, Password, and Email are required.", error: "NULL" });
    }

    try {
        let existingUser = await UserModel.findOne({ Username: Username });

        if (existingUser) {
            return res.status(409).json({ message: "Username already exists. Please choose another.", error: "Username Exists" });
        }

        existingUser = await UserModel.findOne({ Email });

        if (existingUser) {
            return res.status(409).json({ message: "Email already exists. Please choose another.", error: "Username Exists" });
        }
        existingUser = await UserModel.findOne({ Phone });

        if (existingUser) {
            return res.status(409).json({ message: "Phone already exists. Please choose another.", error: "Username Exists" });
        }
        const newUser = await UserModel.create({
            Username,
            Password,
            Email,
            Phone: Phone || "",
            role: role || "user",
        });

        if (!newUser) {
            return res.status(500).json({ message: "Failed to create user. Please try again.", error: "Creation Failed" });
        }

        const token = jwt.sign(
            { id: newUser._id, Username: newUser.Username, role: newUser.role, Email: newUser.Email, Phone: newUser.Phone },
            'ashish84k',
            { expiresIn: "1d" }
        );

        res.cookie("Token", token, {
            httpOnly: true,
            secure: true, // ✅ true if using https
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({ message: "User created successfully!", data: newUser });

    } catch (error) {
        console.error("Error:", error);

        return res.status(500).json({ message: "Unexpected server error.", error: "Server Error" });
    }
}



async function userLogout(req, res) {
    try {
        res.clearCookie("Token", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });

        return res.status(200).json({ success: true, message: "Logged out successfully!" });

    } catch (error) {
        console.error("❌ Logout Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Unable to logout!",
            error: error.message
        });
    }
}
module.exports = { getLogin, postLogin, getSignUp, postSignUp, userLogout };
