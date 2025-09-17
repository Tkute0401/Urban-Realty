import React, { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className, ...props }: InputProps): JSX.Element {
  return (
    <input
      className={[styles.base, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}