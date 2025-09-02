import React from 'react';
import styles from './Modal.module.css';

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">×</button>
        {title ? <div className={styles.header}>{title}</div> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

