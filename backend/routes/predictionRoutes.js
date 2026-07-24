const express = require('express');
const router = express.Router();
const { getPredictiveAnalytics } = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPredictiveAnalytics);

module.exports = router;
