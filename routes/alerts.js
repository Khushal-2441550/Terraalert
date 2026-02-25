const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

router.get("/", async (req, res) => {
    const alerts = await Alert.find().populate("reportId");
    res.json(alerts);
});

router.get("/:id", async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id).populate("reportId");
        if (!alert) return res.status(404).json({ message: "Alert not found" });
        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;