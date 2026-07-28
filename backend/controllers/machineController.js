const Machine = require('../models/Machine');

const getMachines = async (req, res) => {
  try {
    const fleet = await Machine.find({});
    // The activeFleet is still used internally by the simulator loop for rapid generation,
    // but the system of record is purely MongoDB as returned here.
    return res.json({ success: true, data: fleet });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findOne({ $or: [{ machineId: req.params.id }, { id: req.params.id }] });
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }
    return res.json({ success: true, data: machine });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createMachine = async (req, res) => {
  try {
    const count = await Machine.countDocuments();
    const newId = req.body.id || `MCH-${100 + count + 1}`;
    
    const newMachineState = {
      id: newId,
      name: req.body.name || 'New Stamping Press',
      location: req.body.location || 'Plant A - Cell 04',
      type: req.body.type || 'Hydraulic Press',
      status: 'Healthy',
      temperature: 41.0,
      vibration: 1.2,
      vibrationX: 0.9,
      vibrationY: 1.0,
      vibrationZ: 1.1,
      rpm: 1600,
      voltage: 415,
      current: 10.5,
      pressure: 4.5,
      humidity: 40,
      power: 4.5,
      healthScore: 98,
      lastMaintenance: '2026-07-24',
      sensorId: req.body.sensorId || 'SN-SENS-9901',
      operator: 'Assigned Operator',
      simulationMode: 'NORMAL'
    };
    
    // Also save definitively to MongoDB
    const machineDoc = await Machine.create({
       ...newMachineState,
       machineId: newId
    });

    return res.status(201).json({ success: true, data: machineDoc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMachine = async (req, res) => {
  try {
    const deleted = await Machine.findOneAndDelete({ $or: [{ machineId: req.params.id }, { id: req.params.id }] });
    
    if (!deleted) {
       return res.status(404).json({ success: false, message: 'Machine not found' });
    }
    return res.json({ success: true, message: 'Machine decommissioned successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateMachine = async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await Machine.findOne({ $or: [{ machineId: id }, { id: id }] });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Machine asset not found' });
    }

    const updates = { ...req.body };
    
    if (updates.id && !updates.machineId) updates.machineId = updates.id;
    if (updates.machineId && !updates.id) updates.id = updates.machineId;

    if (updates.temperature !== undefined && updates.temperature !== '') {
      updates.temperature = Number(updates.temperature);
      if (isNaN(updates.temperature) || updates.temperature < 0 || updates.temperature > 150) {
        return res.status(400).json({ success: false, message: 'Temperature must be between 0°C and 150°C' });
      }
    }

    if (updates.vibration !== undefined && updates.vibration !== '') {
      updates.vibration = Number(updates.vibration);
      if (isNaN(updates.vibration) || updates.vibration < 0 || updates.vibration > 20) {
        return res.status(400).json({ success: false, message: 'Vibration RMS must be between 0 and 20 mm/s' });
      }
    }

    if (updates.rpm !== undefined && updates.rpm !== '') {
      updates.rpm = Number(updates.rpm);
      if (isNaN(updates.rpm) || updates.rpm < 0 || updates.rpm > 10000) {
        return res.status(400).json({ success: false, message: 'RPM must be between 0 and 10,000 RPM' });
      }
    }

    if (updates.power !== undefined && updates.power !== '') {
      updates.power = Number(updates.power);
      if (isNaN(updates.power) || updates.power < 0 || updates.power > 500) {
        return res.status(400).json({ success: false, message: 'Load / Power must be between 0 and 500 kW' });
      }
    }

    if (updates.healthScore !== undefined && updates.healthScore !== '') {
      updates.healthScore = Number(updates.healthScore);
      if (isNaN(updates.healthScore) || updates.healthScore < 0 || updates.healthScore > 100) {
        return res.status(400).json({ success: false, message: 'Health Index must be between 0% and 100%' });
      }
    }

    // Auto-calculate health score if temp, vibration, or rpm changed and healthScore not explicitly set
    if ((updates.temperature !== undefined || updates.vibration !== undefined || updates.rpm !== undefined) && updates.healthScore === undefined) {
      const temp = updates.temperature !== undefined ? updates.temperature : existing.temperature;
      const vib = updates.vibration !== undefined ? updates.vibration : existing.vibration;
      const rpmVal = updates.rpm !== undefined ? updates.rpm : existing.rpm;
      
      const { calculateHealthScore } = require('../utils/randomWalk');
      updates.healthScore = calculateHealthScore(temp, vib, rpmVal);
    }

    // Auto status logic if not explicitly provided
    if (!updates.status && updates.healthScore !== undefined) {
      if (updates.healthScore >= 85) updates.status = 'Healthy';
      else if (updates.healthScore >= 60) updates.status = 'Warning';
      else updates.status = 'Critical';
    }

    const updatedMachine = await Machine.findOneAndUpdate(
      { $or: [{ machineId: id }, { id: id }] },
      { $set: updates },
      { new: true, runValidators: true }
    );

    // Save Audit Log
    try {
      const AuditLog = require('../models/AuditLog');
      await AuditLog.create({
        action: `Machine Asset Edit (${updatedMachine.machineId})`,
        user: req.user ? req.user.name : (req.body.editedBy || 'System Engineer'),
        details: `Updated ${updatedMachine.name} (${updatedMachine.machineId}). Attributes changed: ${Object.keys(updates).join(', ')}`,
        ipAddress: req.ip || '127.0.0.1',
      });
    } catch (auditErr) {
      console.warn('AuditLog creation notice:', auditErr.message);
    }

    // Save Telemetry Point if parameters edited
    if (updates.temperature !== undefined || updates.vibration !== undefined || updates.rpm !== undefined || updates.power !== undefined) {
      try {
        const Telemetry = require('../models/Telemetry');
        await Telemetry.create({
          timestamp: new Date(),
          machineId: updatedMachine.machineId,
          temperature: updatedMachine.temperature,
          vibrationRMS: updatedMachine.vibration,
          vibrationX: updatedMachine.vibrationX || (updatedMachine.vibration * 0.7),
          vibrationY: updatedMachine.vibrationY || (updatedMachine.vibration * 0.7),
          vibrationZ: updatedMachine.vibrationZ || (updatedMachine.vibration * 0.7),
          pressure: updatedMachine.pressure || 4.5,
          rpm: updatedMachine.rpm || 1750,
          voltage: updatedMachine.voltage || 415,
          current: updatedMachine.current || 12,
          humidity: updatedMachine.humidity || 45,
          power: updatedMachine.power || 5.5,
        });
      } catch (telErr) {
        console.warn('Telemetry log notice:', telErr.message);
      }
    }

    // Socket.IO broadcast
    const io = req.app.get('io');

    // Process manual edit as telemetry sample through Anomaly Engine (Consecutive Readings Rule)
    const { processTelemetryForAnomalies, consecutiveCounters, CONSECUTIVE_READINGS_THRESHOLD } = require('../services/anomalyEngine');
    await processTelemetryForAnomalies(
      {
        machineId: updatedMachine.machineId,
        temperature: updatedMachine.temperature,
        vibrationRMS: updatedMachine.vibration,
        rpm: updatedMachine.rpm,
        power: updatedMachine.power,
        current: updatedMachine.current || 12,
        voltage: updatedMachine.voltage || 415,
      },
      updatedMachine,
      io
    );

    const alertCounters = {
      temperature: consecutiveCounters[`${updatedMachine.machineId}:temperature`] || 0,
      vibration: consecutiveCounters[`${updatedMachine.machineId}:vibration`] || 0,
      current: consecutiveCounters[`${updatedMachine.machineId}:current`] || 0,
      rpm: consecutiveCounters[`${updatedMachine.machineId}:rpm`] || 0,
      load: consecutiveCounters[`${updatedMachine.machineId}:load`] || 0,
      threshold: CONSECUTIVE_READINGS_THRESHOLD,
    };

    if (io) {
      const Alert = require('../models/Alert');
      const allMachines = await Machine.find({});
      const activeSubset = allMachines.filter(m => m.status !== 'Offline');
      const validTemps = activeSubset.map(m => m.temperature).filter(t => t != null && !isNaN(t));
      const validVibs = activeSubset.map(m => m.vibration).filter(v => v != null && !isNaN(v));
      const activeAlertsCount = await Alert.countDocuments({ status: 'Active' });

      const stats = {
        totalMachines: allMachines.length,
        healthyMachines: allMachines.filter(m => m.status === 'Healthy').length,
        warningMachines: allMachines.filter(m => m.status === 'Warning').length,
        criticalMachines: allMachines.filter(m => m.status === 'Critical').length,
        avgTemperature: validTemps.length > 0 ? Number((validTemps.reduce((a, b) => a + b, 0) / validTemps.length).toFixed(1)) : 45.0,
        avgVibration: validVibs.length > 0 ? Number((validVibs.reduce((a, b) => a + b, 0) / validVibs.length).toFixed(2)) : 1.5,
        readingsToday: 14280,
        alertCount: activeAlertsCount || allMachines.filter(m => m.status === 'Critical' || m.status === 'Warning').length,
        runningMachines: activeSubset.length,
        overallOEE: 87.5,
      };

      io.to('ALL').emit('machine:update', allMachines);
      io.to('ALL').emit('dashboard:update', stats);
      io.to('ALL').emit('alert:counter', { machineId: updatedMachine.machineId, alertCounters });
      io.to(updatedMachine.machineId).emit('machine:update', [updatedMachine]);
    }

    return res.json({
      success: true,
      message: 'Machine configuration updated successfully',
      data: updatedMachine,
      alertCounters,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
