const express = require('express');
const router = express.Router();
const { getTelemetryStream } = require('../controllers/telemetryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTelemetryStream);

module.exports = router;
