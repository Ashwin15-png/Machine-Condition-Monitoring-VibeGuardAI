const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const machines = ['MCH-101', 'MCH-102', 'MCH-103', 'MCH-104'];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const generateRecord = (index, config) => {
  return {
    reading_id: `RDG-${1000 + index}`,
    machine_id: config.machine_id || machines[Math.floor(Math.random() * machines.length)],
    temperature: config.temperature,
    vibration: config.vibration,
    rpm: config.rpm || Math.floor(1000 + Math.random() * 800),
    voltage: config.voltage || (400 + Math.random() * 30),
    current: config.current || (10 + Math.random() * 10),
    healthScore: config.healthScore !== undefined ? config.healthScore : 90,
    alert_flag: config.alert_flag || 'NORMAL',
    recorded_at: randomDate(new Date(2026, 6, 20), new Date(2026, 6, 24)),
    remarks: config.remarks || 'Generated sample'
  };
};

// 45 Dataset items
const data = [];
let i = 0;

// NORMAL
for(let k=0; k<15; k++) {
  data.push(generateRecord(i++, { temperature: 40 + Math.random()*20, vibration: 1 + Math.random()*2, healthScore: 95, alert_flag: 'NORMAL', remarks: 'Normal operations' }));
}
// WARNING
for(let k=0; k<5; k++) {
  data.push(generateRecord(i++, { temperature: 72 + Math.random()*4, vibration: 4.8 + Math.random()*1, healthScore: 65, alert_flag: 'WARNING', remarks: 'Warning threshold breached' }));
}
// CRITICAL
for(let k=0; k<5; k++) {
  data.push(generateRecord(i++, { temperature: 80 + Math.random()*15, vibration: 6.8 + Math.random()*3, healthScore: 30, alert_flag: 'CRITICAL', remarks: 'Critical limits breached' }));
}
// FAULTY (Impossible values)
data.push(generateRecord(i++, { temperature: 160, vibration: 2, healthScore: 10, alert_flag: 'FAULTY', remarks: 'Temperature above 150' }));
data.push(generateRecord(i++, { temperature: -25, vibration: 2, healthScore: 10, alert_flag: 'FAULTY', remarks: 'Temperature below -20' }));
data.push(generateRecord(i++, { temperature: 40, vibration: -5, healthScore: 10, alert_flag: 'FAULTY', remarks: 'Negative vibration' }));
data.push(generateRecord(i++, { temperature: 40, vibration: 120, healthScore: 10, alert_flag: 'FAULTY', remarks: 'Vibration above limit' }));
// MISSING / NULL / NAN
data.push(generateRecord(i++, { temperature: null, vibration: null, rpm: null, healthScore: 0, alert_flag: 'MISSING', remarks: 'Null values' }));
data.push(generateRecord(i++, { temperature: NaN, vibration: NaN, healthScore: 0, alert_flag: 'MISSING', remarks: 'NaN values' }));
data.push(generateRecord(i++, { temperature: undefined, vibration: undefined, healthScore: 0, alert_flag: 'MISSING', remarks: 'Undefined values' }));
// STUCK SENSORS (Repeated exactly)
for(let k=0; k<3; k++) {
  data.push(generateRecord(i++, { machine_id: 'MCH-102', temperature: 50.123, vibration: 2.123, healthScore: 40, alert_flag: 'STUCK', remarks: 'Stuck sensor repeated' }));
}
// RANDOM NOISY
for(let k=0; k<5; k++) {
  data.push(generateRecord(i++, { temperature: 20 + Math.random()*60, vibration: Math.random()*10, healthScore: 50 + Math.random()*30, alert_flag: 'NORMAL', remarks: 'Random noisy values' }));
}
// SENSOR SPIKES (Normal but extreme sudden transient)
for(let k=0; k<5; k++) {
  data.push(generateRecord(i++, { temperature: 45, vibration: 15.6, healthScore: 90, alert_flag: 'WARNING', remarks: 'Sensor spike value detected' }));
}

// 1. write sampleReadings.json
fs.writeFileSync(path.join(dataDir, 'sampleReadings.json'), JSON.stringify(data, null, 2));

// 2. write sampleReadings.js
const jsContent = `const sampleReadings = ${JSON.stringify(data, null, 2)};\n\nmodule.exports = sampleReadings;\n`;
fs.writeFileSync(path.join(dataDir, 'sampleReadings.js'), jsContent);

// 3. write sampleReadings.csv
const header = ['reading_id', 'machine_id', 'temperature', 'vibration', 'rpm', 'voltage', 'current', 'healthScore', 'alert_flag', 'recorded_at'].join(',');
const csvRows = data.map(r => [
  r.reading_id, r.machine_id, r.temperature, r.vibration, r.rpm, r.voltage, r.current, r.healthScore, r.alert_flag, r.recorded_at
].join(','));
fs.writeFileSync(path.join(dataDir, 'sampleReadings.csv'), [header, ...csvRows].join('\n'));

console.log('Successfully generated sampleReadings.js, .json, and .csv with', data.length, 'records.');
