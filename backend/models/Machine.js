const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema(
  {
    machineId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    plant: { type: String, default: 'Plant Alpha' },
    location: { type: String, required: true },
    department: { type: String, default: 'Machining & Assembly' },
    status: { type: String, enum: ['Healthy', 'Warning', 'Critical', 'Offline'], default: 'Healthy' },
    runningHours: { type: Number, default: 1420 },
    healthScore: { type: Number, default: 98 },
    temperature: { type: Number, default: 42.5 },
    vibration: { type: Number, default: 1.45 },
    vibrationX: { type: Number, default: 1.2 },
    vibrationY: { type: Number, default: 1.1 },
    vibrationZ: { type: Number, default: 1.4 },
    pressure: { type: Number, default: 4.5 },
    voltage: { type: Number, default: 415 },
    current: { type: Number, default: 12.4 },
    rpm: { type: Number, default: 1800 },
    power: { type: Number, default: 5.5 },
    humidity: { type: Number, default: 45 },
    oee: { type: Number, default: 87.5 },
    sensorId: { type: String, default: 'SN-SENS-8801' },
    operator: { type: String, default: 'Marcus Vance' },
    lastMaintenance: { type: String, default: '2026-06-15' },
    nextMaintenance: { type: String, default: '2026-09-15' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Machine', MachineSchema);
