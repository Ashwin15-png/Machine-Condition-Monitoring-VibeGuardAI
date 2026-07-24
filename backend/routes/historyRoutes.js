const express = require('express');
const router = express.Router();
const { getHistoryLogs, exportHistoryLogsCSV } = require('../controllers/telemetryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHistoryLogs);
router.get('/export/csv', protect, exportHistoryLogsCSV);

module.exports = router;
