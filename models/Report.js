const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    city: { type: String, required: true },
    temperature: Number,
    rainfall: Number,
    windSpeed: Number,
    humidity: Number,
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);