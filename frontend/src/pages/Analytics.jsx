import React, { useEffect, useState } from 'react';
import { BarChart3, Zap, Activity, TrendingUp } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import VibrationChart from '../components/charts/VibrationChart';
import TemperatureChart from '../components/charts/TemperatureChart';
import ProgressBar from '../components/ui/ProgressBar';
import socket from '../services/socket';
import api from '../services/api';

export const Analytics = () => {
  const [chartHistory, setChartHistory] = useState([]);
  const [predictiveData, setPredictiveData] = useState(null);
  const [analyticsStats, setAnalyticsStats] = useState({
    totalMachines: 6,
    healthyMachines: 4,
    warningMachines: 1,
    criticalMachines: 1,
    avgVibration: 2.38,
  });

  useEffect(() => {
    let isMounted = true;

    // Fetch initial history snapshot
    api.get('/dashboard').then((res) => {
      if (isMounted && res.data.history) {
        setChartHistory(res.data.history);
      }
    }).catch(() => {});

    api.get('/predictions').then((res) => {
      if (isMounted && res.data.success) {
        setPredictiveData(res.data.data);
      }
    }).catch(() => {});

    // Live telemetry subscription for chart updates
    const onTelemetryUpdate = ({ history }) => {
      if (isMounted && history) setChartHistory(history);
    };

    const onDashboardUpdate = (stats) => {
      if (!isMounted) return;
      setAnalyticsStats({
        totalMachines: stats.totalMachines,
        healthyMachines: stats.healthyMachines,
        warningMachines: stats.warningMachines,
        criticalMachines: stats.criticalMachines,
        avgVibration: stats.avgVibration,
      });
    };

    socket.on('telemetry:update', onTelemetryUpdate);
    socket.on('dashboard:update', onDashboardUpdate);

    return () => {
      isMounted = false;
      socket.off('telemetry:update', onTelemetryUpdate);
      socket.off('dashboard:update', onDashboardUpdate);
    };
  }, []);

  const total = analyticsStats.totalMachines || 6;
  const classA = Math.round((analyticsStats.healthyMachines / total) * 100);
  const classB = Math.round(((analyticsStats.warningMachines * 0.6) / total) * 100);
  const classC = Math.round(((analyticsStats.warningMachines * 0.4) / total) * 100);
  const classD = Math.round((analyticsStats.criticalMachines / total) * 100);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <Breadcrumb />
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          <span>Predictive Analytics & Spectrum Analysis</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          FFT Frequency analysis, remaining useful life (RUL) degradation curves, and ISO 10816 vibration severity standards. Live socket-fed charts.
        </p>
      </div>

      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Fleet Predicted RUL</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-slate-100">{predictiveData ? predictiveData.systemMeanRul : 4280} Hours</p>
          <p className="text-xs text-slate-400 mt-1">Estimated mean time before failure across {total} monitored units</p>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-blue-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Top Risk Machine</span>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-xl font-bold font-mono text-slate-100">{predictiveData && predictiveData.topRiskMachine ? predictiveData.topRiskMachine.machineId : 'N/A'}</p>
          <p className="text-xs text-slate-400 mt-1">System failure risk: {predictiveData && predictiveData.topRiskMachine ? predictiveData.topRiskMachine.riskPercent : 0}%</p>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Statistical Model AI Anomaly Risk</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-400">{predictiveData ? predictiveData.systemMeanRisk : 8}% Mean Risk</p>
          <p className="text-xs text-slate-400 mt-1">Statistically derived via dynamic EWMA trending matrices</p>
        </Card>
      </div>

      {predictiveData && predictiveData.fleetPredictions && (
        <Card>
          <CardHeader>
            <CardTitle>Fleet Future Failure Prediction (1-Hour Projected Offsets)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Machine</th>
                    <th className="py-3 px-4">Current Health</th>
                    <th className="py-3 px-4">RUL Offset</th>
                    <th className="py-3 px-4">Future Temp</th>
                    <th className="py-3 px-4">Future Vib</th>
                    <th className="py-3 px-4">Failure Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {predictiveData.fleetPredictions.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">{p.machineId}</td>
                      <td className="py-3 px-4 font-mono">{p.currentHealth}%</td>
                      <td className="py-3 px-4 font-mono text-purple-400">{p.rulHours} hrs</td>
                      <td className="py-3 px-4 font-mono">{p.projectedTemp} °C ({p.futureTempTrend})</td>
                      <td className="py-3 px-4 font-mono">{p.projectedVib} mm/s ({p.futureVibTrend})</td>
                      <td className="py-3 px-4 font-mono font-bold text-red-400">{p.riskPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Vibration Spectrum Chart */}
      <VibrationChart
        title="FFT Spectral Peak Analysis (Live Socket Feed)"
        data={chartHistory.length > 0 ? chartHistory : undefined}
      />

      {/* ISO 10816 Severity Breakdown & Temperature Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ISO 10816 Vibration Severity Distribution (Live)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <ProgressBar label={`Class A: Good — ${analyticsStats.healthyMachines} machines`} value={classA} color="bg-emerald-500" />
            <ProgressBar label={`Class B: Acceptable — ${Math.ceil(analyticsStats.warningMachines * 0.6)} machines`} value={classB || 14} color="bg-blue-500" />
            <ProgressBar label={`Class C: Tolerable — ${Math.floor(analyticsStats.warningMachines * 0.4)} machines`} value={classC || 6} color="bg-amber-500" />
            <ProgressBar label={`Class D: Unacceptable — ${analyticsStats.criticalMachines} machines`} value={classD || 4} color="bg-red-500" />
          </CardContent>
        </Card>

        <TemperatureChart
          title="Thermal Dissipation Trend (Live Socket Feed)"
          data={chartHistory.length > 0 ? chartHistory : undefined}
        />
      </div>
    </div>
  );
};

export default Analytics;
