"use client";

import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

function RHFTextField({ name, control, rules, defaultValue = '', textFieldProps = {} }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...textFieldProps}
        />
      )}
    />
  );
}

export default RHFTextField;

