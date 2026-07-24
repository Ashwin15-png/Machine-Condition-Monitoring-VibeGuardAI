require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = "mongodb://mayonash04_db_user:IbiK15wKI8CigDM6@ac-cefqj7x-shard-00-00.yjj9fgg.mongodb.net:27017,ac-cefqj7x-shard-00-01.yjj9fgg.mongodb.net:27017,ac-cefqj7x-shard-00-02.yjj9fgg.mongodb.net:27017/?replicaSet=atlas-2yixy2-shard-0&ssl=true&authSource=admin";
  console.log("Using URI:", uri);
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
