import React, { useEffect, useState } from 'react';
import { PieChart, Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import api from '../services/api';
import StateWrapper from '../components/ui/StateWrapper';

export const OeeDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOee = async () => {
    try {
      const res = await api.get('/oee');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('OEE Fetch Error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOee();
  }, []);

  return (
    <StateWrapper loading={loading} empty={!loading && !data} onRetry={fetchOee}>
      <div className="space-y-6">
        <div className="border-b border-[var(--border)] pb-5">
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <PieChart className="w-6 h-6 text-emerald-500" />
            <span>Overall Equipment Effectiveness (OEE)</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Global TPM performance metrics evaluating Availability, Performance, and Quality components.
          </p>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-[var(--bg-card)] border-[var(--border)]">
                <div className="flex items-center justify-between mb-3 text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  <span>Overall Plant OEE</span>
                  <PieChart className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold font-mono text-[var(--text-primary)]">{data.systemOee.overall}%</div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">World Class Target: 85.0%</p>
              </Card>

              <Card className="bg-[var(--bg-card)] border-[var(--border)]">
                <div className="flex items-center justify-between mb-3 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <span>Availability</span>
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-400">{data.systemOee.availability}%</div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Target: 90.0% (Operating / Planned)</p>
              </Card>

              <Card className="bg-[var(--bg-card)] border-[var(--border)]">
                <div className="flex items-center justify-between mb-3 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                  <span>Performance</span>
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold font-mono text-purple-400">{data.systemOee.performance}%</div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Target: 95.0% (Actual / Ideal Cycle)</p>
              </Card>

              <Card className="bg-[var(--bg-card)] border-[var(--border)]">
                <div className="flex items-center justify-between mb-3 text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  <span>Quality</span>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-3xl font-bold font-mono text-amber-400">{data.systemOee.quality}%</div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1">Target: 99.9% (Good / Total Parts)</p>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Asset Comparison Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[var(--bg-card)] border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Machine</th>
                        <th className="py-3 px-4 text-emerald-400">Availability</th>
                        <th className="py-3 px-4 text-purple-400">Performance</th>
                        <th className="py-3 px-4 text-amber-400">Quality</th>
                        <th className="py-3 px-4 font-bold text-[var(--text-primary)]">Overall OEE</th>
                        <th className="py-3 px-4 text-[var(--text-muted)]">Daily Trajectory</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-[var(--text-primary)] font-mono">
                      {data.fleetOee.map((m, i) => (
                        <tr key={i} className="hover:bg-[var(--bg-secondary)]">
                          <td className="py-3 px-4 font-bold text-blue-400 font-sans">{m.machineName} ({m.machineId})</td>
                          <td className="py-3 px-4">{m.availability}%</td>
                          <td className="py-3 px-4">{m.performance}%</td>
                          <td className="py-3 px-4">{m.quality}%</td>
                          <td className={`py-3 px-4 font-bold ${m.overall < 60 ? 'text-red-400' : 'text-emerald-400'}`}>{m.overall}%</td>
                          <td className="py-3 px-4">{m.daily}% vs {m.weekly}% Wk</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </StateWrapper>
  );
};

export default OeeDashboard;
