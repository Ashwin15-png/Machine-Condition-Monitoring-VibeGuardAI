const Telemetry = require('../models/Telemetry');
const Machine = require('../models/Machine');
const Prediction = require('../models/Prediction');

const getPredictiveAnalytics = async (req, res) => {
  try {
    const { machineId } = req.query;
    const query = (machineId && machineId !== 'ALL') ? { machineId } : {};
    const fleet = await Machine.find(query);
    
    // Calculate global RUL based on vibration thresholding against past 50 points
    const predictions = await Promise.all(fleet.map(async (m) => {
       const recentTelem = await Telemetry.find({ machineId: m.machineId }).sort({ timestamp: -1 }).limit(100);
       
       let vibTrend = 0;
       let tempTrend = 0;
       let futureTemp = m.temperature || 45;
       let futureVib = m.vibration || 1.5;
       let rulHours = 4000;
       let riskPercent = 5;

       if (recentTelem.length > 20) {
          const oldest = recentTelem[recentTelem.length - 1];
          const newest = recentTelem[0];

          const dv = newest.vibrationRMS - oldest.vibrationRMS;
          const dt = newest.temperature - oldest.temperature;

          vibTrend = dv / recentTelem.length;
          tempTrend = dt / recentTelem.length;
          
          futureTemp = Number((newest.temperature + (tempTrend * 60)).toFixed(1)); // projected 1 hr temp
          futureVib = Number((newest.vibrationRMS + (vibTrend * 60)).toFixed(2));

          if (vibTrend > 0.05 || m.status === 'Critical') {
             rulHours = Math.max(50, 4000 - (vibTrend * 30000));
             riskPercent = Math.min(95, 20 + (vibTrend * 1000));
          } else if (m.status === 'Warning') {
             rulHours = 1200;
             riskPercent = 45;
          } else {
             rulHours = 4280;
             riskPercent = 8;
          }
       }

       return {
         machineId: m.machineId,
         machineName: m.name,
         currentHealth: m.healthScore || 90,
         status: m.status,
         futureTempTrend: tempTrend > 0 ? 'UP' : 'DOWN',
         futureVibTrend: vibTrend > 0 ? 'UP' : 'DOWN',
         projectedTemp: futureTemp,
         projectedVib: futureVib,
         rulHours: Math.floor(rulHours),
         riskPercent: Math.min(100, Math.floor(riskPercent))
       };
    }));

    // Find highest risk machine
    const sortedPredictions = [...predictions].sort((a,b) => b.riskPercent - a.riskPercent);
    const topRisk = sortedPredictions[0] || null;

    return res.json({
      success: true,
      data: {
        fleetPredictions: sortedPredictions,
        topRiskMachine: topRisk,
        systemMeanRul: Math.floor(predictions.reduce((acc, p) => acc + p.rulHours, 0) / (predictions.length || 1)),
        systemMeanRisk: Math.floor(predictions.reduce((acc, p) => acc + p.riskPercent, 0) / (predictions.length || 1)),
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPredictiveAnalytics };
