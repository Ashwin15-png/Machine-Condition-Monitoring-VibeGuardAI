import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { machineService } from '../../services/machineService';
import socket from '../../services/socket';
import { Save, AlertTriangle, CheckCircle2, Sliders, Activity } from 'lucide-react';

export const EditMachineModal = ({ isOpen, onClose, machine, onMachineUpdated }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    type: '',
    status: 'Healthy',
    temperature: '',
    vibration: '',
    rpm: '',
    power: '',
    healthScore: '',
    lastMaintenance: '',
    nextMaintenance: '',
    operator: '',
    sensorId: '',
    pressure: '',
    voltage: '',
    current: '',
    notes: '',
  });

  const [alertCounters, setAlertCounters] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (machine) {
      setFormData({
        id: machine.id || machine.machineId || '',
        name: machine.name || '',
        location: machine.location || '',
        type: machine.type || 'Hydraulic Press',
        status: machine.status || 'Healthy',
        temperature: machine.temperature !== undefined ? machine.temperature : '',
        vibration: machine.vibration !== undefined ? machine.vibration : '',
        rpm: machine.rpm !== undefined ? machine.rpm : 1750,
        power: machine.power !== undefined ? machine.power : 5.5,
        healthScore: machine.healthScore !== undefined ? machine.healthScore : '',
        lastMaintenance: machine.lastMaintenance || '',
        nextMaintenance: machine.nextMaintenance || '',
        operator: machine.operator || '',
        sensorId: machine.sensorId || '',
        pressure: machine.pressure || 4.5,
        voltage: machine.voltage || 415,
        current: machine.current || 12,
        notes: machine.notes || '',
      });
      setErrors({});
      setToastMessage(null);
      setAlertCounters(null);
    }
  }, [machine, isOpen]);

  useEffect(() => {
    const handleCounterUpdate = (data) => {
      if (machine && (data.machineId === machine.id || data.machineId === machine.machineId)) {
        setAlertCounters(data.alertCounters);
      }
    };
    socket.on('alert:counter', handleCounterUpdate);
    return () => {
      socket.off('alert:counter', handleCounterUpdate);
    };
  }, [machine]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Asset Name is required';
    if (!formData.location.trim()) errs.location = 'Location is required';

    const temp = Number(formData.temperature);
    if (formData.temperature !== '' && (isNaN(temp) || temp < 0 || temp > 150)) {
      errs.temperature = 'Temperature must be between 0°C and 150°C';
    }

    const vib = Number(formData.vibration);
    if (formData.vibration !== '' && (isNaN(vib) || vib < 0 || vib > 20)) {
      errs.vibration = 'Vibration RMS must be between 0 and 20 mm/s';
    }

    const rpmVal = Number(formData.rpm);
    if (formData.rpm !== '' && (isNaN(rpmVal) || rpmVal < 0 || rpmVal > 10000)) {
      errs.rpm = 'RPM must be between 0 and 10,000 RPM';
    }

    const powerVal = Number(formData.power);
    if (formData.power !== '' && (isNaN(powerVal) || powerVal < 0 || powerVal > 500)) {
      errs.power = 'Load / Power must be between 0 and 500 kW';
    }

    const health = Number(formData.healthScore);
    if (formData.healthScore !== '' && (isNaN(health) || health < 0 || health > 100)) {
      errs.healthScore = 'Health Index must be between 0% and 100%';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const updated = await machineService.update(formData.id, {
        ...formData,
        temperature: formData.temperature !== '' ? Number(formData.temperature) : undefined,
        vibration: formData.vibration !== '' ? Number(formData.vibration) : undefined,
        rpm: formData.rpm !== '' ? Number(formData.rpm) : undefined,
        power: formData.power !== '' ? Number(formData.power) : undefined,
        healthScore: formData.healthScore !== '' ? Number(formData.healthScore) : undefined,
      });

      if (updated.alertCounters) {
        setAlertCounters(updated.alertCounters);
      }

      setToastMessage('Machine telemetry updated! Consecutive reading evaluated.');
      if (onMachineUpdated) {
        onMachineUpdated(updated);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Failed to update machine configuration.';
      setErrors({ api: msg });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={machine ? `Edit Machine Telemetry — ${machine.name} (${machine.id || machine.machineId})` : 'Edit Machine'}
      subtitle="Modify physical IoT sensor telemetry values, rotational speed, load, and operational status."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {toastMessage && (
          <div className="p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)] font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {errors.api && (
          <div className="p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{errors.api}</span>
          </div>
        )}

        {/* Consecutive Readings Alert Counter Verification Panel */}
        {alertCounters && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--info)]/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--info)] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Activity className="w-3.5 h-3.5 text-[var(--info)]" />
                <span>Consecutive Alert Counter (Verification Mode)</span>
              </span>
              <span className="font-mono text-[11px] text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-[var(--border)] font-semibold">
                Required Target: <strong className="text-[var(--info)]">{alertCounters.threshold || 3}</strong> Readings
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-center">
                <span className="text-[var(--text-muted)] text-[10px] block font-semibold">Temp Counter</span>
                <span className={`font-mono font-bold text-sm ${alertCounters.temperature >= alertCounters.threshold ? 'text-[var(--danger)]' : alertCounters.temperature > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                  {alertCounters.temperature} / {alertCounters.threshold || 3}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-center">
                <span className="text-[var(--text-muted)] text-[10px] block font-semibold">Vibration Counter</span>
                <span className={`font-mono font-bold text-sm ${alertCounters.vibration >= alertCounters.threshold ? 'text-[var(--danger)]' : alertCounters.vibration > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                  {alertCounters.vibration} / {alertCounters.threshold || 3}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-center">
                <span className="text-[var(--text-muted)] text-[10px] block font-semibold">Speed Counter</span>
                <span className={`font-mono font-bold text-sm ${alertCounters.rpm >= alertCounters.threshold ? 'text-[var(--danger)]' : alertCounters.rpm > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                  {alertCounters.rpm} / {alertCounters.threshold || 3}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-center">
                <span className="text-[var(--text-muted)] text-[10px] block font-semibold">Load Counter</span>
                <span className={`font-mono font-bold text-sm ${alertCounters.load >= alertCounters.threshold ? 'text-[var(--danger)]' : alertCounters.load > 0 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                  {alertCounters.load} / {alertCounters.threshold || 3}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Asset Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Machine Asset ID (Read-only)"
            value={formData.id}
            disabled
            className="opacity-70 font-mono"
          />

          <div>
            <Input
              label="Asset Name *"
              placeholder="e.g. Servo Driven Stamping Press"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            {errors.name && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.name}</p>}
          </div>

          <div>
            <Input
              label="Plant Location *"
              placeholder="e.g. Plant Alpha — Line 02"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            {errors.location && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.location}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--text-secondary)]">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--info)]/50 cursor-pointer font-medium h-[38px]"
            >
              <option value="Healthy">Healthy (Optimal)</option>
              <option value="Warning">Warning (Caution)</option>
              <option value="Critical">Critical (Immediate Fault)</option>
              <option value="Offline">Offline (Decommissioned)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Live Telemetry & Vitals */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] space-y-3">
          <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 text-xs uppercase tracking-wider text-[var(--info)]">
            <Sliders className="w-3.5 h-3.5 text-[var(--info)]" />
            <span>Live Telemetry & Vitals Parameters</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Rotational Speed (RPM)"
                type="number"
                step="1"
                placeholder="0 – 10,000 RPM"
                value={formData.rpm}
                onChange={(e) => setFormData({ ...formData, rpm: e.target.value })}
              />
              {errors.rpm && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.rpm}</p>}
            </div>

            <div>
              <Input
                label="Temperature (°C)"
                type="number"
                step="0.1"
                placeholder="0 – 150 °C"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
              {errors.temperature && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.temperature}</p>}
            </div>

            <div>
              <Input
                label="Vibration RMS (mm/s)"
                type="number"
                step="0.01"
                placeholder="0 – 20 mm/s"
                value={formData.vibration}
                onChange={(e) => setFormData({ ...formData, vibration: e.target.value })}
              />
              {errors.vibration && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.vibration}</p>}
            </div>

            <div>
              <Input
                label="Electrical Load / Power (kW)"
                type="number"
                step="0.1"
                placeholder="0 – 500 kW"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
              />
              {errors.power && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.power}</p>}
            </div>

            <div>
              <Input
                label="Health Index Rating (0–100%)"
                type="number"
                placeholder="0 – 100 %"
                value={formData.healthScore}
                onChange={(e) => setFormData({ ...formData, healthScore: e.target.value })}
              />
              {errors.healthScore && <p className="text-[11px] text-[var(--danger)] mt-1">{errors.healthScore}</p>}
            </div>

            <Input
              label="Sensor Serial Number"
              placeholder="e.g. SN-SENS-8801"
              value={formData.sensorId}
              onChange={(e) => setFormData({ ...formData, sensorId: e.target.value })}
            />
          </div>
        </div>

        {/* Section 3: Operator & Maintenance Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Assigned Operator"
            placeholder="e.g. Marcus Vance"
            value={formData.operator}
            onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
          />

          <Input
            label="Last Maintenance Date"
            type="date"
            value={formData.lastMaintenance}
            onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)] block mb-1">
            Engineering Remarks & Calibration Notes
          </label>
          <textarea
            rows="2"
            placeholder="Enter technical observations, vibration threshold adjustments, or overhaul notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-3 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--info)]/40 focus:border-[var(--info)]/60 transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading} icon={Save}>
            Save Machine Telemetry
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditMachineModal;

