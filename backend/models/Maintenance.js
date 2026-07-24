const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema(
  {
    maintenanceId: { type: String, required: true, unique: true },
    machineId: { type: String, required: true },
    type: { type: String, enum: ['Preventive', 'Corrective', 'Predictive'], default: 'Predictive' },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    status: { type: String, enum: ['Scheduled', 'In Progress', 'Completed'], default: 'Scheduled' },
    technician: { type: String, default: 'Marcus Vance' },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
