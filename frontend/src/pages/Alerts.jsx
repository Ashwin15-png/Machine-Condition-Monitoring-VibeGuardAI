import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Filter, Check } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { alertService } from '../services/alertService';
import socket from '../services/socket';

export const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;

    // Initial fetch from REST API
    alertService.getAll().then((data) => {
      if (isMounted && data) {
        setAlerts(data);
      }
    }).catch(console.error);

    // Socket listener for new live alerts emitted by anomaly engine
    const onAlertNew = (newAlert) => {
      if (!isMounted) return;
      setAlerts((prev) => {
        const id = newAlert.alertId || newAlert.id;
        if (prev.some((a) => (a.id || a.alertId) === id)) return prev;
        const normalized = {
          id,
          machineId: newAlert.machineId,
          machineName: newAlert.machineName,
          severity: newAlert.severity,
          message: newAlert.description || newAlert.message,
          timestamp: newAlert.timestamp || new Date().toISOString(),
          status: newAlert.status || 'Active',
          acknowledgedBy: newAlert.acknowledgedBy || null,
        };
        return [normalized, ...prev];
      });
    };

    socket.on('alert:new', onAlertNew);
    return () => {
      isMounted = false;
      socket.off('alert:new', onAlertNew);
    };
  }, []);

  const handleAcknowledge = async (id) => {
    try {
      await alertService.acknowledge(id, 'Current Operator');
      setAlerts((prev) =>
        prev.map((a) =>
          (a.id || a.alertId) === id
            ? { ...a, status: 'Acknowledged', acknowledgedBy: 'Current Operator' }
            : a
        )
      );
    } catch (err) {
      console.error('Failed to acknowledge alert', err);
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertService.resolve(id);
      setAlerts((prev) =>
        prev.map((a) => ((a.id || a.alertId) === id ? { ...a, status: 'Resolved' } : a))
      );
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return (a.severity || '').toUpperCase() === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>Industrial Alarm & Exception Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active threshold violations, thermal envelope breaches, and operator sign-offs.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setSeverityFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              severityFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setSeverityFilter('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              severityFilter === 'CRITICAL'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setSeverityFilter('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              severityFilter === 'WARNING'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Warning
          </button>
        </div>
      </div>

      {/* Alarm List Cards */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => {
          const alertIdStr = alert.id || alert.alertId || `alt-${index}`;
          return (
            <Card
              key={alertIdStr}
              className={`border-l-4 ${
                alert.severity === 'Critical'
                  ? 'border-l-red-500'
                  : alert.severity === 'Warning'
                  ? 'border-l-amber-500'
                  : 'border-l-blue-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-400">{alertIdStr}</span>
                    <Badge
                      variant={
                        alert.severity === 'Critical'
                          ? 'danger'
                          : alert.severity === 'Warning'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <span className="font-bold text-slate-100 text-sm">{alert.machineName}</span>
                    <span className="text-slate-500 font-mono">({alert.machineId})</span>
                  </div>
                  <p className="text-slate-300">{alert.message || alert.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>
                      Timestamp:{' '}
                      {alert.timestamp
                        ? new Date(alert.timestamp).toLocaleString()
                        : 'Real-time'}
                    </span>
                    {alert.acknowledgedBy && (
                      <span className="text-emerald-400">
                        Ack by: {alert.acknowledgedBy}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === 'Active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(alertIdStr)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {alert.status !== 'Resolved' && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={Check}
                      onClick={() => handleResolve(alertIdStr)}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  {alert.status === 'Resolved' && (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                      Resolved & Closed
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Alerts;

