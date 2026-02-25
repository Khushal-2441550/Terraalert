const mongoose = require('mongoose');
const Report = require('./models/Report');

mongoose.connect('mongodb://127.0.0.1:27017/terraalert')
    .then(async () => {
        console.log("Connected to MongoDB for migration");
        const count = await Report.countDocuments({ pincode: { $exists: false } });
        console.log(`Found ${count} reports without pincode.`);

        if (count > 0) {
            const result = await Report.updateMany(
                { pincode: { $exists: false } },
                { $set: { pincode: "000000" } }
            );
            console.log(`Successfully updated ${result.modifiedCount} reports.`);
        } else {
            console.log("No reports need updating.");
        }
        process.exit(0);
    })
    .catch(err => {
        console.error("Migration failed:", err);
        process.exit(1);
    });
