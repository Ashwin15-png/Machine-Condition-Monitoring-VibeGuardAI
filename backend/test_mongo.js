require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/vibeguard_local";
  console.log("Using URI:", uri.includes('@') ? '***@' + uri.split('@')[1] : uri);
  try {
    await mongoose.connect(uri);
    console.log("SUCCESS");
    process.exit(0);
  } catch (err) {
    console.error("FAIL:", err.message);
    process.exit(1);
  }
}

testConnection();
