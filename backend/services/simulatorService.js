const {
  randomWalk,
  calculateHealthScore,
  movingAverage,
  medianFilter,
  isSpikeDetected,
  exponentialMovingAverage,
  validateRange,
} = require('../utils/randomWalk');
const { processTelemetryForAnomalies } = require('./anomalyEngine');

const mongoose = require('mongoose');
const Machine = require('../models/Machine');
const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');
const Reading = require('../models/Reading');

// Transient caches strictly for stateless DSP filter stability across ticks, mapped by machineId
const movingAvgWindows = {};
const emaBuffers = {};

function processAndValidateMachine(machine) {
  if (!movingAvgWindows[machine.machineId]) {
    movingAvgWindows[machine.machineId] = { temperature: [], vibration: [] };
    emaBuffers[machine.machineId] = { temperature: machine.temperature, vibration: machine.vibration };
  }
  const buffers = movingAvgWindows[machine.machineId];
  const emas = emaBuffers[machine.machineId];

  // Plausibility Check Limits
  const rules = {
    temp: { min: -20, max: 150 },
    voltage: { min: 300, max: 500 },
    current: { min: 0, max: 100 },
    pressure: { min: 0, max: 20 },
    humidity: { min: 0, max: 100 },
    rpm: { min: 0, max: 5000 },
    vib: { min: 0, max: 100 },
  };

  let remarks = 'Normal Operation';
  let alert_flag = 'NORMAL';

  // 1. Plausibility Check Reject bounds
  if (!validateRange(machine.temperature, rules.temp.min, rules.temp.max).valid) alert_flag = 'FAULTY';
  if (!validateRange(machine.voltage, rules.voltage.min, rules.voltage.max).valid) alert_flag = 'FAULTY';
  if (!validateRange(machine.current, rules.current.min, rules.current.max).valid) alert_flag = 'FAULTY';
  if (!validateRange(machine.pressure, rules.pressure.min, rules.pressure.max).valid) alert_flag = 'FAULTY';
  if (!validateRange(machine.humidity, rules.humidity.min, rules.humidity.max).valid) alert_flag = 'FAULTY';
  if (!validateRange(machine.rpm, rules.rpm.min, rules.rpm.max).valid) alert_flag = 'FAULTY';
  if (!validateRange(machine.vibration, rules.vib.min, rules.vib.max).valid) alert_flag = 'FAULTY';

  if (machine.temperature === null || machine.vibration === null || isNaN(machine.temperature) || isNaN(machine.vibration)) {
      alert_flag = 'MISSING';
      remarks = 'Sensor Data Missing';
  }

  // 2. Main Signal Pipeline (only apply to non-faulty, real numbers)
  if (alert_flag !== 'FAULTY' && alert_flag !== 'MISSING') {
      
      // -- Spike Detection --
      if (isSpikeDetected(machine.temperature, buffers.temperature, 5.0) || 
          isSpikeDetected(machine.vibration, buffers.vibration, 3.0)) {
          remarks = 'Spike Detected & Handled';
          // Use median filter to reject spike
          machine.temperature = medianFilter(buffers.temperature) || machine.temperature;
          machine.vibration = medianFilter(buffers.vibration) || machine.vibration;
      }

      // -- Moving Average Filter Window Size 5 --
      const tempMA = movingAverage(buffers.temperature, machine.temperature, 5);
      machine.temperature = tempMA.smoothed || machine.temperature;
      buffers.temperature = tempMA.window;
      
      const vibMA = movingAverage(buffers.vibration, machine.vibration, 5);
      machine.vibration = vibMA.smoothed || machine.vibration;
      buffers.vibration = vibMA.window;
      
      // -- Noise Reduction EMA Filter (Alpha 0.3) --
      machine.temperature = exponentialMovingAverage(emas.temperature, machine.temperature, 0.3);
      emas.temperature = machine.temperature;
      
      machine.vibration = exponentialMovingAverage(emas.vibration, machine.vibration, 0.3);
      emas.vibration = machine.vibration;

      // -- Threshold Validations --
      if (machine.temperature > 78 || machine.vibration > 6.5) {
        alert_flag = 'CRITICAL';
        remarks = 'Critical Threshold Breached';
      } else if (machine.temperature > 70 || machine.vibration > 4.5) {
        alert_flag = 'WARNING';
        remarks = 'Warning Threshold Breached';
      } else if (machine.simulationMode === 'STUCK_SENSOR') {
        alert_flag = 'STUCK';
        remarks = 'Sensor values unchanging';
      }
  }

  // -- Health Score Calculation --
  machine.healthScore = calculateHealthScore(machine.temperature, machine.vibration, machine.rpm);
  
  if (alert_flag === 'FAULTY' || alert_flag === 'STUCK') {
      machine.status = 'Critical';
      machine.healthScore = Math.min(machine.healthScore, 30);
  } else if (machine.healthScore >= 85) machine.status = 'Healthy';
  else if (machine.healthScore >= 60) machine.status = 'Warning';
  else machine.status = 'Critical';

  return { alert_flag, remarks, machineUpdates: machine };
}

function processAndValidateSensorReading(reading) {
   const rules = { temp: { min: -20, max: 150 }, vib: { min: 0, max: 100 } };
   if (reading.temperature !== null) {
     if (reading.temperature < rules.temp.min || reading.temperature > rules.temp.max) reading.alert_flag = 'FAULTY';
   }
   if (reading.vibration !== null) {
     if (reading.vibration < rules.vib.min || reading.vibration > rules.vib.max) reading.alert_flag = 'FAULTY';
   }
   return reading;
}

async function initializeReadingCounter() {
    try {
        console.log(`[Simulator] Process PID: ${process.pid}`);
        console.log('[Simulator] Initializing Reading Counter...');
        
        // Find exclusively structured sequential documents matching 'RDG-YYYY' structurally.
        const latestReadings = await Reading.find(
           { reading_id: { $regex: /^RDG-\d+$/ } }, 
           { reading_id: 1 }
        );

        if (!latestReadings || latestReadings.length === 0) {
            console.log('[Simulator] No previous readings found.');
            console.log('[Simulator] Starting Counter at: RDG-1000');
            return 1000;
        }

        let maxNum = 999;
        for (const doc of latestReadings) {
             const match = doc.reading_id.match(/^RDG-(\d+)$/);
             if (match && match[1]) {
                 const num = parseInt(match[1], 10);
                 // Strict sequential restriction guarding against manual Date(6) API injections
                 if (num > maxNum && num < 100000) maxNum = num;
             }
        }

        const nextCounter = maxNum + 1;
        console.log(`[Simulator] Last Reading Found Extracted Numerical Base: ${maxNum}`);
        console.log(`[Simulator] Starting Counter at: RDG-${nextCounter}`);
        
        return nextCounter;
        
    } catch (err) {
        console.error('[Simulator] Failed to initialize counter:', err.message);
        return 1000;
    }
}

async function startTelemetrySimulator(io) {
  if (global.simulatorRunning) {
      console.log(`[Simulator] Warning: Duplicate singleton invocation aborted (PID: ${process.pid}).`);
      return;
  }
  global.simulatorRunning = true;

  console.log('[Simulator] Starting SIH 2026 Compliant Real-Time IoT Engine (MongoDB Backend)...');
  
  let readingSequenceNumber = await initializeReadingCounter();

  setInterval(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.warn("MongoDB not connected. Waiting for reconnection...");
        return;
      }
      
      // Direct Database Source of Truth
      let fleet = await Machine.find({});
      if (fleet.length === 0) {
        // If DB is completely empty (no seed data), generate one machine to keep simulator running gracefully
        fleet = [await Machine.create({
            machineId: 'MCH-101', name: 'CNC Milling Center Alpha', location: 'Plant A',
            temperature: 42.5, vibrationX: 1.2, vibrationY: 1.1, vibrationZ: 1.4, rpm: 1750,
            status: 'Healthy'
        })];
      }

      const activeFleet = fleet; // Simulate all to keep system updated
      const now = new Date();
      const timeStr = now.toISOString();

      let sihProcessedPrimaryRecord = null;
      const telemetryBulkOps = [];

      for (let i = 0; i < activeFleet.length; i++) {
        let dbMachine = activeFleet[i].toObject(); // use plain object for mutating state
        if (dbMachine.status !== 'Offline') {
            
          dbMachine.temperature = randomWalk(dbMachine.temperature || 42, 35.0, 85.0, 0.4);
          dbMachine.vibrationX = randomWalk(dbMachine.vibrationX || 1.2, 0.5, 4.2, 0.2);
          dbMachine.vibrationY = randomWalk(dbMachine.vibrationY || 1.1, 0.5, 4.2, 0.2);
          dbMachine.vibrationZ = randomWalk(dbMachine.vibrationZ || 1.4, 0.5, 4.2, 0.2);

          if (dbMachine.temperature !== null && dbMachine.vibrationX !== null) {
            dbMachine.vibration = Number(
              Math.sqrt(
                (dbMachine.vibrationX || 0) ** 2 + (dbMachine.vibrationY || 0) ** 2 + (dbMachine.vibrationZ || 0) ** 2
              ).toFixed(2)
            );
            dbMachine.rpm = Math.round(randomWalk(dbMachine.rpm || 1750, 1400, 1850, 5.0));
            dbMachine.voltage = Number(randomWalk(dbMachine.voltage || 415, 405, 425, 0.5).toFixed(1));
            dbMachine.current = Number(randomWalk(dbMachine.current || 12, 5.0, 18.5, 0.3).toFixed(1));
            dbMachine.pressure = Number(randomWalk(dbMachine.pressure || 4.5, 3.0, 7.2, 0.1).toFixed(1));
            dbMachine.humidity = Number(randomWalk(dbMachine.humidity || 45, 30, 70, 0.4).toFixed(1));
            dbMachine.power = Number(randomWalk(dbMachine.power || 5.5, 3.0, 9.5, 0.15).toFixed(1));
          }

          // Full DSP Pipeline
          const { alert_flag, remarks, machineUpdates } = processAndValidateMachine(dbMachine);
          dbMachine = machineUpdates;

          // Anomaly checks
          if (dbMachine.temperature !== null && dbMachine.vibration !== null) {
            await processTelemetryForAnomalies(
              {
                machineId: dbMachine.machineId,
                temperature: dbMachine.temperature,
                vibrationRMS: dbMachine.vibration,
                rpm: dbMachine.rpm,
                current: dbMachine.current,
                voltage: dbMachine.voltage,
              },
              dbMachine,
              io
            );
          }

          if (i === 0) {
            sihProcessedPrimaryRecord = {
               reading_id: `RDG-${readingSequenceNumber++}`,
               machine_id: dbMachine.machineId,
               vibration: dbMachine.vibration,
               temperature: dbMachine.temperature,
               alert_flag: alert_flag,
               recorded_at: timeStr,
               remarks: remarks
            };
          }

          // Database Persistence (Batch Preparation)
          telemetryBulkOps.push({
             timestamp: now,
             machineId: dbMachine.machineId,
             temperature: dbMachine.temperature || 0,
             vibrationX: dbMachine.vibrationX || 0,
             vibrationY: dbMachine.vibrationY || 0,
             vibrationZ: dbMachine.vibrationZ || 0,
             vibrationRMS: dbMachine.vibration || 0,
             pressure: dbMachine.pressure || 0,
             rpm: dbMachine.rpm || 0,
             voltage: dbMachine.voltage || 0,
             current: dbMachine.current || 0,
             humidity: dbMachine.humidity || 0,
             power: dbMachine.power || 0
          });

          try {
             // Save Machine States
             await Machine.findOneAndUpdate(
               { machineId: dbMachine.machineId },
               { $set: dbMachine },
               { upsert: true }
             );

             // Alerts
             if (dbMachine.status === 'Critical' || dbMachine.status === 'Warning') {
                 const existingAlert = await Alert.findOne({ machineId: dbMachine.machineId, status: 'Active' });
                 if (!existingAlert) {
                     await Alert.create({
                        alertId: `ALT-${Date.now().toString().slice(-6)}-${dbMachine.machineId.substring(4)}`,
                        machineId: dbMachine.machineId,
                        machineName: dbMachine.name || `Machine ${dbMachine.machineId}`,
                        severity: dbMachine.status === 'Critical' ? 'Critical' : 'Warning',
                        title: `${dbMachine.status} Anomaly Detected`,
                        description: `Simulator generated ${dbMachine.status} anomaly event for ${dbMachine.name || dbMachine.machineId}`,
                        status: 'Active'
                     });
                 }
             }
          } catch(err) {
              console.error("[MongoDB Machine Sync Error]", err.message);
          }
        }
      }

      if (telemetryBulkOps.length > 0) {
          try {
             await Telemetry.insertMany(telemetryBulkOps);
          } catch(err) {
             console.error("[MongoDB Telemetry Sync Error]", err.message);
          }
      }

      let finalPersistedRecord = null;
      if (sihProcessedPrimaryRecord) {
         try {
             console.log(`[Simulator] Inserting Primary Reading: ${sihProcessedPrimaryRecord.reading_id} for Machine: ${sihProcessedPrimaryRecord.machine_id} at ${sihProcessedPrimaryRecord.recorded_at}`);
             finalPersistedRecord = await Reading.create(sihProcessedPrimaryRecord);
         } catch(dbErr) {
             console.error("[Simulator DB Sync Error] Creating Reading failed", dbErr.message);
             // Prevent full failure cascade but do not override the struct.
             finalPersistedRecord = sihProcessedPrimaryRecord;
         }
      }

      // Aggregate DB stats for broadcasting
      const updatedFleet = await Machine.find({});
      const activeSubset = updatedFleet.filter(m => m.status !== 'Offline');
      
      const validTemps = activeSubset.map((m) => m.temperature).filter((t) => t != null && !isNaN(t));
      const avgTemp = validTemps.length > 0 ? Number((validTemps.reduce((acc, v) => acc + v, 0) / validTemps.length).toFixed(1)) : 45.0;

      const validVibs = activeSubset.map((m) => m.vibration).filter((v) => v != null && !isNaN(v));
      const avgVib = validVibs.length > 0 ? Number((validVibs.reduce((acc, v) => acc + v, 0) / validVibs.length).toFixed(2)) : 1.5;

      const primary = activeSubset.length > 0 ? activeSubset[0] : null;
      
      // Calculate latest sample for history chart updates
      const latestSample = {
        time: now.toLocaleTimeString('en-US', { hour12: false }),
        avgTemp,
        maxTemp: validTemps.length > 0 ? Number(Math.max(...validTemps).toFixed(1)) : 45.0,
        vibrationX: primary ? (primary.vibrationX || 1.2) : 1.2,
        vibrationY: primary ? (primary.vibrationY || 1.1) : 1.1,
        vibrationZ: primary ? (primary.vibrationZ || 1.4) : 1.4,
        peakRMS: primary ? (primary.vibration || 1.5) : 1.5,
        sihRecord: finalPersistedRecord,
      };

      // Since we dropped memory telemetryHistory, fetch last 50 directly from DB 
      const recentDocs = await Telemetry.aggregate([
        { $sort: { timestamp: -1 } },
        { $limit: 300 }
      ]);
      const historyMap = {};
      for (const doc of recentDocs) {
          const tKey = new Date(doc.timestamp).toLocaleTimeString('en-US', { hour12: false });
          if (!historyMap[tKey]) {
              historyMap[tKey] = { time: tKey, temps: [], vibs: [], primary: null };
          }
          historyMap[tKey].temps.push(doc.temperature);
          historyMap[tKey].vibs.push(doc.vibrationRMS || 0);
          if (doc.machineId === 'MCH-101') {
              historyMap[tKey].primary = doc;
          }
      }
      const telemetryHistory = Object.values(historyMap).reverse().slice(-50).map(slot => {
          const vTemps = slot.temps.filter(t => t != null && !isNaN(t));
          return {
              time: slot.time,
               avgTemp: vTemps.length ? Number((vTemps.reduce((a,b)=>a+b,0)/vTemps.length).toFixed(1)) : 45.0,
              maxTemp: vTemps.length ? Number(Math.max(...vTemps).toFixed(1)) : 45.0,
              vibrationX: slot.primary ? slot.primary.vibrationX : 1.2,
              vibrationY: slot.primary ? slot.primary.vibrationY : 1.1,
              vibrationZ: slot.primary ? slot.primary.vibrationZ : 1.4,
              peakRMS: slot.primary ? slot.primary.vibrationRMS : 1.5,
          };
      });

      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      const readingsToday = await Telemetry.countDocuments({ timestamp: { $gte: todayStart } });
      const activeAlerts = await Alert.countDocuments({ status: 'Active' });
      
      const stats = {
        totalMachines: updatedFleet.length,
        healthyMachines: updatedFleet.filter((m) => m.status === 'Healthy').length,
        warningMachines: updatedFleet.filter((m) => m.status === 'Warning').length,
        criticalMachines: updatedFleet.filter((m) => m.status === 'Critical').length,
        avgTemperature: avgTemp,
        avgVibration: avgVib,
        readingsToday: readingsToday,
        alertCount: activeAlerts,
        runningMachines: activeSubset.length,
        overallOEE: 87.5,
      };

      if (io) {
        // Broadcast to ALL (Dashboard fleet view)
        io.to('ALL').emit('telemetry:update', { sample: latestSample, history: telemetryHistory, sihRecord: finalPersistedRecord });
        io.to('ALL').emit('machine:update', updatedFleet);
        io.to('ALL').emit('dashboard:update', stats);
        
        if (finalPersistedRecord) {
            io.to('ALL').emit('reading:new', finalPersistedRecord);
            io.to(finalPersistedRecord.machine_id).emit('reading:new', finalPersistedRecord);
        }

        // Broadcast to individual machine rooms for isolation
        for (const m of activeSubset) {
            io.to(m.machineId).emit('machine:update', [m]);
            // Send isolated telemetry sample (basic approximation for realtime chart update)
            io.to(m.machineId).emit('telemetry:update', {
                sample: {
                    time: now.toLocaleTimeString('en-US', { hour12: false }),
                    avgTemp: m.temperature || 45.0,
                    maxTemp: m.temperature || 45.0,
                    vibrationX: m.vibrationX || 1.2,
                    vibrationY: m.vibrationY || 1.1,
                    vibrationZ: m.vibrationZ || 1.4,
                    peakRMS: m.vibration || 1.5,
                }
            });
            // And push isolated dashboard stats update for this specific machine
             io.to(m.machineId).emit('dashboard:update', {
                 ...stats,
                 totalMachines: 1,
                 healthyMachines: m.status === 'Healthy' ? 1 : 0,
                 warningMachines: m.status === 'Warning' ? 1 : 0,
                 criticalMachines: m.status === 'Critical' ? 1 : 0,
                 avgTemperature: m.temperature,
                 avgVibration: m.vibration,
                 runningMachines: m.status !== 'Offline' ? 1 : 0
             });
        }
      }
    } catch (err) {
      console.error('[Simulator Error]', err);
    }
  }, 2000); // 2 second interval to limit excessive db bulk updates on tiny tier, but keeping SIH real-time feel
}

async function setSimulationMode(machineId, mode) {
  // Update DB directly
  const m = await Machine.findOneAndUpdate({ machineId }, { simulationMode: mode }, { new: true });
  return !!m;
}

module.exports = {
  startTelemetrySimulator,
  setSimulationMode,
  processAndValidateSensorReading,
};
