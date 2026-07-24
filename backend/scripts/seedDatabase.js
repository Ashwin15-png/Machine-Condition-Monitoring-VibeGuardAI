require('dotenv').config();
const mongoose = require('mongoose');
const Machine = require('../models/Machine');
const Reading = require('../models/Reading');
const Alert = require('../models/Alert');
const Telemetry = require('../models/Telemetry');
const User = require('../models/User');

const sampleReadings = require('../data/sampleReadings');

const seedDB = async () => {
  try {
    console.log('[SEED] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://mayonash04_db_user:IbiK15wKI8CigDM6@cluster0.yjj9fgg.mongodb.net/?appName=Cluster0');
    console.log('[SEED] Connected to Atlas.');

    console.log('[SEED] Wiping old collections...');
    await Machine.deleteMany({});
    await Reading.deleteMany({});
    await Alert.deleteMany({});
    await Telemetry.deleteMany({});
    // Keep users or wipe them? Best to create default admin.
    await User.deleteMany({});

    console.log('[SEED] Creating Machines...');
    const machines = [
      { machineId: 'MCH-101', name: 'CNC Milling Center Alpha', location: 'Plant A - Cell 01', status: 'Healthy', temperature: 42.5, vibrationX: 1.2, vibrationY: 1.1, vibrationZ: 1.4, rpm: 1750, voltage: 415, current: 12.4, healthScore: 98 },
      { machineId: 'MCH-102', name: 'High-Pressure Hydraulic Press', location: 'Plant A - Cell 03', status: 'Warning', temperature: 68.2, vibrationX: 3.8, vibrationY: 4.1, vibrationZ: 4.9, rpm: 1450, voltage: 412, current: 16.2, healthScore: 74 },
      { machineId: 'MCH-103', name: 'Primary Cooling Tower Turbine', location: 'Plant B - Utility Bay', status: 'Critical', temperature: 84.4, vibrationX: 6.2, vibrationY: 6.8, vibrationZ: 7.5, rpm: 1800, voltage: 418, current: 17.5, healthScore: 48 },
      { machineId: 'MCH-104', name: 'Rotary Screw Compressor B', location: 'Plant A - Compressor', status: 'Healthy', temperature: 45.1, vibrationX: 1.4, vibrationY: 1.6, vibrationZ: 1.9, rpm: 1680, voltage: 414, current: 11.2, healthScore: 95 }
    ];
    await Machine.insertMany(machines);

    console.log('[SEED] Creating default users...');
    await User.create({ name: 'Admin', email: 'admin@apex-industrial.com', password: 'password123', role: 'Admin' });
    await User.create({ name: 'Engineer', email: 'engineer@apex-industrial.com', password: 'password123', role: 'Engineer' });
    await User.create({ name: 'Operator', email: 'operator@apex-industrial.com', password: 'password123', role: 'Operator' });

    console.log('[SEED] Inserting 45 Sample Readings dataset...');
    await Reading.insertMany(sampleReadings);

    console.log('[SEED] Generating alerts from dataset anomalies...');
    const abnormalReadings = sampleReadings.filter(r => ['WARNING', 'CRITICAL', 'FAULTY', 'MISSING', 'STUCK'].includes(r.alert_flag));
    for (const r of abnormalReadings) {
      await Alert.create({
        alertId: `ALT-SEED-${Date.now().toString().slice(-6)}-${Math.floor(Math.random()*1000)}`,
        machineId: r.machine_id,
        machineName: 'Seed Dataset Machine',
        severity: r.alert_flag === 'WARNING' ? 'Warning' : 'Critical',
        title: `${r.alert_flag} Anomaly Detected`,
        description: r.remarks,
        status: 'Active'
      });
    }

    console.log('[SEED] Generating telemetry baseline...');
    const telDocs = sampleReadings.map(r => ({
      timestamp: r.recorded_at,
      machineId: r.machine_id,
      temperature: r.temperature || 0,
      vibrationRMS: r.vibration || 0,
      rpm: r.rpm || 0,
      voltage: r.voltage || 0,
      current: r.current || 0
    }));
    await Telemetry.insertMany(telDocs);

    console.log('[SEED] Database Seed Complete!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
