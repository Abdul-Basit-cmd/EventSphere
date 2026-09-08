import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

const defaultSparkline = [
  { v: 12 }, { v: 18 }, { v: 15 }, { v: 24 }, { v: 22 }, { v: 31 }, { v: 28 }, { v: 36 }
];

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null,
  trendPositive = true,
  sparklineData = null,
  showSparkline = true,
  breakdown = null,
  accentColor = 'var(--color-primary)',
  className = '',
}) => {
  const chartData = sparklineData && sparklineData.length > 0
    ? sparklineData.map((d, i) => (typeof d === 'number' ? { v: d } : d.v !== undefined ? d : { v: d.registrations || d.count || i }))
    : defaultSparkline;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(20, 26, 40, 0.8) 0%, rgba(17, 21, 32, 0.95) 100%)',
        borderColor: 'rgba(148, 163, 184, 0.12)',
      }}
      className={`group relative border rounded-2xl p-5 shadow-xs transition-all duration-300 card-lift overflow-hidden ${className}`}
    >
      {/* Top subtle highlight bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: accentColor,
              borderColor: 'rgba(59, 130, 246, 0.2)',
            }}
            className="p-2 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105"
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div>
          <div
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl font-extrabold tracking-tight text-white"
          >
            {value !== undefined && value !== null ? value : '—'}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs font-normal text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {trend && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
              trendPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {/* Mini Trend Sparkline */}
      {showSparkline && (
        <div className="mt-3 h-9 w-full opacity-60 group-hover:opacity-90 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#3B82F6"
                strokeWidth={1.75}
                fill={`url(#spark-${title.replace(/\s+/g, '')})`}
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {breakdown && breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">{item.label}:</span>
              <span className="font-semibold text-slate-200 text-xs">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatCard;
