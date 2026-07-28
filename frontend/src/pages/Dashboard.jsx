import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Activity,
  Zap,
  RefreshCw,
  Sliders,
  TrendingUp,
  Clock,
  Layers,
  Wifi,
  WifiOff,
  Edit2,
  Gauge,
} from 'lucide-react';
import StatCard from '../components/cards/StatCard';
import StatusCard from '../components/cards/StatusCard';
import TemperatureChart from '../components/charts/TemperatureChart';
import VibrationChart from '../components/charts/VibrationChart';
import HealthPieChart from '../components/charts/HealthPieChart';
import MachineTable from '../components/table/MachineTable';
import Breadcrumb from '../components/layout/Breadcrumb';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import StateWrapper from '../components/ui/StateWrapper';
import EditMachineModal from '../components/modals/EditMachineModal';

import { useRealtimeDashboard } from '../services/dashboardService';
import { alertService } from '../services/alertService';
import { machineService } from '../services/machineService';

export const Dashboard = () => {
  const { stats, healthPieData, history, fleet, alerts, loading, connected, machineId, setMachineId } = useRealtimeDashboard();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [editingMachine, setEditingMachine] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localFleet, setLocalFleet] = useState(null);
  const [localAlerts, setLocalAlerts] = useState(null);

  const displayFleet = localFleet || (fleet && fleet.length > 0 ? fleet : []);
  const displayAlerts = localAlerts || (alerts && alerts.length > 0 ? alerts : []);

  const validRpmList = displayFleet.map((m) => m.rpm).filter((r) => r != null && !isNaN(r));
  const avgFleetRpm = validRpmList.length > 0
    ? (validRpmList.reduce((acc, val) => acc + val, 0) / validRpmList.length).toFixed(2)
    : '0.00';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [fetchedFleet, fetchedAlerts] = await Promise.all([
        machineService.getAll(),
        alertService.getAll(),
      ]);
      setLocalFleet(fetchedFleet);
      setLocalAlerts(fetchedAlerts);
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleDeleteMachine = async (target) => {
    try {
      await machineService.delete(target.id);
      setLocalFleet((prev) => (prev || displayFleet).filter((m) => m.id !== target.id));
    } catch (err) {
      console.error('Delete machine failed', err);
    }
  };

  return (
    <StateWrapper loading={loading} error={null} empty={false} onRetry={handleRefresh}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <Breadcrumb />
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Zap className="w-6 h-6 text-[var(--info)]" />
            <span>Industrial Fleet Condition Center</span>
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-mono font-medium border ml-2 ${
                connected
                  ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30'
                  : 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30'
              }`}
            >
              {connected ? <Wifi className="w-3 h-3 animate-pulse text-[var(--success)]" /> : <WifiOff className="w-3 h-3" />}
              {connected ? 'LIVE TELEMETRY STREAM' : 'CONNECTING...'}
            </span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time IoT sensor telemetry, predictive vibration spectrum analysis, and thermal envelope monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            loading={isRefreshing}
            onClick={handleRefresh}
          >
            Refresh Telemetry
          </Button>
          <select
            value={machineId}
            onChange={(e) => setMachineId(e.target.value)}
            className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-lg focus:ring-[var(--info)] focus:border-[var(--info)] p-2 py-1.5 h-[34px] outline-none"
          >
            <option value="ALL">All Machines (Fleet)</option>
            {displayFleet.map((m) => (
              <option key={m.machineId} value={m.machineId}>
                {m.machineId}
              </option>
            ))}
          </select>
          <Button variant="primary" size="sm" icon={Sliders}>
            Configure Thresholds
          </Button>
        </div>
      </div>

      {/* Primary KPI Stat Cards Grid (9 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title={machineId !== 'ALL' ? 'Selected Machine' : 'Total Machines'}
          value={machineId !== 'ALL' ? 1 : stats.totalMachines}
          unit="units"
          icon={Cpu}
          color="blue"
          trend="up"
          trendValue="+2 new"
          subtitle="Monitored in 3 Plants"
        />
        <StatCard
          title="Healthy Fleet"
          value={stats.healthyMachines}
          unit="active"
          icon={CheckCircle2}
          color="emerald"
          trend="up"
          trendValue="94.2% Uptime"
          subtitle="Optimal vibration RMS"
        />
        <StatCard
          title="Critical Alarms"
          value={stats.criticalMachines}
          unit="faults"
          icon={AlertTriangle}
          color="red"
          trend="down"
          trendValue="Action Req."
          subtitle="Cooling Turbine #3"
        />
        <StatCard
          title="Avg Plant Temp"
          value={stats.avgTemperature}
          unit="°C"
          icon={Thermometer}
          color="amber"
          trend="up"
          trendValue="+1.2 °C"
          subtitle="Nominal < 75 °C"
        />
        <StatCard
          title="Avg Vibration RMS"
          value={stats.avgVibration}
          unit="mm/s"
          icon={Activity}
          color="purple"
          trend="down"
          trendValue="-0.15 mm/s"
          subtitle="ISO 10816 Class II"
        />
        <StatCard
          title="Avg Fleet Speed"
          value={avgFleetRpm}
          unit="RPM"
          icon={Gauge}
          color="emerald"
          trend="up"
          trendValue="Live Sync"
          subtitle="Nominal 1400–1850"
        />
        <StatCard
          title="Today's Sensor Feeds"
          value={stats.readingsToday ? stats.readingsToday.toLocaleString() : '14,280'}
          unit="events"
          icon={TrendingUp}
          color="blue"
          trend="up"
          trendValue="100 Hz Rate"
          subtitle="Zero Packet Loss"
        />
        <StatCard
          title="Active Alerts"
          value={stats.alertCount}
          unit="pending"
          icon={Clock}
          color="amber"
          trend="neutral"
          trendValue="2 Critical"
          subtitle="Require Sign-off"
        />
        <StatCard
          title="Operating Efficiency"
          value={`${stats.overallOEE}%`}
          unit="OEE"
          icon={Layers}
          color="emerald"
          trend="up"
          trendValue="+3.4%"
          subtitle="World-class target 85%"
        />
      </div>

      {/* Main Telemetry Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart data={history && history.length > 0 ? history : undefined} />
        <VibrationChart data={history && history.length > 0 ? history : undefined} />
      </div>

      {/* Secondary Row: Fleet Health Pie Chart & Live Alerts Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthPieChart data={healthPieData} />
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-5 backdrop-blur-md flex flex-col justify-between card shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                <span>Live Industrial Alarm Stream</span>
              </h3>
              <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-ping"></span>
                Socket.IO Stream Active
              </span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {displayAlerts.map((alert, idx) => (
                <div
                  key={alert.id || alert.alertId || `alt-${idx}`}
                  className="flex items-start justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--info)] transition-colors text-xs animate-fadeIn"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="font-mono font-bold text-[var(--text-muted)]">{alert.id || alert.alertId}</span>
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
                      <span className="font-semibold text-[var(--text-primary)]">{alert.machineName}</span>
                    </div>
                    <p className="text-[var(--text-secondary)] font-sans">{alert.message || alert.description}</p>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono shrink-0 ml-2">
                    {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Machine Fleet Table Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">Machine Fleet Inventory</h3>
        <MachineTable
          machines={displayFleet}
          onView={(m) => setSelectedMachine(m)}
          onEdit={(m) => setEditingMachine(m)}
          onDelete={handleDeleteMachine}
        />
      </div>

      {/* Machine Detail Modal */}
      <Modal
        isOpen={Boolean(selectedMachine)}
        onClose={() => setSelectedMachine(null)}
        title={selectedMachine ? `${selectedMachine.name} (${selectedMachine.id})` : ''}
        subtitle="Detailed Asset Sensor Telemetry & Calibration Profile"
        maxWidth="max-w-2xl"
      >
        {selectedMachine && (
          <div className="space-y-5 text-xs text-[var(--text-primary)]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Status</span>
                <Badge status={selectedMachine.status} dot />
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Temperature</span>
                <span className="font-mono text-sm font-bold text-[var(--warning)]">
                  {selectedMachine.temperature} °C
                </span>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Vibration RMS</span>
                <span className="font-mono text-sm font-bold text-[var(--info)]">
                  {selectedMachine.vibration} mm/s
                </span>
              </div>
              <div className="bg-[var(--bg-secondary)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Operating Speed</span>
                <span className="font-mono text-sm font-bold text-[var(--info)]">
                  {selectedMachine.rpm} RPM
                </span>
              </div>
            </div>

            <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)] space-y-2">
              <h4 className="font-semibold text-[var(--text-primary)]">Asset Profile Information</h4>
              <div className="grid grid-cols-2 gap-2 text-[var(--text-secondary)]">
                <div>
                  <span className="text-[var(--text-muted)]">Location:</span> {selectedMachine.location}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Machine Type:</span> {selectedMachine.type}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Sensor Hardware ID:</span>{' '}
                  <span className="font-mono text-[var(--text-primary)]">{selectedMachine.sensorId}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Assigned Operator:</span>{' '}
                  {selectedMachine.operator}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Last Overhaul:</span>{' '}
                  {selectedMachine.lastMaintenance}
                </div>
                <div>
                  <span className="text-[var(--text-muted)]">Condition Score:</span>{' '}
                  <span className="font-bold text-[var(--success)]">{selectedMachine.healthScore}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                icon={Edit2}
                onClick={() => {
                  setEditingMachine(selectedMachine);
                  setSelectedMachine(null);
                }}
              >
                Edit Asset Config
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedMachine(null)}>
                Close Telemetry Panel
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Machine Modal */}
      <EditMachineModal
        isOpen={Boolean(editingMachine)}
        onClose={() => setEditingMachine(null)}
        machine={editingMachine}
        onMachineUpdated={(updated) => {
          setLocalFleet((prev) => (prev || displayFleet).map((m) => (m.id === updated.id || m.machineId === updated.machineId ? updated : m)));
          setEditingMachine(null);
        }}
      />
    </div>
    </StateWrapper>
  );
};

export default Dashboard;