const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../problemService/.env'), override: true });
console.log("Problem DB URI:", process.env.Mongo_uri ? "FOUND" : "NOT FOUND");
if (process.env.Mongo_uri) {
    const masked = process.env.Mongo_uri.replace(/:([^@]+)@/, ":****@");
    console.log("Masked URI:", masked);
}

const mongoose = require('mongoose');

async function test() {
    try {
        console.log("Testing Problem DB connection...");
        await mongoose.connect(process.env.Mongo_uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to Problem DB.");
        await mongoose.disconnect();

        console.log("Testing AI Service DB connection...");
        require('dotenv').config({ path: path.join(__dirname, '../../.env'), override: true });
        await mongoose.connect(process.env.Mongo_uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to AI Service DB.");
        await mongoose.disconnect();

        process.exit(0);
    } catch (err) {
        console.error("CONNECTION FAILED:", err.message);
        process.exit(1);
    }
}

test();
