require("dotenv").config();
const mongoose = require("mongoose");

// IMPORTANT: Load all models so mongoose registers them
require("./models/Student");
require("./models/Badge");
require("./models/Project");
require("./models/Event");
require("./models/Announcement");

const { getDashboardData } = require("./controllers/dashboardController");
const redis = require("./config/redis");

async function connectDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect('mongodb://127.0.0.1:27017/codeItOutHackathon');
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

// Mock Express req & res
function createMockReqRes(studentId) {
    const req = { user: { id: studentId } };

    const res = {
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(data) {
            console.log("\nResponse status:", this.statusCode);
            console.log("Response:", JSON.stringify(data, null, 2));
        }
    };

    return { req, res };
}

async function runTest() {
    await connectDB();
    console.log("Redis connected:", !!redis);

    const studentId = "69033b2e4ed2af41f578327f"; // your real _id

    const { req, res } = createMockReqRes(studentId);

    console.log("\n===== FIRST CALL (Cache MISS) =====");
    const t1 = Date.now();
    await getDashboardData(req, res);
    console.log("Time:", Date.now() - t1, "ms");

    console.log("\n===== SECOND CALL (Cache HIT) =====");
    const t2 = Date.now();
    await getDashboardData(req, res);
    console.log("Time:", Date.now() - t2, "ms");

    await mongoose.disconnect();
    redis.quit();
}

runTest();
