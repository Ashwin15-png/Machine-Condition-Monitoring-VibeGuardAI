const express = require('express');
const router = express.Router();
const { getActiveFleet } = require('../services/simulatorService');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, (req, res) => {
  const fleet = getActiveFleet();
  const sensors = fleet.map((m) => ({
    sensorId: m.sensorId,
    machineId: m.id,
    machineName: m.name,
    sensorType: 'Tri-Axial Accelerometer & Thermal Pt100',
    currentValue: m.vibration,
    unit: 'mm/s',
    maxThreshold: 6.5,
    status: m.status,
    lastUpdated: new Date().toISOString(),
  }));
  res.json({ success: true, data: sensors });
});

module.exports = router;
