import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, Server, Bell, Save } from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export const Settings = () => {
  const [vibrationLimit, setVibrationLimit] = useState('6.5');
  const [temperatureLimit, setTemperatureLimit] = useState('75.0');
  const [mqttEndpoint, setMqttEndpoint] = useState('mqtt://edge-gateway.plant-a.internal:1883');

  const handleSave = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-[var(--border)] pb-5">
        <Breadcrumb />
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[var(--info)]" />
          <span>Platform & Alarm Threshold Settings</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Configure sensor sample rates, MQTT telemetry brokers, and ISO condition alarm boundaries.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Sensor Threshold Boundaries */}
        <Card>
          <CardHeader>
            <CardTitle>ISO 10816 Condition Alarm Boundaries</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="Global Vibration RMS Threshold (mm/s)"
              icon={Sliders}
              value={vibrationLimit}
              onChange={(e) => setVibrationLimit(e.target.value)}
              helperText="Values exceeding this threshold trigger Critical Level 1 Alarms."
            />
            <Input
              label="Global Thermal Envelope Boundary (°C)"
              icon={Sliders}
              value={temperatureLimit}
              onChange={(e) => setTemperatureLimit(e.target.value)}
              helperText="Continuous temperature limit before automatic thermal cutout warning."
            />
          </CardContent>
        </Card>

        {/* Industrial Communications Gateway */}
        <Card>
          <CardHeader>
            <CardTitle>IoT Sensor Gateway Communication (MQTT / OPC UA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <Input
              label="MQTT Telemetry Broker URI"
              icon={Server}
              value={mqttEndpoint}
              onChange={(e) => setMqttEndpoint(e.target.value)}
            />
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="tlsToggle"
                defaultChecked
                className="w-4 h-4 rounded bg-[var(--bg-card)] border-[var(--border)] text-[var(--info)] focus:ring-blue-500"
              />
              <label htmlFor="tlsToggle" className="text-[var(--text-secondary)] font-medium">
                Enforce MQTTS TLS v1.3 Encryption for Edge Devices
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" size="md" icon={Save} type="submit">
            Apply Platform Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
