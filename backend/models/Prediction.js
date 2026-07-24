const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema(
  {
    machineId: { type: String, required: true },
    rulHours: { type: Number, required: true }, // Remaining Useful Life in hours
    degradationRate: { type: Number, default: 0.04 }, // % per day
    confidenceScore: { type: Number, default: 99.4 },
    recommendedAction: { type: String, default: 'Inspect spindle bearing assembly during next shift change' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prediction', PredictionSchema);
