const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema(
  {
    sensorId: { type: String, required: true, unique: true },
    machineId: { type: String, required: true },
    sensorType: { type: String, required: true }, // e.g. Vibration, Temperature, Pressure
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: 'mm/s' },
    minThreshold: { type: Number, default: 0 },
    maxThreshold: { type: Number, default: 6.5 },
    status: { type: String, enum: ['Healthy', 'Warning', 'Critical'], default: 'Healthy' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sensor', SensorSchema);
