/**
 * Sample Machine Condition Readings Dataset (40+ Records)
 * Contains mandatory fields: reading_id, machine_id, vibration, temperature, alert_flag, recorded_at
 * Includes edge cases: missing values, null values, out-of-range values, negative vibration, stuck sensor, duplicate timestamps, future timestamps
 */

const sampleReadings = [
  // Normal & Valid Operational Readings
  { reading_id: 'RDG-1001', machine_id: 'MCH-101', vibration: 1.45, temperature: 42.5, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:00:00.000Z', remarks: 'Nominal operational status' },
  { reading_id: 'RDG-1002', machine_id: 'MCH-101', vibration: 1.52, temperature: 43.1, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:02:00.000Z', remarks: 'Routine spindle sweep' },
  { reading_id: 'RDG-1003', machine_id: 'MCH-102', vibration: 4.82, temperature: 68.2, alert_flag: 'WARNING', recorded_at: '2026-07-24T10:04:00.000Z', remarks: 'Hydraulic pressure elevation' },
  { reading_id: 'RDG-1004', machine_id: 'MCH-103', vibration: 7.95, temperature: 89.4, alert_flag: 'CRITICAL', recorded_at: '2026-07-24T10:06:00.000Z', remarks: 'Turbine bearing vibration breach' },
  { reading_id: 'RDG-1005', machine_id: 'MCH-104', vibration: 1.88, temperature: 45.1, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:08:00.000Z', remarks: 'Compressor intake nominal' },
  { reading_id: 'RDG-1006', machine_id: 'MCH-105', vibration: 0.92, temperature: 38.9, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:10:00.000Z', remarks: 'Robotic joint 04 smooth' },
  { reading_id: 'RDG-1007', machine_id: 'MCH-106', vibration: 5.12, temperature: 71.0, alert_flag: 'WARNING', recorded_at: '2026-07-24T10:12:00.000Z', remarks: 'Induction motor stator heat' },
  { reading_id: 'RDG-1008', machine_id: 'MCH-101', vibration: 2.10, temperature: 48.0, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:14:00.000Z', remarks: 'High speed pass' },
  { reading_id: 'RDG-1009', machine_id: 'MCH-102', vibration: 3.90, temperature: 62.5, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:16:00.000Z', remarks: 'Cycle complete' },
  { reading_id: 'RDG-1010', machine_id: 'MCH-103', vibration: 8.40, temperature: 91.2, alert_flag: 'CRITICAL', recorded_at: '2026-07-24T10:18:00.000Z', remarks: 'Thermal & vibration alarm' },
  
  // Edge Case 1: Out-of-Range High Temperature (> 120°C / 150°C)
  { reading_id: 'RDG-1011', machine_id: 'MCH-103', vibration: 12.5, temperature: 185.0, alert_flag: 'FAULTY', recorded_at: '2026-07-24T10:20:00.000Z', remarks: 'Impossible physical temp - sensor breakdown' },
  
  // Edge Case 2: Out-of-Range Negative Temperature (< -20°C)
  { reading_id: 'RDG-1012', machine_id: 'MCH-101', vibration: 1.20, temperature: -45.0, alert_flag: 'FAULTY', recorded_at: '2026-07-24T10:22:00.000Z', remarks: 'Sub-zero anomaly on indoor mill' },

  // Edge Case 3: Negative Vibration Value (< 0 mm/s)
  { reading_id: 'RDG-1013', machine_id: 'MCH-104', vibration: -5.40, temperature: 44.0, alert_flag: 'FAULTY', recorded_at: '2026-07-24T10:24:00.000Z', remarks: 'Negative vibration RMS invalid' },

  // Edge Case 4: Extreme Out-of-Range Vibration (> 100 mm/s)
  { reading_id: 'RDG-1014', machine_id: 'MCH-106', vibration: 250.0, temperature: 65.0, alert_flag: 'FAULTY', recorded_at: '2026-07-24T10:26:00.000Z', remarks: 'Accelerating transducer overflow' },

  // Edge Case 5: Null Values
  { reading_id: 'RDG-1015', machine_id: 'MCH-102', vibration: null, temperature: 55.0, alert_flag: 'MISSING', recorded_at: '2026-07-24T10:28:00.000Z', remarks: 'Vibration payload dropped' },
  { reading_id: 'RDG-1016', machine_id: 'MCH-105', vibration: 0.85, temperature: null, alert_flag: 'MISSING', recorded_at: '2026-07-24T10:30:00.000Z', remarks: 'Thermocouple signal lost' },

  // Edge Case 6: Missing Field Values
  { reading_id: 'RDG-1017', machine_id: 'MCH-101', vibration: undefined, temperature: 43.0, alert_flag: 'MISSING', recorded_at: '2026-07-24T10:32:00.000Z', remarks: 'Undefined vibration field' },

  // Edge Case 7: Stuck Sensor Value (Repeated identical floats across timestamps)
  { reading_id: 'RDG-1018', machine_id: 'MCH-108', vibration: 3.14159, temperature: 50.000, alert_flag: 'STUCK', recorded_at: '2026-07-24T10:34:00.000Z', remarks: 'Frozen ADC output bit 1' },
  { reading_id: 'RDG-1019', machine_id: 'MCH-108', vibration: 3.14159, temperature: 50.000, alert_flag: 'STUCK', recorded_at: '2026-07-24T10:36:00.000Z', remarks: 'Frozen ADC output bit 2' },
  { reading_id: 'RDG-1020', machine_id: 'MCH-108', vibration: 3.14159, temperature: 50.000, alert_flag: 'STUCK', recorded_at: '2026-07-24T10:38:00.000Z', remarks: 'Frozen ADC output bit 3' },

  // Edge Case 8: Duplicate Timestamps
  { reading_id: 'RDG-1021', machine_id: 'MCH-101', vibration: 1.60, temperature: 44.0, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:40:00.000Z', remarks: 'Primary packet' },
  { reading_id: 'RDG-1022', machine_id: 'MCH-101', vibration: 1.62, temperature: 44.1, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:40:00.000Z', remarks: 'Duplicate packet re-transmission' },

  // Edge Case 9: Future Timestamp
  { reading_id: 'RDG-1023', machine_id: 'MCH-102', vibration: 2.10, temperature: 50.0, alert_flag: 'FAULTY', recorded_at: '2028-12-31T23:59:59.000Z', remarks: 'NTP clock synchronization skew' },

  // More Standard Operational Samples to hit 40+ count
  { reading_id: 'RDG-1024', machine_id: 'MCH-101', vibration: 1.48, temperature: 43.2, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:42:00.000Z', remarks: 'Continuous monitor' },
  { reading_id: 'RDG-1025', machine_id: 'MCH-102', vibration: 4.10, temperature: 64.0, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:44:00.000Z', remarks: 'Hydraulic stabilization' },
  { reading_id: 'RDG-1026', machine_id: 'MCH-103', vibration: 7.10, temperature: 83.0, alert_flag: 'CRITICAL', recorded_at: '2026-07-24T10:46:00.000Z', remarks: 'High bearing wear' },
  { reading_id: 'RDG-1027', machine_id: 'MCH-104', vibration: 1.95, temperature: 46.0, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:48:00.000Z', remarks: 'Compressor check' },
  { reading_id: 'RDG-1028', machine_id: 'MCH-105', vibration: 0.95, temperature: 39.2, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:50:00.000Z', remarks: 'Arm axis 1 step' },
  { reading_id: 'RDG-1029', machine_id: 'MCH-106', vibration: 5.40, temperature: 73.5, alert_flag: 'WARNING', recorded_at: '2026-07-24T10:52:00.000Z', remarks: 'Substation motor peak' },
  { reading_id: 'RDG-1030', machine_id: 'MCH-107', vibration: 0.00, temperature: 24.0, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:54:00.000Z', remarks: 'Lathe offline cold state' },
  { reading_id: 'RDG-1031', machine_id: 'MCH-108', vibration: 2.10, temperature: 49.3, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:56:00.000Z', remarks: 'Water pump steady flow' },
  { reading_id: 'RDG-1032', machine_id: 'MCH-101', vibration: 1.40, temperature: 42.1, alert_flag: 'NORMAL', recorded_at: '2026-07-24T10:58:00.000Z', remarks: 'Coolant flush active' },
  { reading_id: 'RDG-1033', machine_id: 'MCH-102', vibration: 4.90, temperature: 69.1, alert_flag: 'WARNING', recorded_at: '2026-07-24T11:00:00.000Z', remarks: 'Pressure shift' },
  { reading_id: 'RDG-1034', machine_id: 'MCH-103', vibration: 8.10, temperature: 88.5, alert_flag: 'CRITICAL', recorded_at: '2026-07-24T11:02:00.000Z', remarks: 'Impeller imbalance' },
  { reading_id: 'RDG-1035', machine_id: 'MCH-104', vibration: 1.82, temperature: 44.8, alert_flag: 'NORMAL', recorded_at: '2026-07-24T11:04:00.000Z', remarks: 'Filter delta P ok' },
  { reading_id: 'RDG-1036', machine_id: 'MCH-105', vibration: 0.88, temperature: 38.5, alert_flag: 'NORMAL', recorded_at: '2026-07-24T11:06:00.000Z', remarks: 'Arm axis 2 step' },
  { reading_id: 'RDG-1037', machine_id: 'MCH-106', vibration: 4.95, temperature: 70.2, alert_flag: 'WARNING', recorded_at: '2026-07-24T11:08:00.000Z', remarks: 'Bearing temp elevated' },
  { reading_id: 'RDG-1038', machine_id: 'MCH-107', vibration: 0.00, temperature: 24.1, alert_flag: 'NORMAL', recorded_at: '2026-07-24T11:10:00.000Z', remarks: 'Maintenance hold' },
  { reading_id: 'RDG-1039', machine_id: 'MCH-108', vibration: 2.15, temperature: 49.8, alert_flag: 'NORMAL', recorded_at: '2026-07-24T11:12:00.000Z', remarks: 'Main pump loop 2' },
  { reading_id: 'RDG-1040', machine_id: 'MCH-101', vibration: 1.43, temperature: 42.4, alert_flag: 'NORMAL', recorded_at: '2026-07-24T11:14:00.000Z', remarks: 'Precision finish cut' },
  { reading_id: 'RDG-1041', machine_id: 'MCH-102', vibration: 3.95, temperature: 63.1, alert_flag: 'NORMAL', recorded_at: '2026-07-24T11:16:00.000Z', remarks: 'Press release step' },
  { reading_id: 'RDG-1042', machine_id: 'MCH-103', vibration: 7.80, temperature: 87.9, alert_flag: 'CRITICAL', recorded_at: '2026-07-24T11:18:00.000Z', remarks: 'Vibration harmonics' },
];

module.exports = sampleReadings;
