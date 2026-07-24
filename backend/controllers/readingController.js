const Reading = require('../models/Reading');
const { processAndValidateSensorReading } = require('../services/simulatorService');

/**
 * Server-Side Machine Reading Registration (TASK 2)
 * Validates, calculates alert_flag, persists, and returns SIH 2026 response.
 */
const addReading = async (req, res) => {
  try {
    const { machine_id, vibration, temperature, recorded_at, remarks } = req.body;

    // Strict Server-Side Validation (Never trust frontend validation alone)
    if (!machine_id || machine_id.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: machine_id is required',
      });
    }

    const tempNum = temperature !== undefined && temperature !== null && temperature !== '' ? Number(temperature) : null;
    const vibNum = vibration !== undefined && vibration !== null && vibration !== '' ? Number(vibration) : null;

    if (tempNum === null || isNaN(tempNum)) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: temperature must be a valid number',
      });
    }

    if (vibNum === null || isNaN(vibNum)) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: vibration must be a valid number',
      });
    }

    // Task 4 Bounds & Plausibility Validation
    if (tempNum < -20 || tempNum > 150) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: temperature ${tempNum} °C out of physical bounds (-20 °C to 150 °C)`,
      });
    }

    if (vibNum < 0 || vibNum > 100) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: vibration ${vibNum} mm/s out of physical bounds (0 mm/s to 100 mm/s)`,
      });
    }

    // Calculate Server-Side alert_flag
    let calculatedFlag = 'NORMAL';
    if (tempNum > 78.0 || vibNum > 6.5) {
      calculatedFlag = 'CRITICAL';
    } else if (tempNum > 70.0 || vibNum > 4.5) {
      calculatedFlag = 'WARNING';
    }

    const { calculateHealthScore } = require('../utils/randomWalk');
    const healthScore = calculateHealthScore(tempNum, vibNum, 1750);

    // Prepare payload
    const processedReadingData = processAndValidateSensorReading({
      reading_id: `RDG-${Date.now().toString().slice(-6)}`,
      machine_id: machine_id.trim(),
      vibration: Number(vibNum.toFixed(2)),
      temperature: Number(tempNum.toFixed(1)),
      healthScore: healthScore,
      alert_flag: calculatedFlag,
      recorded_at: recorded_at || new Date().toISOString(),
      remarks: remarks || 'Manual Machine Reading Registration',
    });

    // Save into MongoDB
    const newReading = await Reading.create(processedReadingData);

    // Update Telemetry and Machine immediately to reflect on Dashboard
    const Machine = require('../models/Machine');
    const Telemetry = require('../models/Telemetry');
    
    await Telemetry.create({
      timestamp: new Date(),
      machineId: machine_id.trim(),
      temperature: Number(tempNum.toFixed(1)),
      vibrationRMS: Number(vibNum.toFixed(2)),
      rpm: 1750,
      voltage: 415,
      current: 12.0
    });
    
    let machineStatus = 'Healthy';
    if (calculatedFlag === 'CRITICAL' || calculatedFlag === 'FAULTY' || calculatedFlag === 'STUCK') machineStatus = 'Critical';
    else if (calculatedFlag === 'WARNING') machineStatus = 'Warning';

    const updatedMac = await Machine.findOneAndUpdate(
       { machineId: machine_id.trim() },
       { 
         $set: { 
           temperature: Number(tempNum.toFixed(1)), 
           vibration: Number(vibNum.toFixed(2)), 
           healthScore, 
           status: machineStatus 
         } 
       },
       { new: true }
    );

    // Broadcast live Socket.IO update if io instance present
    const io = req.app.get('io');
    if (io) {
      io.emit('reading:new', newReading);
      
      // Update dashboard live
      if (updatedMac) {
        // Optional forced machine update
        io.emit('machine:update', [updatedMac]);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Machine reading registered successfully',
      data: newReading,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during reading registration',
    });
  }
};

/**
 * Get Machine Readings List with Search, Filter, Sort, Pagination & Priority Ordering (TASK 3)
 */
const getReadings = async (req, res) => {
  try {
    const { search, machine, alert, sort, startDate, endDate, page = 1, limit = 20 } = req.query;

    const query = {};

    // Phase 3: Advanced Search (Reading ID, Machine, Date, Status, Temp)
    if (search) {
      const q = search;
      query.$or = [
        { reading_id: { $regex: q, $options: 'i' } },
        { machine_id: { $regex: q, $options: 'i' } },
        { alert_flag: { $regex: q, $options: 'i' } },
        { remarks: { $regex: q, $options: 'i' } },
        // date and temp searches can be complex as they might be numbers/dates, but we can attempt regex on strings if stored that way or just rely on exact filters
      ];
      // Numeric matching if search resembles a number
      if (!isNaN(q)) {
         query.$or.push({ temperature: Number(q) });
         query.$or.push({ vibration: Number(q) });
         query.$or.push({ healthScore: Number(q) });
      }
    }

    // Phase 4: Filters
    if (machine && machine !== 'ALL') query.machine_id = machine;
    if (alert && alert !== 'ALL') query.alert_flag = alert;
    
    // Date Range
    if (startDate || endDate) {
      query.recorded_at = {};
      if (startDate) query.recorded_at.$gte = new Date(startDate);
      if (endDate) query.recorded_at.$lte = new Date(endDate);
    }

    // Phase 5: Determine sort ordering
    let sortObj = {};
    const sortVal = sort || 'date_desc';
    if (sortVal === 'date_asc') sortObj = { recorded_at: 1 };
    else if (sortVal === 'date_desc') sortObj = { recorded_at: -1 };
    else if (sortVal === 'temp_asc') sortObj = { temperature: 1 };
    else if (sortVal === 'temp_desc') sortObj = { temperature: -1 };
    else if (sortVal === 'vib_asc') sortObj = { vibration: 1 };
    else if (sortVal === 'vib_desc') sortObj = { vibration: -1 };
    else if (sortVal === 'health_asc') sortObj = { healthScore: 1 };
    else if (sortVal === 'health_desc') sortObj = { healthScore: -1 };
    // 'priority' handled below

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skipNum = (pageNum - 1) * limitNum;

    let totalCount = 0;
    let paginatedData = [];

    if (sortVal === 'priority') {
      const priorityPipeline = [
        { $match: query },
        {
          $addFields: {
            priorityScore: {
              $switch: {
                branches: [
                  { case: { $eq: ['$alert_flag', 'FAULTY'] }, then: 1 },
                  { case: { $eq: ['$alert_flag', 'CRITICAL'] }, then: 2 },
                  { case: { $eq: ['$alert_flag', 'WARNING'] }, then: 3 },
                  { case: { $eq: ['$alert_flag', 'MISSING'] }, then: 4 },
                  { case: { $eq: ['$alert_flag', 'STUCK'] }, then: 5 },
                  { case: { $eq: ['$alert_flag', 'NORMAL'] }, then: 6 }
                ],
                default: 9
              }
            }
          }
        },
        { $sort: { priorityScore: 1, recorded_at: -1 } }
      ];

      const countResult = await Reading.aggregate([...priorityPipeline, { $count: "total" }]);
      totalCount = countResult.length > 0 ? countResult[0].total : 0;

      paginatedData = await Reading.aggregate([
        ...priorityPipeline,
        { $skip: skipNum },
        { $limit: limitNum }
      ]);
    } else {
      totalCount = await Reading.countDocuments(query);
      paginatedData = await Reading.find(query)
        .sort(sortObj)
        .skip(skipNum)
        .limit(limitNum);
    }

    return res.json({
      success: true,
      count: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      data: paginatedData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReading,
  getReadings,
};