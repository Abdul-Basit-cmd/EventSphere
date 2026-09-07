import React from 'react';

const sizes = {
  sm: { outer: 18, inner: 10, border: 2 },
  md: { outer: 28, inner: 16, border: 3 },
  lg: { outer: 42, inner: 24, border: 4 },
};

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const s = sizes[size] || sizes.md;

  return (
    <span
      className={className}
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: s.outer,
        height: s.outer,
        flexShrink: 0,
      }}
    >
      {/* Outer ring — clockwise */}
      <span
        style={{
          position: 'absolute',
          width: s.outer,
          height: s.outer,
          borderRadius: '50%',
          border: `${s.border}px solid transparent`,
          borderTopColor: 'var(--color-primary)',
          animation: 'spinCW 0.8s linear infinite',
        }}
      />
      {/* Inner ring — counter-clockwise */}
      <span
        style={{
          position: 'absolute',
          width: s.inner,
          height: s.inner,
          borderRadius: '50%',
          border: `${s.border}px solid transparent`,
          borderTopColor: 'var(--color-accent)',
          animation: 'spinCCW 0.6s linear infinite',
        }}
      />
      <span className="sr-only">Loading...</span>
    </span>
  );
};

export default LoadingSpinner;
