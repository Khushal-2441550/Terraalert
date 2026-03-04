const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "terraalert_local_dev_secret";

// Register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Register endpoint hit for:", email);
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("Checking if user exists...");

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        console.log("User does not exist, hashing password...");
        // Hash password here
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Password hashed successfully.");

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        console.log("Saving user to DB...");
        await newUser.save();
        console.log("User saved successfully:", email);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user: { username: user.username, email: user.email, profilePic: user.profilePic } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
