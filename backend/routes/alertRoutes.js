const express = require('express');
const router = express.Router();
const {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/:id/acknowledge', protect, authorize('Admin', 'Engineer', 'Operator'), acknowledgeAlert);
router.post('/:id/resolve', protect, authorize('Admin', 'Engineer'), resolveAlert);


module.exports = router;
