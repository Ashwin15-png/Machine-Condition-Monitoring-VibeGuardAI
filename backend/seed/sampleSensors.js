/**
 * Sample Industrial Sensors Dataset
 */

const sampleSensors = [
  {
    sensorId: 'SN-SENS-8891',
    machineId: 'MCH-101',
    sensorType: 'Vibration Acceleration',
    currentValue: 1.45,
    unit: 'mm/s',
    minThreshold: 0.0,
    maxThreshold: 4.5,
    status: 'Healthy',
    lastUpdated: '2026-07-24T10:00:00.000Z',
  },
  {
    sensorId: 'SN-SENS-8892',
    machineId: 'MCH-102',
    sensorType: 'Hydraulic Pressure',
    currentValue: 6.2,
    unit: 'bar',
    minThreshold: 3.0,
    maxThreshold: 7.0,
    status: 'Warning',
    lastUpdated: '2026-07-24T10:04:00.000Z',
  },
  {
    sensorId: 'SN-SENS-8893',
    machineId: 'MCH-103',
    sensorType: 'Thermal Envelope Thermocouple',
    currentValue: 89.4,
    unit: '°C',
    minThreshold: 0.0,
    maxThreshold: 75.0,
    status: 'Critical',
    lastUpdated: '2026-07-24T10:06:00.000Z',
  },
  {
    sensorId: 'SN-SENS-8894',
    machineId: 'MCH-104',
    sensorType: 'Air Pressure Transducer',
    currentValue: 5.5,
    unit: 'bar',
    minThreshold: 3.0,
    maxThreshold: 7.0,
    status: 'Healthy',
    lastUpdated: '2026-07-24T10:08:00.000Z',
  },
  {
    sensorId: 'SN-SENS-8895',
    machineId: 'MCH-105',
    sensorType: 'Optical Encoder Axis 1',
    currentValue: 1600,
    unit: 'RPM',
    minThreshold: 1000,
    maxThreshold: 2000,
    status: 'Healthy',
    lastUpdated: '2026-07-24T10:10:00.000Z',
  },
  {
    sensorId: 'SN-SENS-8896',
    machineId: 'MCH-106',
    sensorType: 'Current Transformer 3-Phase',
    currentValue: 15.8,
    unit: 'A',
    minThreshold: 5.0,
    maxThreshold: 16.5,
    status: 'Warning',
    lastUpdated: '2026-07-24T10:12:00.000Z',
  },
];

module.exports = sampleSensors;
