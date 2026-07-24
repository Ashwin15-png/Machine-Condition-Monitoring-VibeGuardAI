const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema(
  {
    reading_id: { type: String, required: true, unique: true },
    machine_id: { type: String, required: true },
    vibration: { type: Number, default: null },
    temperature: { type: Number, default: null },
    rpm: { type: Number, default: null },
    voltage: { type: Number, default: null },
    current: { type: Number, default: null },
    healthScore: { type: Number, default: null },
    alert_flag: {
      type: String,
      enum: ['NORMAL', 'WARNING', 'CRITICAL', 'FAULTY', 'MISSING', 'STUCK'],
      default: 'NORMAL',
    },
    recorded_at: { type: Date, default: Date.now },
    remarks: { type: String, default: '' },
  },
  { timestamps: true }
);

ReadingSchema.index({ recorded_at: -1 });
ReadingSchema.index({ machine_id: 1 });
ReadingSchema.index({ alert_flag: 1 });

module.exports = mongoose.model('Reading', ReadingSchema);
