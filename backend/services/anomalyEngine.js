let alertCounter = 9005;

// Configurable threshold for consecutive abnormal readings required before triggering an alert (default = 3)
const CONSECUTIVE_READINGS_THRESHOLD = parseInt(process.env.CONSECUTIVE_READINGS_THRESHOLD || '3', 10);

// In-memory counter store: machineId:ruleType => consecutive abnormal reading count
const consecutiveCounters = {};

/**
 * Checks and updates the consecutive abnormal reading counter for a machine and rule.
 * Returns true ONLY when consecutive count reaches CONSECUTIVE_READINGS_THRESHOLD.
 * Resets count to 0 if reading returns to normal.
 */
function updateConsecutiveCounter(machineId, ruleType, isAbnormal, requiredCount = CONSECUTIVE_READINGS_THRESHOLD) {
  const key = `${machineId}:${ruleType}`;
  if (isAbnormal) {
    consecutiveCounters[key] = (consecutiveCounters[key] || 0) + 1;
    if (consecutiveCounters[key] === requiredCount) {
      return true; // Trigger alert on target consecutive count
    }
  } else {
    consecutiveCounters[key] = 0; // Reset counter to 0 on normal reading
  }
  return false;
}

/**
 * Anomaly Detection Engine
 * Inspects incoming telemetry sample against physical thresholds & rule patterns.
 * Only triggers alerts when abnormal threshold conditions persist for CONSECUTIVE_READINGS_THRESHOLD updates.
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
    power,
  } = telemetryData;

  const machineName = machine.name || `Machine ${machineId}`;

  // Rule 1: High Temperature Breach (Sustained)
  const isHighTemp = temperature > 78.0;
  if (updateConsecutiveCounter(machineId, 'temperature', isHighTemp)) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: temperature > 85.0 ? 'Critical' : 'Warning',
      category: 'Thermal',
      title: 'Thermal Envelope Breach',
      description: `Sustained temperature reached ${temperature} °C for ${CONSECUTIVE_READINGS_THRESHOLD} consecutive readings (Limit 75.0 °C)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Rule 2: Excessive Vibration RMS (Sustained)
  const isHighVib = vibrationRMS > 4.5;
  if (updateConsecutiveCounter(machineId, 'vibration', isHighVib)) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: vibrationRMS > 6.5 ? 'Critical' : 'Warning',
      category: 'Vibration',
      title: 'Vibration RMS Threshold Exceeded',
      description: `Sustained tri-axial vibration RMS detected at ${vibrationRMS} mm/s for ${CONSECUTIVE_READINGS_THRESHOLD} consecutive readings (Limit 4.5 mm/s)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Rule 3: Current Spike (Sustained)
  const isHighCurrent = current > 16.5;
  if (updateConsecutiveCounter(machineId, 'current', isHighCurrent)) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: 'Warning',
      category: 'Electrical',
      title: 'Motor Stator Current Spike',
      description: `Sustained current draw spiked to ${current} A for ${CONSECUTIVE_READINGS_THRESHOLD} consecutive readings (Threshold 16.0 A)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Rule 4: RPM Speed Anomaly (Sustained)
  const isRpmAnomaly = rpm !== undefined && (rpm > 2200 || rpm < 1200);
  if (updateConsecutiveCounter(machineId, 'rpm', isRpmAnomaly)) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: 'Warning',
      category: 'Mechanical',
      title: 'Rotational Speed Anomaly',
      description: `Sustained speed anomaly detected at ${rpm} RPM for ${CONSECUTIVE_READINGS_THRESHOLD} consecutive readings (Nominal 1400–1850 RPM)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Rule 5: Critical Electrical Load (Sustained)
  const isCriticalLoad = power !== undefined && power > 8.5;
  if (updateConsecutiveCounter(machineId, 'load', isCriticalLoad)) {
    alertCounter++;
    const alertObj = {
      alertId: `ALT-${alertCounter}`,
      machineId,
      machineName,
      severity: 'Critical',
      category: 'Load',
      title: 'Critical Electrical Load Breach',
      description: `Sustained electrical load reached ${power} kW for ${CONSECUTIVE_READINGS_THRESHOLD} consecutive readings (Limit 8.5 kW)`,
      acknowledged: false,
      resolved: false,
      status: 'Active',
      timestamp: new Date().toISOString(),
    };
    generatedAlerts.push(alertObj);
  }

  // Save generated alerts to MongoDB & broadcast to frontend via Socket.IO
  if (generatedAlerts.length > 0) {
    try {
      const Alert = require('../models/Alert');
      for (const alertObj of generatedAlerts) {
        await Alert.create({
          alertId: alertObj.alertId,
          machineId: alertObj.machineId,
          machineName: alertObj.machineName,
          severity: alertObj.severity,
          category: alertObj.category || 'Thermal',
          title: alertObj.title,
          description: alertObj.description,
          status: 'Active',
          acknowledged: false,
          resolved: false,
        });
      }
    } catch (dbErr) {
      console.warn('[Anomaly Engine] Alert DB persistence notice:', dbErr.message);
    }

    if (io) {
      generatedAlerts.forEach((alert) => {
        io.emit('alert:new', alert);
      });
    }
  }

  return generatedAlerts;
}

module.exports = {
  processTelemetryForAnomalies,
  updateConsecutiveCounter,
  consecutiveCounters,
  CONSECUTIVE_READINGS_THRESHOLD,
};

