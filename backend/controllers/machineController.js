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

module.exports = {
  getMachines,
  getMachineById,
  createMachine,
  deleteMachine,
};
