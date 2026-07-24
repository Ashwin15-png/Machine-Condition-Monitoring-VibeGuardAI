let alertCounter = 9005;

/**
 * Anomaly Detection Engine
 * Inspects incoming telemetry sample against physical thresholds & rule patterns.
 */
async function processTelemetryForAnomalies(telemetryData, machine, io) {
  const generatedAlerts = [];

  const {
    machineId,
    temperature,
    vibrationRMS,
    rpm,
    current,
    voltage,
  } = telemetryData;

  const machineName = machine.name || `Machine ${machineId}`;

  // Rule 1: High Temperature Breach
  if (temperature > 78.0) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: temperature > 85.0 ? 'Critical' : 'Warning',
      category: 'Thermal',
      title: 'Thermal Envelope Breach',
      description: `Temperature reached ${temperature} °C (Limit 75.0 °C)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Rule 2: Excessive Vibration RMS
  if (vibrationRMS > 4.5) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: vibrationRMS > 6.5 ? 'Critical' : 'Warning',
      category: 'Vibration',
      title: 'Vibration RMS Threshold Exceeded',
      description: `Tri-axial vibration RMS spike detected at ${vibrationRMS} mm/s (Limit 4.5 mm/s)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Rule 3: Current Spike
  if (current > 16.5) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: 'Warning',
      category: 'Electrical',
      title: 'Motor Stator Current Spike',
      description: `Current draw spiked to ${current} A (Threshold 16.0 A)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Broadcast generated alerts to frontend via Socket.IO
  if (io && generatedAlerts.length > 0) {
    generatedAlerts.forEach((alert) => {
      io.emit('alert:new', alert);
    });
  }

  return generatedAlerts;
}

module.exports = {
  processTelemetryForAnomalies,
};
