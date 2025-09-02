import React from 'react';

export function Input({ style, ...props }) {
  const base = {
    fontFamily: 'var(--font-family-base)',
    padding: '10px 12px',
    borderRadius: 'var(--radius-base)',
    border: '1px solid #e5e7eb',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <input
      style={Object.assign({}, base, style)}
      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
      onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
      {...props}
    />
  );
}

