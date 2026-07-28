const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Machine = require('../models/Machine');
const Alert = require('../models/Alert');
const { processTelemetryForAnomalies, consecutiveCounters } = require('../services/anomalyEngine');

async function testManualEditWorkflows() {
  console.log('===========================================================');
  console.log('VibeGuard AI — Manual Telemetry Edit & Alert Verification');
  console.log('===========================================================\n');

  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/vibeguard';
    await mongoose.connect(mongoUri);
    console.log('connected to MongoDB successfully.\n');

    const testMachineId = 'MCH-MANUAL-TEST';

    // Clear old test alert records
    await Alert.deleteMany({ machineId: testMachineId });
    Object.keys(consecutiveCounters).forEach(k => delete consecutiveCounters[k]);

    let testMachine = await Machine.findOne({ machineId: testMachineId });
    if (!testMachine) {
      testMachine = await Machine.create({
        machineId: testMachineId,
        name: 'Manual Test CNC Lathe',
        location: 'Plant B',
        temperature: 42,
        vibration: 1.2,
        rpm: 1750,
        status: 'Healthy',
      });
    }

    // --- SCENARIO A: 72 -> 95 -> 74 ---
    console.log('--- SCENARIO A: 72°C -> 95°C (Spike) -> 74°C ---');
    const scAValues = [72, 95, 74];
    for (let val of scAValues) {
      testMachine.temperature = val;
      await Machine.findOneAndUpdate({ machineId: testMachineId }, { temperature: val });
      const alerts = await processTelemetryForAnomalies(
        { machineId: testMachineId, temperature: val, vibrationRMS: 1.2, rpm: 1750, current: 12, power: 5.5 },
        testMachine,
        null
      );
      const counter = consecutiveCounters[`${testMachineId}:temperature`] || 0;
      console.log(`Manual Edit Temp = ${val}°C | Counter = ${counter} | Generated Alerts = ${alerts.length}`);
    }
    const scAAlertCount = await Alert.countDocuments({ machineId: testMachineId });
    console.log(`DB Active Alerts for Machine: ${scAAlertCount}`);
    console.log(scAAlertCount === 0 ? '✅ PASSED Scenario A: Transient spike suppressed, 0 alerts in DB!' : '❌ FAILED Scenario A');

    console.log('\n-----------------------------------------------------------\n');

    // Reset counters & DB alerts
    await Alert.deleteMany({ machineId: testMachineId });
    Object.keys(consecutiveCounters).forEach(k => delete consecutiveCounters[k]);

    // --- SCENARIO B: 82 -> 84 -> 86 ---
    console.log('--- SCENARIO B: 82°C -> 84°C -> 86°C (3 Consecutive Breaches) ---');
    const scBValues = [82, 84, 86];
    for (let val of scBValues) {
      testMachine.temperature = val;
      await Machine.findOneAndUpdate({ machineId: testMachineId }, { temperature: val });
      const alerts = await processTelemetryForAnomalies(
        { machineId: testMachineId, temperature: val, vibrationRMS: 1.2, rpm: 1750, current: 12, power: 5.5 },
        testMachine,
        null
      );
      const counter = consecutiveCounters[`${testMachineId}:temperature`] || 0;
      console.log(`Manual Edit Temp = ${val}°C | Counter = ${counter} | Generated Alerts = ${alerts.length}`);
    }
    const scBAlerts = await Alert.find({ machineId: testMachineId });
    console.log(`DB Active Alerts for Machine: ${scBAlerts.length}`);
    if (scBAlerts.length === 1) {
      console.log(`✅ PASSED Scenario B: Alert created in DB on 3rd reading!`);
      console.log(`   Alert Title: "${scBAlerts[0].title}" | Description: "${scBAlerts[0].description}"`);
    } else {
      console.log('❌ FAILED Scenario B');
    }

    console.log('\n-----------------------------------------------------------\n');

    // Reset counters & DB alerts
    await Alert.deleteMany({ machineId: testMachineId });
    Object.keys(consecutiveCounters).forEach(k => delete consecutiveCounters[k]);

    // --- SCENARIO C: 82 -> 84 -> 72 -> 86 ---
    console.log('--- SCENARIO C: 82°C -> 84°C -> 72°C (Reset) -> 86°C ---');
    const scCValues = [82, 84, 72, 86];
    for (let val of scCValues) {
      testMachine.temperature = val;
      await Machine.findOneAndUpdate({ machineId: testMachineId }, { temperature: val });
      const alerts = await processTelemetryForAnomalies(
        { machineId: testMachineId, temperature: val, vibrationRMS: 1.2, rpm: 1750, current: 12, power: 5.5 },
        testMachine,
        null
      );
      const counter = consecutiveCounters[`${testMachineId}:temperature`] || 0;
      console.log(`Manual Edit Temp = ${val}°C | Counter = ${counter} | Generated Alerts = ${alerts.length}`);
    }
    const scCAlertCount = await Alert.countDocuments({ machineId: testMachineId });
    console.log(`DB Active Alerts for Machine: ${scCAlertCount}`);
    console.log(scCAlertCount === 0 ? '✅ PASSED Scenario C: Reset counter on 72°C; 0 alerts in DB!' : '❌ FAILED Scenario C');

    console.log('\n===========================================================');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Test Error:', err);
    process.exit(1);
  }
}

testManualEditWorkflows();
