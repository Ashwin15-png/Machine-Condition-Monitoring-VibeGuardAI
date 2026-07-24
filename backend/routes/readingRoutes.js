const express = require("express");
const router = express.Router();

const {
  addReading,
  getReadings
} = require("../controllers/readingController");
const { protect, authorize } = require("../middleware/authMiddleware");

// POST /api/readings
router.post("/", protect, authorize('Admin', 'Engineer'), addReading);

// GET /api/readings
router.get("/", protect, getReadings);

module.exports = router;