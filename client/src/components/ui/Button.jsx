import React from 'react';

export function Button({ variant = 'primary', children, style, ...props }) {
  const styles = {
    base: {
      fontFamily: 'var(--font-family-base)',
      fontWeight: 600,
      padding: '8px 20px',
      borderRadius: 'var(--radius-base)',
      border: 'none',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s ease, transform 0.05s ease',
    },
    primary: {
      background: 'var(--color-primary)',
      color: '#fff',
    },
    secondary: {
      background: 'var(--color-secondary)',
      color: '#fff',
    },
  };

  const merged = {
    ...styles.base,
    ...(variant === 'secondary' ? styles.secondary : styles.primary),
    ...style,
  };

  return (
    <button
      style={merged}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
      {...props}
    >
      {children}
    </button>
  );
}

