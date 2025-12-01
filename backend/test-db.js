const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://HillWay077:oqSv0ezzLoHOB2CD@cluster0.c35xwd1.mongodb.net/travel_db?retryWrites=true&w=majority&appName=Cluster0";

async function connect() {
    try {
        console.log("Attempting to connect...");
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Connection failed:", error);
        process.exit(1);
    }
}

connect();
