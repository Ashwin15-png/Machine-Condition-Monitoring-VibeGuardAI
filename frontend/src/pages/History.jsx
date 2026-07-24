import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Download, RefreshCw } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';
import socket from '../services/socket';

export const History = () => {
  const [selectedMachine, setSelectedMachine] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('2026-07-01');
  const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial readings from REST API and seed
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.get('/readings', { params: { limit: 50, sort: 'date_desc' } })
      .then((res) => {
        if (isMounted && res.data.success) {
          const mapped = res.data.data.map((r) => ({
            id: r.reading_id || 'LOG-???',
            timestamp: r.recorded_at ? new Date(r.recorded_at).toLocaleString() : 'N/A',
            machineId: r.machine_id,
            machineName: r.machine_id,
            metric: r.alert_flag === 'NORMAL' ? 'Routine Telemetry Sample' : `Sensor Anomaly (${r.alert_flag})`,
            val: `T: ${r.temperature ?? 'N/A'} °C | V: ${r.vibration ?? 'N/A'} mm/s`,
            status: r.alert_flag === 'NORMAL' || r.alert_flag === 'WARNING'
              ? r.alert_flag === 'NORMAL' ? 'Normal' : 'Warning'
              : r.alert_flag === 'CRITICAL' ? 'Exceeded' : 'Degraded',
          }));
          setHistoryLogs(mapped);
        }
      })
      .catch(() => {
        if (isMounted) setHistoryLogs([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Live reading updates
    const onReadingNew = (r) => {
      if (!isMounted) return;
      setHistoryLogs((prev) => [
        {
          id: r.reading_id || `LOG-${Date.now()}`,
          timestamp: r.recorded_at ? new Date(r.recorded_at).toLocaleString() : 'Just now',
          machineId: r.machine_id,
          machineName: r.machine_id,
          metric: r.alert_flag === 'NORMAL' ? 'Routine Telemetry Sample' : `Sensor Anomaly (${r.alert_flag})`,
          val: `T: ${r.temperature ?? 'N/A'} °C | V: ${r.vibration ?? 'N/A'} mm/s`,
          status: r.alert_flag === 'NORMAL' ? 'Normal' : r.alert_flag === 'CRITICAL' ? 'Exceeded' : 'Degraded',
        },
        ...prev,
      ].slice(0, 100));
    };

    socket.on('reading:new', onReadingNew);
    return () => {
      isMounted = false;
      socket.off('reading:new', onReadingNew);
    };
  }, []);

  const filtered = historyLogs.filter(
    (log) => selectedMachine === 'ALL' || log.machineId === selectedMachine
  );

    const [exporting, setExporting] = useState(false);

    const showToast = (msg, isError = false) => {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-sm font-bold shadow-xl transition-opacity z-50 ${isError ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`;
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    };

    const handleExportCSV = async () => {
        setExporting(true);
        try {
            const res = await api.get('/history/export/csv', { responseType: 'blob' });
            const filename = `History_Log_${new Date().toISOString().slice(0,10).replace(/-/g,'')}.csv`;
            const blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('History log exported successfully');
        } catch (err) {
            showToast('Unable to generate report. Please try again.', true);
        } finally {
            setExporting(false);
        }
    };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-blue-500" />
            <span>Historical Telemetry Log Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live-linked audit log of all machine condition readings. Updates in real-time via Socket.IO.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={exporting ? RefreshCw : Download} onClick={handleExportCSV} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export CSV Log Data'}
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <Card className="flex flex-col sm:flex-row items-end gap-4">
        <div className="w-full sm:w-48">
          <Input type="date" label="From Date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="w-full sm:w-48">
          <Input type="date" label="To Date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <div className="w-full sm:w-64">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Select Asset</label>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="ALL">All Machines</option>
            <option value="MCH-101">CNC Milling Center Alpha</option>
            <option value="MCH-102">High-Pressure Hydraulic Press</option>
            <option value="MCH-103">Primary Cooling Tower Turbine</option>
            <option value="MCH-104">Rotary Screw Compressor B</option>
            <option value="MCH-105">Automated Robotic Arm 04</option>
            <option value="MCH-106">Heavy Duty Induction Motor</option>
          </select>
        </div>
        <div className="text-xs text-slate-400 font-mono pt-5 shrink-0">
          {loading ? 'Loading...' : `${filtered.length} records`}
        </div>
      </Card>

      {/* Telemetry Log Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-xs gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading telemetry history...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-500 text-xs">
            No logs found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Reading ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Machine ID</th>
                  <th className="py-3 px-4">Recorded Metric</th>
                  <th className="py-3 px-4 text-right">Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors font-medium">
                    <td className="py-3 px-4 font-mono text-blue-400">{log.id}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{log.timestamp}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{log.machineId}</td>
                    <td className="py-3 px-4">{log.metric}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold">{log.val}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                        log.status === 'Normal'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : log.status === 'Warning'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;