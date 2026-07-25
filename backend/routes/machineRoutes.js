const express = require('express');
const router = express.Router();
const {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
} = require('../controllers/machineController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getMachines);
router.get('/:id', protect, getMachineById);
router.post('/', protect, authorize('Admin', 'Engineer'), createMachine);
router.put('/:id', protect, authorize('Admin', 'Engineer'), updateMachine);
router.patch('/:id', protect, authorize('Admin', 'Engineer'), updateMachine);
router.delete('/:id', protect, authorize('Admin'), deleteMachine);

module.exports = router;
