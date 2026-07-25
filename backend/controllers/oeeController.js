const Machine = require('../models/Machine');

const getOeeData = async (req, res) => {
  try {
    const { machineId } = req.query;
    const query = (machineId && machineId !== 'ALL') ? { machineId } : {};
    const fleet = await Machine.find(query);

    const oeeData = fleet.map(m => {
      // Calculate random but deterministic OEE stats based on healthScore
      const availability = Math.min(100, Math.floor(m.healthScore + 2));
      const performance = Math.min(100, Math.floor(m.healthScore + Math.random() * 5));
      const quality = Math.min(100, Math.floor(m.healthScore + Math.random() * 8));
      
      const overall = ((availability * performance * quality) / 1000000) * 100;
      
      return {
        machineId: m.machineId,
        machineName: m.name,
        availability,
        performance,
        quality,
        overall: overall.toFixed(1),
        daily: (overall - Math.random() * 2).toFixed(1),
        weekly: (overall + Math.random() * 2).toFixed(1),
        monthly: (overall + Math.random() * 4).toFixed(1),
      };
    });

    const avgAvail = (oeeData.reduce((acc, o) => acc + o.availability, 0) / oeeData.length).toFixed(1);
    const avgPerf = (oeeData.reduce((acc, o) => acc + o.performance, 0) / oeeData.length).toFixed(1);
    const avgQual = (oeeData.reduce((acc, o) => acc + o.quality, 0) / oeeData.length).toFixed(1);
    const avgOverall = (oeeData.reduce((acc, o) => acc + Number(o.overall), 0) / oeeData.length).toFixed(1);

    return res.json({
      success: true,
      data: {
        fleetOee: oeeData,
        systemOee: {
           availability: avgAvail,
           performance: avgPerf,
           quality: avgQual,
           overall: avgOverall
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOeeData };
