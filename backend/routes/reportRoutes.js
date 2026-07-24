const express = require('express');
const router = express.Router();
const { exportCSV, exportJSON, exportExcel, exportPDF } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/csv', protect, exportCSV);
router.get('/json', protect, exportJSON);
router.get('/excel', protect, exportExcel);
router.get('/pdf', protect, exportPDF);

module.exports = router;
