const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
  {
    alertId: { type: String, required: true },
    machineId: { type: String, required: true },
    machineName: { type: String, required: true },
    severity: { type: String, enum: ['Critical', 'Warning', 'Info'], required: true },
    category: { type: String, default: 'Vibration' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: { type: String, default: null },
    resolved: { type: Boolean, default: false },
    status: { type: String, enum: ['Active', 'Acknowledged', 'Resolved'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', AlertSchema);
