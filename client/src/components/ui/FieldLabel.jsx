import React from 'react';

const FieldLabel = ({ children, required = false, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: 'block',
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--color-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    }}
  >
    {children}
    {required && (
      <span style={{ color: 'var(--color-danger)', marginLeft: 3, fontWeight: 700 }}>*</span>
    )}
  </label>
);

export default FieldLabel;
