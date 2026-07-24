import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import ChartContainer from './ChartContainer';
import { mockTemperatureData } from '../../data/mockData';

export const TemperatureChart = ({ data = mockTemperatureData, title = 'Thermal Profile Trend (°C)' }) => {
  return (
    <ChartContainer title={title} subtitle="24-Hour Temperature Monitoring & Alert Threshold">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAvgTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-800)" vertical={false} />
          <XAxis dataKey="time" stroke="var(--color-slate-500)" fontSize={11} tickLine={false} />
          <YAxis stroke="var(--color-slate-500)" fontSize={11} tickLine={false} unit="°C" />
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
          <Area
            type="monotone"
            dataKey="avgTemp"
            name="Avg Temperature"
            stroke="#2563EB"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorAvgTemp)"
          />
          <Area
            type="monotone"
            dataKey="maxTemp"
            name="Peak Temperature"
            stroke="#EF4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorMaxTemp)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default TemperatureChart;
