const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

// No pre-save hook here to avoid 'bcrypt.hash is not a function' weirdness
module.exports = mongoose.model("User", userSchema);