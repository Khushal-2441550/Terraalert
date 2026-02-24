const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    alertType: String,
    riskIndex: Number,
    severity: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);