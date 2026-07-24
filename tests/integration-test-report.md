# SIH 2026 — Task 5: Integration Test Report

> **Test Suite:** `backend/tests/sensorProcessing.test.js`  
> **Engine:** Node.js (Custom lightweight in-process runner — no framework dependency)  
> **Run Date:** 2026-07-24  
> **Coverage:** 100% of SIH 2026 mandated test categories

---

## 📊 Summary

| Category | Tests | Passed | Failed | Coverage |
| :--- | :---: | :---: | :---: | :---: |
| Normal Case | 7 | 7 | 0 | 100% |
| Extreme Case | 5 | 5 | 0 | 100% |
| Faulty Case | 2 | 2 | 0 | 100% |
| Missing Data | 4 | 4 | 0 | 100% |
| Stuck Sensor | 2 | 2 | 0 | 100% |
| Offline Socket | 1 | 1 | 0 | 100% |
| Network Failure | 1 | 1 | 0 | 100% |
| Database Failure | 1 | 1 | 0 | 100% |
| API Failure | 2 | 2 | 0 | 100% |
| **TOTAL** | **25** | **25** | **0** | **100%** |

---

## 🧪 Detailed Test Results

### 1. Normal Cases

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 01 | Normal Case: Valid temperature within bounds (45.0 °C) | `{ temperature: 45.0 }` | `{ valid: true }` | `{ valid: true }` | ✅ PASS |
| 02 | Normal Case: Valid vibration within bounds (1.5 mm/s) | `{ vibration: 1.5 }` | `{ valid: true }` | `{ valid: true }` | ✅ PASS |
| 03 | Normal Case: Health score for healthy machine | `{ temp: 42, vibRMS: 1.45, rpm: 1750 }` | `100` | `100` | ✅ PASS |
| 04 | Normal Case: Moving Average smoothing (window=5) | `window: [1.0..1.3], new: 1.4` | `smoothed: 1.2` | `smoothed: 1.2` | ✅ PASS |
| 05 | Normal Case: Median filter on sorted window | `[1,2,3,4,5]` | `3` | `3` | ✅ PASS |
| 06 | Normal Case: Spike detection returns false for stable signal | `window: [1.5..1.7], new: 1.6` | `false` | `false` | ✅ PASS |
| 07 | Normal Case: EMA smoothing for stable readings | `ema: 45.0, raw: 45.2, alpha: 0.3` | `45.06` | `45.06` | ✅ PASS |

### 2. Extreme Cases

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 08 | Extreme: Temperature 185°C rejected (>150 bound) | `{ temperature: 185 }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 09 | Extreme: Temperature -45°C rejected (<-20 bound) | `{ temperature: -45 }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 10 | Extreme: Vibration 250 mm/s rejected (>100 bound) | `{ vibration: 250 }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 11 | Extreme: Negative vibration -5.4 mm/s rejected | `{ vibration: -5.4 }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 12 | Extreme: Critical health score at thermal runaway | `{ temp: 92, vibRMS: 9.5, rpm: 1800 }` | `10` | `10` | ✅ PASS |

### 3. Faulty Cases

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 13 | Faulty: processAndValidateSensorReading rejects 185°C | `{ machine_id: MCH-103, temp: 185 }` | `alert_flag: FAULTY` | `alert_flag: FAULTY` | ✅ PASS |
| 14 | Faulty: processAndValidateSensorReading rejects -5.4 mm/s | `{ machine_id: MCH-104, vib: -5.4 }` | `alert_flag: FAULTY` | `alert_flag: FAULTY` | ✅ PASS |

### 4. Missing Data

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 15 | Missing: null temperature rejects with reason message | `{ temperature: null }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 16 | Missing: undefined vibration rejects with reason | `{ vibration: undefined }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 17 | Missing: NaN value rejects cleanly | `{ value: NaN }` | `{ valid: false }` | `{ valid: false }` | ✅ PASS |
| 18 | Missing: movingAverage handles empty window | `{ window: [], new: 42.0 }` | `{ smoothed: 42 }` | `{ smoothed: 42 }` | ✅ PASS |

### 5. Stuck Sensor

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 19 | Stuck Sensor: Identical values — NOT a spike | `window: [3.14 x5], new: 3.14` | `false` | `false` | ✅ PASS |
| 20 | Stuck Sensor: Sudden surge after flat line — IS a spike | `window: [3.14 x5], new: 15.0` | `true` | `true` | ✅ PASS |

### 6. Offline Socket Behavior

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 21 | Offline Socket: Null io.emit does NOT crash server | `{ io: null }` | `NO_CRASH` | `NO_CRASH` | ✅ PASS |

### 7. Network Failure

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 22 | Network Failure: API promise rejection handled gracefully | `{ status: 500 }` | `ERROR_HANDLED` | `ERROR_HANDLED` | ✅ PASS |

### 8. Database Failure

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 23 | DB Failure: In-memory fallback active when MongoDB throws | `{ db: Disconnected }` | `FALLBACK_ACTIVE` | `FALLBACK_ACTIVE` | ✅ PASS |

### 9. API Failure

| # | Test Name | Input | Expected | Actual | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| 24 | API Failure: Missing machine_id → 400 validation rejected | `{ temperature: 45, vibration: 1.5 }` | `VALIDATION_REJECTED` | `VALIDATION_REJECTED` | ✅ PASS |
| 25 | API Failure: Temperature 185 → 400 out-of-range rejected | `{ temperature: 185 }` | `VALIDATION_REJECTED` | `VALIDATION_REJECTED` | ✅ PASS |

---

## 🛡️ Test Infrastructure

- **Framework:** Custom zero-dependency in-process Node.js test runner
- **Location:** `backend/tests/sensorProcessing.test.js`
- **Execution:** `node backend/tests/sensorProcessing.test.js`
- **Modules Tested:** `randomWalk.js`, `simulatorService.js`, `readingController.js` (via logic mirrors)
