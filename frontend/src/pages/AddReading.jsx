import React, { useState } from 'react';
import { Cpu, PlusCircle, Thermometer, Activity, Clock, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import api from '../services/api';

export const AddReading = () => {
  const [form, setForm] = useState({
    machine_id: 'MCH-101',
    vibration: '',
    temperature: '',
    recorded_at: new Date().toISOString().slice(0, 16),
    remarks: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseStatus(null);

    try {
      const res = await api.post('/readings', form);
      setResponseStatus({
        type: 'success',
        message: res.data.message || 'Reading registered successfully!',
        data: res.data.data,
      });
      setForm({
        machine_id: 'MCH-101',
        vibration: '',
        temperature: '',
        recorded_at: new Date().toISOString().slice(0, 16),
        remarks: '',
      });
    } catch (err) {
      setResponseStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to submit reading. Server-side validation rejected input.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <Breadcrumb />
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-500" />
          <span>Manual Machine Reading Registration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          SIH 2026 Practical Assessment Task 2: Submit raw telemetry logs with server-side validation and automated alert_flag calculation.
        </p>
      </div>

      {responseStatus && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
            responseStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {responseStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-semibold">{responseStatus.message}</p>
            {responseStatus.data && (
              <div className="font-mono text-[11px] text-slate-300 pt-1 space-y-1">
                <p>Reading ID: <span className="text-blue-400 font-bold">{responseStatus.data.reading_id}</span></p>
                <p>Calculated Alert Flag: <Badge variant={responseStatus.data.alert_flag === 'CRITICAL' ? 'danger' : responseStatus.data.alert_flag === 'WARNING' ? 'warning' : 'success'}>{responseStatus.data.alert_flag}</Badge></p>
              </div>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Telemetry Payload Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Machine ID *
              </label>
              <select
                name="machine_id"
                value={form.machine_id}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                required
              >
                <option value="MCH-101">CNC Milling Center Alpha (MCH-101)</option>
                <option value="MCH-102">High-Pressure Hydraulic Press (MCH-102)</option>
                <option value="MCH-103">Primary Cooling Tower Turbine (MCH-103)</option>
                <option value="MCH-104">Rotary Screw Compressor B (MCH-104)</option>
                <option value="MCH-105">Automated Robotic Arm 04 (MCH-105)</option>
                <option value="MCH-106">Heavy Duty Induction Motor (MCH-106)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Temperature (°C) *"
                icon={Thermometer}
                type="number"
                step="0.1"
                name="temperature"
                placeholder="e.g. 45.5"
                value={form.temperature}
                onChange={handleChange}
                helperText="Server bounds: -20 to 150 °C"
                required
              />

              <Input
                label="Tri-Axial Vibration (mm/s) *"
                icon={Activity}
                type="number"
                step="0.01"
                name="vibration"
                placeholder="e.g. 1.85"
                value={form.vibration}
                onChange={handleChange}
                helperText="Server bounds: 0 to 100 mm/s"
                required
              />
            </div>

            <Input
              label="Recorded Timestamp *"
              icon={Clock}
              type="datetime-local"
              name="recorded_at"
              value={form.recorded_at}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Engineer Field Remarks & Calibration Notes
              </label>
              <textarea
                name="remarks"
                rows="3"
                value={form.remarks}
                onChange={handleChange}
                placeholder="e.g. Manual thermal gun audit during shift change."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <Button variant="primary" size="md" type="submit" loading={loading}>
                Submit Reading to Backend
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddReading;