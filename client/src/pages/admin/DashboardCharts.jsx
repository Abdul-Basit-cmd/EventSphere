import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const DashboardCharts = ({ registrationTrends = [] }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="border rounded-[10px] p-6 shadow-xs card-lift"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ color: 'var(--color-text)' }} className="text-sm font-semibold">
            Registration Trends
          </h3>
        </div>
        <span style={{ color: 'var(--color-text-dim)' }} className="text-xs">
          Cumulative sign-ups over time
        </span>
      </div>

      {registrationTrends.length > 0 ? (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-text-dim)"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="var(--color-text-dim)"
                fontSize={11}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface-alt)',
                  borderColor: 'var(--color-border)',
                  borderRadius: '8px',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="registrations"
                name="Registrations"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-primary)' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ color: 'var(--color-text-dim)' }} className="py-12 text-center text-xs">
          No registration trend activity recorded yet.
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
