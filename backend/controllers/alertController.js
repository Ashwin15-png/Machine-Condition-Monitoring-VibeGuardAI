const Alert = require('../models/Alert');

const getAlerts = async (req, res) => {
  try {
    const { machineId } = req.query;
    const query = (machineId && machineId !== 'ALL') ? { machineId } : {};
    const alerts = await Alert.find(query).sort({ timestamp: -1 });
    // Map to frontend expected shape to avoid breaking UI components
    const mappedAlerts = alerts.map(a => ({
       id: a.alertId,
       machineId: a.machineId,
       machineName: `Machine ${a.machineId}`, 
       severity: a.type === 'CRITICAL' ? 'Critical' : 'Warning',
       category: a.metric || 'Telemetry',
       message: a.message,
       timestamp: a.createdAt,
       status: a.status,
       acknowledgedBy: a.acknowledgedBy
    }));
    return res.json({ success: true, data: mappedAlerts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findOneAndUpdate(
       { alertId: id },
       { 
         $set: { 
            status: 'Acknowledged',
            acknowledgedBy: req.body.user || 'Level 3 Operator'
         } 
       },
       { new: true }
    );
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    return res.json({ success: true, data: alert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findOneAndUpdate(
       { alertId: id },
       { $set: { status: 'Resolved' } },
       { new: true }
    );
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    return res.json({ success: true, data: alert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAlerts,
  acknowledgeAlert,
  resolveAlert,
};
