require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// Since api/index.js is in a subfolder, we go up to the root
app.use("/api/users", require("../routes/users"));
app.use("/api/reports", require("../routes/reports"));
app.use("/api/alerts", require("../routes/alerts"));

// Static files (Vercel mostly handles this, but Express can as a fallback)
app.use(express.static(path.join(__dirname, "../public")));

// Connect to DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/terraalert";
mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB ERROR:", err));

app.get("/api", (req, res) => {
    res.send("TerraAlert Backend running on Vercel");
});

module.exports = app;
