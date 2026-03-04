const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection (Hardcoded for local use with Compass/mongosh)
mongoose.connect("mongodb://127.0.0.1:27017/terraalert")
    .then(() => console.log("MongoDB Connected Locally"))
    .catch(err => console.log(err));

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/alerts", require("./routes/alerts"));

// Removed overlapping root route for Vercel static serving

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));