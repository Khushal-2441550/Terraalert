const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

router.get("/", async (req, res) => {
    const alerts = await Alert.find().populate("reportId");
    res.json(alerts);
});

module.exports = router;