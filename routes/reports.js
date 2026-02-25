const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const Alert = require("../models/Alert");

// Add Report
router.post("/", async (req, res) => {
    try {
        const { city, pincode, temperature, rainfall, windSpeed, humidity } = req.body;

        const newReport = new Report({
            city,
            pincode,
            temperature,
            rainfall,
            windSpeed,
            humidity
        });

        const savedReport = await newReport.save();

        // 🔥 ALERT LOGIC
        let risk = ((temperature / 50) + (rainfall / 300) + (windSpeed / 150)) * 100;
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

// Search Report by city or pincode
router.get("/search/:query", async (req, res) => {
    try {
        const regex = new RegExp(req.params.query, 'i');
        const reports = await Report.find({
            $or: [{ city: { $regex: regex } }, { pincode: { $regex: regex } }]
        }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update Report
router.put("/:id", async (req, res) => {
    try {
        console.log("Updating report ID:", req.params.id);
        const { city, pincode, temperature, rainfall, windSpeed, humidity } = req.body;

        const updatedReport = await Report.findByIdAndUpdate(
            req.params.id,
            { city, pincode, temperature, rainfall, windSpeed, humidity },
            { new: true }
        );

        if (!updatedReport) return res.status(404).json({ message: "Report not found" });

        // 🔥 UPDATE ALERT LOGIC
        let risk = ((temperature / 50) + (rainfall / 300) + (windSpeed / 150)) * 100;
        let severity = "Low";

        if (risk >= 30 && risk < 60) severity = "Moderate";
        if (risk >= 60) severity = "High";

        let alertType = "Normal";

        if (temperature > 40) alertType = "Heatwave";
        if (rainfall > 200) alertType = "Flood";
        if (windSpeed > 100) alertType = "Cyclone";

        let existingAlert = await Alert.findOne({ reportId: req.params.id });
        if (existingAlert) {
            existingAlert.alertType = alertType;
            existingAlert.riskIndex = risk;
            existingAlert.severity = severity;
            existingAlert.message = `${alertType} Risk in ${city}`;
            await existingAlert.save();
        } else {
            const newAlert = new Alert({
                reportId: updatedReport._id,
                alertType,
                riskIndex: risk,
                severity,
                message: `${alertType} Risk in ${city}`
            });
            await newAlert.save();
        }

        res.json({ message: "Report & Alert Updated", risk, severity });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json(error);
    }
});

// Delete Report
router.delete("/:id", async (req, res) => {
    try {
        console.log("Deleting report ID:", req.params.id);
        const reportId = req.params.id;
        const deletedReport = await Report.findByIdAndDelete(reportId);
        const deletedAlert = await Alert.findOneAndDelete({ reportId: reportId });

        console.log("Deleted Report:", deletedReport);
        console.log("Deleted Alert:", deletedAlert);

        res.json({ message: "Report & Associated Alert Deleted" });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json(error);
    }
});

module.exports = router;