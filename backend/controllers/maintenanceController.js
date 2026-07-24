const Maintenance = require('../models/Maintenance');

const getMaintenanceTasks = async (req, res) => {
  try {
    const tasks = await Maintenance.find({}).sort({ scheduledDate: -1 });
    return res.json({ success: true, data: tasks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createMaintenanceTask = async (req, res) => {
  try {
    const { machineId, type, scheduledDate, notes } = req.body;
    const newTask = await Maintenance.create({
      maintenanceId: `MNT-${Date.now().toString().slice(-6)}`,
      machineId,
      type: type || 'Predictive',
      scheduledDate,
      notes,
    });
    return res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    let updateData = { status };
    if (status === 'Completed') updateData.completedDate = new Date();
    
    const task = await Maintenance.findByIdAndUpdate(id, updateData, { new: true });
    return res.json({ success: true, data: task });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMaintenanceTasks, createMaintenanceTask, updateTaskStatus };
