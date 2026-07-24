const express = require('express');
const router = express.Router();
const { getOeeData } = require('../controllers/oeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getOeeData);

module.exports = router;
