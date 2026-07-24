const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    machineId: { type: String, required: true },
    temperature: { type: Number, required: true },
    vibrationX: { type: Number, default: 0 },
    vibrationY: { type: Number, default: 0 },
    vibrationZ: { type: Number, default: 0 },
    vibrationRMS: { type: Number, required: true },
    pressure: { type: Number, default: 4.5 },
    rpm: { type: Number, default: 1750 },
    voltage: { type: Number, default: 415 },
    current: { type: Number, default: 12.0 },
    humidity: { type: Number, default: 45.0 },
    power: { type: Number, default: 5.5 },
    oilTemperature: { type: Number, default: 48.0 },
    bearingTemperature: { type: Number, default: 52.0 },
    motorTemperature: { type: Number, default: 58.0 },
  },
  { timestamps: true }
);

TelemetrySchema.index({ timestamp: -1 });
TelemetrySchema.index({ machineId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', TelemetrySchema);
