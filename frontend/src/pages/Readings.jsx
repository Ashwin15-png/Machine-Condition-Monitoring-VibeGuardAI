import React, { useState, useEffect } from 'react';
import { Database, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Plus, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import api from '../services/api';
import socket from '../services/socket';
import StateWrapper from '../components/ui/StateWrapper';

export const Readings = () => {
  const [readings, setReadings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/readings', {
        params: {
          search: searchTerm,
          machine: selectedMachine,
          alert: selectedAlert,
          sort: sortBy,
          startDate,
          endDate,
          page,
          limit: 15,
        },
      });
      if (res.data.success) {
        setReadings(res.data.data);
        setTotalCount(res.data.count);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch readings list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [page, selectedMachine, selectedAlert, sortBy, startDate, endDate]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    let isMounted = true;
    const onReadingNew = (newReading) => {
      if (!isMounted) return;
      setReadings((prev) => [newReading, ...prev.slice(0, 14)]);
      setTotalCount((prev) => prev + 1);
    };

    socket.on('reading:new', onReadingNew);
    return () => {
      isMounted = false;
      socket.off('reading:new', onReadingNew);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReadings();
  };

  const getAlertBadge = (flag) => {
    switch (flag) {
      case 'CRITICAL':
        return <Badge variant="danger">CRITICAL</Badge>;
      case 'WARNING':
        return <Badge variant="warning">WARNING</Badge>;
      case 'FAULTY':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">FAULTY</span>;
      case 'MISSING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-slate-400 border border-slate-700">MISSING</span>;
      case 'STUCK':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">STUCK</span>;
      case 'NORMAL':
      default:
        return <Badge variant="success">NORMAL</Badge>;
    }
  };

  const [exportingType, setExportingType] = useState(null);

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

  const handleExport = async (type) => {
    setExportingType(type);
    try {
      const endpoint = {
        'csv': '/reports/csv',
        'excel': '/reports/excel',
        'pdf': '/reports/pdf',
        'json': '/reports/json'
      }[type];
      
      const res = await api.get(endpoint, { responseType: 'blob' });
      
      // Attempt generic extraction of filename if header passed, otherwise fallback to Date
      let filename = `Machine_Condition_Report_${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;
      if (type === 'excel') filename += '.xlsx';
      else filename += `.${type}`;

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast(`${type.toUpperCase()} downloaded successfully`);
    } catch (err) {
      showToast('Unable to generate report. Please try again.', true);
    } finally {
      setExportingType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-500" />
            <span>Machine Condition Readings Vault</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            SIH 2026 Practical Assessment Task 3: Comprehensive list of machine readings with search, priority ordering, and live telemetry updates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" icon={exportingType === 'csv' ? RefreshCw : Download} onClick={() => handleExport('csv')} disabled={exportingType !== null}>
            {exportingType === 'csv' ? 'Exporting...' : 'CSV'}
          </Button>
          <Button variant="outline" size="sm" icon={exportingType === 'excel' ? RefreshCw : Download} onClick={() => handleExport('excel')} disabled={exportingType !== null}>
            {exportingType === 'excel' ? 'Exporting...' : 'Excel'}
          </Button>
          <Button variant="outline" size="sm" icon={exportingType === 'pdf' ? RefreshCw : Download} onClick={() => handleExport('pdf')} disabled={exportingType !== null}>
            {exportingType === 'pdf' ? 'Exporting...' : 'PDF'}
          </Button>
          <Button variant="outline" size="sm" icon={exportingType === 'json' ? RefreshCw : Download} onClick={() => handleExport('json')} disabled={exportingType !== null}>
            {exportingType === 'json' ? 'Exporting...' : 'JSON'}
          </Button>
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={fetchReadings} loading={loading}>
            Refresh
          </Button>
          <Link to="/readings/new">
            <Button variant="primary" size="sm" icon={Plus}>
              Add Reading
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <Input
            icon={Search}
            placeholder="Search ID, Machine, Remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Machine Asset
            </label>
            <select
              value={selectedMachine}
              onChange={(e) => { setSelectedMachine(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="ALL">All Machines</option>
              <option value="MCH-101">CNC Milling Center Alpha (MCH-101)</option>
              <option value="MCH-102">High-Pressure Hydraulic Press (MCH-102)</option>
              <option value="MCH-103">Primary Cooling Tower Turbine (MCH-103)</option>
              <option value="MCH-104">Rotary Screw Compressor B (MCH-104)</option>
              <option value="MCH-105">Automated Robotic Arm 04 (MCH-105)</option>
              <option value="MCH-106">Heavy Duty Induction Motor (MCH-106)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Alert Flag Priority
            </label>
            <select
              value={selectedAlert}
              onChange={(e) => { setSelectedAlert(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="NORMAL">Normal</option>
              <option value="FAULTY">Faulty</option>
              <option value="MISSING">Missing</option>
              <option value="STUCK">Stuck</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="priority">Priority (Critical First)</option>
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="temp_desc">Temperature (Highest)</option>
              <option value="temp_asc">Temperature (Lowest)</option>
              <option value="vib_desc">Vibration (Highest)</option>
              <option value="health_asc">Health Score (Lowest)</option>
              <option value="health_desc">Health Score (Highest)</option>
            </select>
          </div>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          <span>Showing <strong className="text-slate-200">{readings.length}</strong> of <strong className="text-slate-200">{totalCount}</strong> recorded condition logs</span>
          <span className="font-mono text-[11px] text-blue-400">Page {page} of {totalPages}</span>
        </div>
      </Card>

      <StateWrapper
        loading={loading && readings.length === 0}
        error={null}
        empty={!loading && readings.length === 0}
        emptyMessage="No machine telemetry logs match your current advanced filtering parameters."
        onRetry={fetchReadings}
      >
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Reading ID</th>
                  <th className="py-3 px-4">Machine ID</th>
                  <th className="py-3 px-4 text-right">Temperature (°C)</th>
                  <th className="py-3 px-4 text-right">Vibration (mm/s)</th>
                  <th className="py-3 px-4 text-center">Alert Flag</th>
                  <th className="py-3 px-4">Recorded At</th>
                  <th className="py-3 px-4">Field Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {readings.map((r, idx) => {
                  const isAbnormal = r.alert_flag === 'CRITICAL' || r.alert_flag === 'WARNING' || r.alert_flag === 'FAULTY';
                  return (
                    <tr
                      key={r.reading_id || `rdg-${idx}`}
                      className={`hover:bg-slate-800/40 transition-colors font-medium ${
                        isAbnormal ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-blue-400">{r.reading_id}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{r.machine_id}</td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${
                        r.temperature > 78 ? 'text-red-400' : r.temperature > 70 ? 'text-amber-400' : r.temperature === null ? 'text-slate-500' : 'text-slate-200'
                      }`}>
                        {r.temperature !== null && r.temperature !== undefined ? `${r.temperature} °C` : <span className="italic text-slate-500">NULL</span>}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${
                        r.vibration > 6.5 ? 'text-red-400' : r.vibration > 4.5 ? 'text-amber-400' : r.vibration === null ? 'text-slate-500' : 'text-slate-200'
                      }`}>
                        {r.vibration !== null && r.vibration !== undefined ? `${r.vibration} mm/s` : <span className="italic text-slate-500">NULL</span>}
                      </td>
                      <td className="py-3 px-4 text-center">{getAlertBadge(r.alert_flag)}</td>
                      <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                        {r.recorded_at ? new Date(r.recorded_at).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-xs">{r.remarks || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 border-t border-slate-800/80">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-400 font-mono">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </Card>
      </StateWrapper>
    </div>
  );
};

export default Readings;
