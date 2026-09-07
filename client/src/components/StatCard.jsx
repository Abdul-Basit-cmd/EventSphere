import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  breakdown = null,
  className = '',
}) => {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderTop: '2px solid var(--color-primary)',
      }}
      className={`border rounded-xl p-5 shadow-xs transition-all card-lift ${className}`}
    >
      <div className="flex items-center justify-between">
        <span
          style={{ color: 'var(--color-text-muted)' }}
          className="text-xs font-semibold uppercase tracking-wider"
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              background: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
            }}
            className="p-2 rounded-lg"
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div
          style={{
            color: 'var(--color-text)',
            fontFamily: 'var(--font-heading)',
          }}
          className="text-3xl font-bold tracking-tight"
        >
          {value !== undefined && value !== null ? value : '—'}
        </div>
        {subtitle && (
          <p
            style={{ color: 'var(--color-text-muted)' }}
            className="mt-1 text-xs font-normal"
          >
            {subtitle}
          </p>
        )}
      </div>

      {breakdown && breakdown.length > 0 && (
        <div
          style={{ borderColor: 'var(--color-border)' }}
          className="mt-4 pt-3 border-t flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
        >
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span style={{ color: 'var(--color-text-dim)' }}>{item.label}:</span>
              <span
                style={{ color: 'var(--color-text)' }}
                className="font-semibold"
              >
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
