import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import ChartContainer from './ChartContainer';
import { mockVibrationData } from '../../data/mockData';

export const VibrationChart = ({ data = mockVibrationData, title = 'Tri-Axial Vibration Spectrum (mm/s)' }) => {
  return (
    <ChartContainer title={title} subtitle="X, Y, Z Axis Acceleration & Peak RMS Sensor Feeds">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-800)" vertical={false} />
          <XAxis dataKey="time" stroke="var(--color-slate-500)" fontSize={11} tickLine={false} />
          <YAxis stroke="var(--color-slate-500)" fontSize={11} tickLine={false} unit="mm/s" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-slate-900)',
              borderColor: 'var(--color-slate-800)',
              borderRadius: '0.75rem',
              color: 'var(--color-slate-100)',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="vibrationX" name="X-Axis" stroke="#3B82F6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="vibrationY" name="Y-Axis" stroke="#10B981" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="vibrationZ" name="Z-Axis" stroke="#F59E0B" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="peakRMS" name="Peak RMS Limit" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default VibrationChart;
