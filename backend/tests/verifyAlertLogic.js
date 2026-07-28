const { processTelemetryForAnomalies, updateConsecutiveCounter, consecutiveCounters } = require('../services/anomalyEngine');

async function runVerification() {
  console.log('====================================================');
  console.log('VibeGuard AI — Alert Consecutive Readings Test Suite');
  console.log('====================================================\n');

  const testMachine = { machineId: 'TEST-MCH-01', name: 'Test CNC Machine' };

  // SCENARIO 1: Single Spike Test (72 -> 73 -> 95 -> 74)
  console.log('--- SCENARIO 1: Single Transient Spike ---');
  const scenario1Readings = [72, 73, 95, 74];
  let s1Alerts = [];

  for (let i = 0; i < scenario1Readings.length; i++) {
    const temp = scenario1Readings[i];
    const alerts = await processTelemetryForAnomalies(
      { machineId: testMachine.machineId, temperature: temp, vibrationRMS: 1.2, current: 10 },
      testMachine,
      null
    );
    const key = `${testMachine.machineId}:temperature`;
    console.log(`Reading #${i + 1}: Temp = ${temp}°C | Abnormal Counter = ${consecutiveCounters[key] || 0} | Alerts Triggered = ${alerts.length}`);
    s1Alerts.push(...alerts);
  }

  console.log(`\nScenario 1 Result: Total Alerts Generated = ${s1Alerts.length}`);
  console.log(s1Alerts.length === 0 ? '✅ PASSED: Single spike was successfully IGNORED!' : '❌ FAILED: False alarm generated on single spike');

  console.log('\n----------------------------------------------------\n');

  // Clear counters between scenarios
  Object.keys(consecutiveCounters).forEach(k => delete consecutiveCounters[k]);

  // SCENARIO 2: Sustained Abnormal Condition (82 -> 84 -> 86)
  console.log('--- SCENARIO 2: Sustained Abnormal Condition (3 Consecutive Readings) ---');
  const scenario2Readings = [82, 84, 86];
  let s2Alerts = [];

  for (let i = 0; i < scenario2Readings.length; i++) {
    const temp = scenario2Readings[i];
    const alerts = await processTelemetryForAnomalies(
      { machineId: testMachine.machineId, temperature: temp, vibrationRMS: 1.2, current: 10 },
      testMachine,
      null
    );
    const key = `${testMachine.machineId}:temperature`;
    console.log(`Reading #${i + 1}: Temp = ${temp}°C | Abnormal Counter = ${consecutiveCounters[key] || 0} | Alerts Triggered = ${alerts.length}`);
    s2Alerts.push(...alerts);
  }

  console.log(`\nScenario 2 Result: Total Alerts Generated = ${s2Alerts.length}`);
  if (s2Alerts.length === 1 && s2Alerts[0].title === 'Thermal Envelope Breach') {
    console.log(`✅ PASSED: Alert "${s2Alerts[0].title}" triggered on 3rd consecutive reading!`);
    console.log(`   Alert Details: ${s2Alerts[0].description}`);
  } else {
    console.log('❌ FAILED: Alert was not generated on 3rd consecutive reading');
  }

  console.log('\n----------------------------------------------------\n');

  // Clear counters between scenarios
  Object.keys(consecutiveCounters).forEach(k => delete consecutiveCounters[k]);

  // SCENARIO 3: Interrupted Abnormal Condition (82 -> 84 -> 72 -> 86)
  console.log('--- SCENARIO 3: Interrupted Abnormal Sequence (Reset Counter) ---');
  const scenario3Readings = [82, 84, 72, 86];
  let s3Alerts = [];

  for (let i = 0; i < scenario3Readings.length; i++) {
    const temp = scenario3Readings[i];
    const alerts = await processTelemetryForAnomalies(
      { machineId: testMachine.machineId, temperature: temp, vibrationRMS: 1.2, current: 10 },
      testMachine,
      null
    );
    const key = `${testMachine.machineId}:temperature`;
    console.log(`Reading #${i + 1}: Temp = ${temp}°C | Abnormal Counter = ${consecutiveCounters[key] || 0} | Alerts Triggered = ${alerts.length}`);
    s3Alerts.push(...alerts);
  }

  console.log(`\nScenario 3 Result: Total Alerts Generated = ${s3Alerts.length}`);
  console.log(s3Alerts.length === 0 ? '✅ PASSED: Counter reset on normal reading (72°C); no alert generated!' : '❌ FAILED: Alert generated prematurely');

  console.log('\n====================================================');
}

runVerification();
