const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    user: { type: String, required: true },
    details: { type: String },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
