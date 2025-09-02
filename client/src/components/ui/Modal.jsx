import React from 'react';

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  const overlay = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  };
  const panel = {
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    padding: 20,
    borderRadius: 'var(--radius-base)',
    minWidth: 320,
    maxWidth: '90vw',
    boxShadow: 'var(--shadow-hover)',
  };
  const header = { fontWeight: 700, marginBottom: 10 };
  const closeBtn = { float: 'right', cursor: 'pointer' };
  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={closeBtn} onClick={onClose}>×</div>
        {title ? <div style={header}>{title}</div> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

