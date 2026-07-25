const Telemetry = require('../models/Telemetry');
const Machine = require('../models/Machine');
const { Parser } = require('json2csv');

const getTelemetryStream = async (req, res) => {
  try {
    const { machineId } = req.query;
    const machineFilter = machineId && machineId !== 'ALL' ? { machineId } : {};

    // 1. Fetch Fleet from MongoDB
    const fleet = await Machine.find(machineFilter);

    // 2. Fetch recent telemetry history
    const recentDocs = await Telemetry.aggregate([
      { $match: machineFilter },
      { $sort: { timestamp: -1 } },
      { $limit: 300 },
    ]);

    // Group by timestamp to reconstruct history array format expected by frontend
    const historyMap = {};
    for (const doc of recentDocs) {
        const timeKey = new Date(doc.timestamp).toLocaleTimeString('en-US', { hour12: false });
        if (!historyMap[timeKey]) {
            historyMap[timeKey] = {
                time: timeKey,
                temps: [],
                vibs: [],
                primary: null
            };
        }
        historyMap[timeKey].temps.push(doc.temperature);
        historyMap[timeKey].vibs.push(doc.vibrationRMS || 0);
        
        if (!machineFilter.machineId && doc.machineId === 'MCH-101') {
            historyMap[timeKey].primary = doc;
        } else if (machineFilter.machineId) {
            historyMap[timeKey].primary = doc;
        }
    }

    const historyArray = Object.values(historyMap)
       .reverse()
       .slice(-50)
       .map(slot => {
           const validTemps = slot.temps.filter(t => t !== null && !isNaN(t));
           const validVibs = slot.vibs.filter(v => v !== null && !isNaN(v));
           const avgTemp = validTemps.length ? Number((validTemps.reduce((a,b)=>a+b,0)/validTemps.length).toFixed(1)) : 45.0;
           const maxTemp = validTemps.length ? Number(Math.max(...validTemps).toFixed(1)) : 45.0;
           return {
               time: slot.time,
               avgTemp,
               maxTemp,
               vibrationX: slot.primary ? slot.primary.vibrationX : 1.2,
               vibrationY: slot.primary ? slot.primary.vibrationY : 1.1,
               vibrationZ: slot.primary ? slot.primary.vibrationZ : 1.4,
               peakRMS: slot.primary ? slot.primary.vibrationRMS : 1.5,
           };
       });

    return res.json({
      success: true,
      data: {
        latest: historyArray[historyArray.length - 1] || null,
        history: historyArray,
        fleet,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getHistoryLogs = async (req, res) => {
  try {
    const { machineId } = req.query;
    const query = (machineId && machineId !== 'ALL') ? { machineId } : {};
    const logs = await Telemetry.find(query).sort({ timestamp: -1 }).limit(100);
    const machinesCache = {};

    for (const log of logs) {
        if (!machinesCache[log.machineId]) {
            const m = await Machine.findOne({ machineId: log.machineId });
            machinesCache[log.machineId] = m ? m.name : log.machineId;
        }
    }

    const formattedLogs = logs.map((item, idx) => ({
      id: `LOG-${8800 + idx}`,
      timestamp: new Date(item.timestamp).toLocaleTimeString('en-US', { hour12: false }),
      machineId: item.machineId,
      machineName: machinesCache[item.machineId] || 'Machine',
      metric: 'Temperature & Vibration',
      val: `${item.temperature} °C / ${item.vibrationRMS} mm/s`,
      status: item.temperature > 75.0 || item.vibrationRMS > 4.5 ? 'Exceeded' : 'Normal',
    }));
    return res.json({ success: true, data: formattedLogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const exportHistoryLogsCSV = async (req, res) => {
  try {
    const { machineId } = req.query;
    const query = (machineId && machineId !== 'ALL') ? { machineId } : {};
    const logs = await Telemetry.find(query).sort({ timestamp: -1 }).limit(1000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    
    const formattedLogs = logs.map((item, idx) => ({
      'Timestamp': new Date(item.timestamp).toLocaleString(),
      'User': 'System Telemetry Daemon',
      'Action': 'Record Sample',
      'Module': 'Telemetry',
      'Machine': item.machineId,
      'Reading ID': `LOG-${8800 + idx}`,
      'Status': item.temperature > 75.0 || item.vibrationRMS > 4.5 ? 'Exceeded' : 'Normal',
      'Description': `Temperature ${item.temperature}C / Vibration ${item.vibrationRMS}mm/s`,
      'IP Address': '127.0.0.1'
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(formattedLogs);

    res.header('Content-Type', 'text/csv');
    res.attachment(`History_Log_${dateStr}.csv`);
    return res.send(csv);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'CSV Generation Failed' });
  }
};

module.exports = {
  getTelemetryStream,
  getHistoryLogs,
  exportHistoryLogsCSV
};
