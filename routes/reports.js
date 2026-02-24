const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Alert = require("../models/Alert");

// Add Report
router.post("/", async (req, res) => {
    try {
        const { city, temperature, rainfall, windSpeed, humidity } = req.body;

        const newReport = new Report({
            city,
            temperature,
            rainfall,
            windSpeed,
            humidity
        });

        const savedReport = await newReport.save();

        // 🔥 ALERT LOGIC
        let risk = ((temperature/50) + (rainfall/300) + (windSpeed/150)) * 100;
        let severity = "Low";

        if (risk >= 30 && risk < 60) severity = "Moderate";
        if (risk >= 60) severity = "High";

        let alertType = "Normal";

        if (temperature > 40) alertType = "Heatwave";
        if (rainfall > 200) alertType = "Flood";
        if (windSpeed > 100) alertType = "Cyclone";

        const newAlert = new Alert({
            reportId: savedReport._id,
            alertType,
            riskIndex: risk,
            severity,
            message: `${alertType} Risk in ${city}`
        });

        await newAlert.save();

        res.json({ message: "Report & Alert Generated", risk, severity });

    } catch (error) {
        res.status(500).json(error);
    }
});

// Get All Reports
router.get("/", async (req, res) => {
    const reports = await Report.find();
    res.json(reports);
});

module.exports = router;