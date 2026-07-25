const Machine = require('../models/Machine');
const Telemetry = require('../models/Telemetry');
const Alert = require('../models/Alert');

const getDashboardData = async (req, res) => {
  try {
    const { machineId } = req.query;

    const machineFilter = machineId && machineId !== 'ALL' ? { machineId } : {};

    const fleet = await Machine.find(machineId && machineId !== 'ALL' ? { machineId } : {});

    const healthyCount = fleet.filter((m) => m.status === 'Healthy').length;
    const warningCount = fleet.filter((m) => m.status === 'Warning').length;
    const criticalCount = fleet.filter((m) => m.status === 'Critical').length;

    const avgTemp = fleet.length ? Number(
      (fleet.reduce((acc, m) => acc + (m.temperature || 0), 0) / fleet.length).toFixed(1)
    ) : 45.0;
    
    const avgVib = fleet.length ? Number(
      (fleet.reduce((acc, m) => acc + (m.vibration || 0), 0) / fleet.length).toFixed(2)
    ) : 1.5;

    // Grab today's date start
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const readingsTodayQuery = { timestamp: { $gte: startOfToday }, ...machineFilter };
    const readingsToday = await Telemetry.countDocuments(readingsTodayQuery);
    
    // Total alert count
    const alertsQuery = { status: 'Active', ...machineFilter };
    const activeAlerts = await Alert.countDocuments(alertsQuery);

    // Build history for the dashboard chart similarly to telemetryController
    const recentDocs = await Telemetry.aggregate([
      { $match: machineFilter },
      { $sort: { timestamp: -1 } },
      { $limit: 300 }, 
    ]);

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
           const slotAvgTemp = validTemps.length ? Number((validTemps.reduce((a,b)=>a+b,0)/validTemps.length).toFixed(1)) : 45.0;
           const maxTemp = validTemps.length ? Number(Math.max(...validTemps).toFixed(1)) : 45.0;
           return {
               time: slot.time,
               avgTemp: slotAvgTemp,
               maxTemp,
               vibrationX: slot.primary ? slot.primary.vibrationX : 1.2,
               vibrationY: slot.primary ? slot.primary.vibrationY : 1.1,
               vibrationZ: slot.primary ? slot.primary.vibrationZ : 1.4,
               peakRMS: slot.primary ? slot.primary.vibrationRMS : 1.5,
           };
       });

    return res.json({
      success: true,
      stats: {
        totalMachines: fleet.length,
        healthyMachines: healthyCount,
        warningMachines: warningCount,
        criticalMachines: criticalCount,
        avgTemperature: avgTemp,
        avgVibration: avgVib,
        readingsToday: readingsToday,
        alertCount: activeAlerts,
        runningMachines: fleet.filter((m) => m.status !== 'Offline').length,
        overallOEE: 87.5,
      },
      healthPieData: [
        { name: 'Healthy', value: healthyCount, color: '#22C55E' },
        { name: 'Warning', value: warningCount, color: '#F59E0B' },
        { name: 'Critical', value: criticalCount, color: '#EF4444' },
      ],
      history: historyArray,
      fleet,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardData };
