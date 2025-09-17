import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
}

export function Button({ 
  variant = 'primary', 
  children, 
  className, 
  ...props 
}: ButtonProps): JSX.Element {
  return (
    <button
      className={clsx(
        styles.base, 
        variant === 'secondary' ? styles.secondary : styles.primary, 
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}