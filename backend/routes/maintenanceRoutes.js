const express = require('express');
const router = express.Router();
const { getMaintenanceTasks, createMaintenanceTask, updateTaskStatus } = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getMaintenanceTasks);
router.post('/', protect, authorize('Admin', 'Engineer'), createMaintenanceTask);
router.patch('/:id/status', protect, authorize('Admin', 'Engineer'), updateTaskStatus);

module.exports = router;
