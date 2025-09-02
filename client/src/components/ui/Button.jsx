import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

export function Button({ variant = 'primary', children, className, ...props }) {
  return (
    <button
      className={clsx(styles.base, variant === 'secondary' ? styles.secondary : styles.primary, className)}
      {...props}
    >
      {children}
    </button>
  );
}

