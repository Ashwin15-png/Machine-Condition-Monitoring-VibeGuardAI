/**
 * @module randomWalk
 * @description Signal Processing Utilities for Industrial IoT Telemetry (TASK 4)
 * Implements: Moving Average (window=5), Median Filter (spike detection), Noise Reduction, Range Validation
 */

/**
 * Random Walk - Generates physically realistic drifting sensor values.
 * Prevents erratic quantum jumps; simulates inertia in physical systems.
 * @param {number} currentVal - Current value
 * @param {number} min - Lower bound
 * @param {number} max - Upper bound
 * @param {number} maxStep - Maximum change per tick
 * @returns {number}
 */
function randomWalk(currentVal, min, max, maxStep = 0.5) {
  const delta = (Math.random() - 0.49) * maxStep;
  let nextVal = currentVal + delta;
  if (nextVal < min) nextVal = min + Math.random() * 0.1;
  if (nextVal > max) nextVal = max - Math.random() * 0.1;
  return Number(nextVal.toFixed(2));
}

/**
 * Moving Average Filter (Window Size 5) - TASK 4
 * Reduces noise by averaging the last N readings.
 * Non-blocking: uses a pure array window with no I/O.
 * @param {number[]} window - Sliding window buffer of recent values
 * @param {number} newValue - Incoming raw sensor reading
 * @param {number} windowSize - Smoothing window size (default: 5)
 * @returns {{ smoothed: number, window: number[] }}
 */
function movingAverage(window, newValue, windowSize = 5) {
  const updated = [...window, newValue];
  if (updated.length > windowSize) updated.shift();
  const sum = updated.reduce((acc, v) => acc + v, 0);
  return {
    smoothed: Number((sum / updated.length).toFixed(2)),
    window: updated,
  };
}

/**
 * Median Filter - TASK 4 Spike Detection
 * Eliminates transient spikes by replacing a value with the window median.
 * Effective for single-sample impulse noise (EMI, cable break transients).
 * @param {number[]} window - Sorted buffer of recent values
 * @returns {number} Median value
 */
function medianFilter(window) {
  if (!window || window.length === 0) return 0;
  const sorted = [...window].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2))
    : Number(sorted[mid].toFixed(2));
}

/**
 * Spike Detection - TASK 4
 * Returns true if the new value deviates from the median by more than threshold.
 * @param {number} newValue - Incoming reading
 * @param {number[]} window - Historical window
 * @param {number} threshold - Deviation threshold to classify as spike (default: 2x stddev approach)
 * @returns {boolean}
 */
function isSpikeDetected(newValue, window, threshold = 3.0) {
  if (!window || window.length < 3) return false;
  const median = medianFilter(window);
  return Math.abs(newValue - median) > threshold;
}

/**
 * Gaussian Noise Reduction - TASK 4
 * Applies a lightweight exponential smoothing (EMA) for noise reduction.
 * alpha: smoothing factor (0 = max smooth, 1 = no smoothing)
 * @param {number} ema - Previous exponential moving average
 * @param {number} rawValue - New raw incoming value
 * @param {number} alpha - Smoothing factor (default 0.3)
 * @returns {number}
 */
function exponentialMovingAverage(ema, rawValue, alpha = 0.3) {
  if (ema === null || ema === undefined) return rawValue;
  return Number((alpha * rawValue + (1 - alpha) * ema).toFixed(2));
}

/**
 * Range Validator - TASK 4
 * Hard-rejects readings outside physical sensor bounds.
 * @param {number} value - Value to validate
 * @param {number} min - Minimum valid physical reading
 * @param {number} max - Maximum valid physical reading
 * @param {string} unit - Unit label for error message
 * @returns {{ valid: boolean, reason?: string }}
 */
function validateRange(value, min, max, unit = '') {
  if (value === null || value === undefined || isNaN(value)) {
    return { valid: false, reason: `Invalid or missing value (${unit})` };
  }
  if (value < min) {
    return { valid: false, reason: `Value ${value}${unit} below minimum bound ${min}${unit}` };
  }
  if (value > max) {
    return { valid: false, reason: `Value ${value}${unit} exceeds maximum bound ${max}${unit}` };
  }
  return { valid: true };
}

/**
 * Health Score Calculator
 * Computes a 0-100 machine health score from key vitals.
 * @param {number} temp - Temperature in °C
 * @param {number} vibRMS - Vibration RMS in mm/s
 * @param {number} rpm - Rotational speed
 * @returns {number}
 */
function calculateHealthScore(temp, vibRMS, rpm) {
  let score = 100;
  if (temp > 75) score -= (temp - 75) * 2;
  if (vibRMS > 3.0) score -= (vibRMS - 3.0) * 8;
  if (rpm < 1500) score -= 5;
  return Math.max(10, Math.min(100, Math.round(score)));
}

module.exports = {
  randomWalk,
  movingAverage,
  medianFilter,
  isSpikeDetected,
  exponentialMovingAverage,
  validateRange,
  calculateHealthScore,
};
