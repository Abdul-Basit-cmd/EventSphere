import React, { useState } from 'react';
import { TrendingUp, Activity, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl text-xs">
        <p className="text-slate-400 font-medium mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-slate-200">Registrations:</span>
          <span className="font-bold text-white text-sm">
            {payload[0].value}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ registrationTrends = [] }) => {
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar'

  const formattedData = registrationTrends.map((item) => ({
    ...item,
    formattedDate: item.date
      ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : item.date,
  }));

  const totalSignups = registrationTrends.reduce((acc, curr) => acc + (curr.registrations || 0), 0);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.7) 0%, rgba(17, 21, 32, 0.95) 100%)',
        borderColor: 'rgba(148, 163, 184, 0.12)',
      }}
      className="border rounded-2xl p-6 shadow-xs card-lift"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Registration Velocity & Growth
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Timeline of cumulative participant sign-ups across this expo
          </p>
        </div>

        <div className="flex items-center gap-3">
          {registrationTrends.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50 text-xs">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-400">Total:</span>
              <span className="font-semibold text-white">{totalSignups}</span>
            </div>
          )}

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Area
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                chartType === 'bar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {formattedData.length > 0 ? (
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={formattedData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148,163,184,0.12)' }}
                  dy={8}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148,163,184,0.12)' }}
                  allowDecimals={false}
                  dx={-4}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  name="Registrations"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRegistrations)"
                  dot={{ r: 3, fill: '#3B82F6', stroke: '#0B0E14', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#60A5FA', stroke: '#1E293B', strokeWidth: 2 }}
                />
              </AreaChart>
            ) : (
              <BarChart data={formattedData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.07)" vertical={false} />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148,163,184,0.12)' }}
                  dy={8}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(148,163,184,0.12)' }}
                  allowDecimals={false}
                  dx={-4}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="registrations"
                  fill="#3B82F6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/40">
          No registration trend activity recorded yet for this event.
        </div>
      )}
    </div>
  );
};

export default DashboardCharts;
