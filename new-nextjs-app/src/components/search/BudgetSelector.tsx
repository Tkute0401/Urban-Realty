'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface BudgetRange {
  min?: number;
  max?: number;
}

export interface BudgetSelectorProps {
  value: BudgetRange;
  onChange: (range: BudgetRange) => void;
  variant?: 'dropdown' | 'inline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const PRESET_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: 'Any' },
  { label: 'Under 50L', max: 50_00_000 },
  { label: '50L - 1Cr', min: 50_00_000, max: 1_00_00_000 },
  { label: '1Cr - 2Cr', min: 1_00_00_000, max: 2_00_00_000 },
  { label: '2Cr - 5Cr', min: 2_00_00_000, max: 5_00_00_000 },
  { label: '5Cr+', min: 5_00_00_000 }
];

const formatCurrency = (value?: number) => {
  if (value == null || Number.isNaN(value)) return '';
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(1).replace(/\.0$/, '')}Cr`;
  }
  if (value >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(1).replace(/\.0$/, '')}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2'
};

const BudgetSelector: React.FC<BudgetSelectorProps> = ({
  value,
  onChange,
  variant = 'dropdown',
  size = 'medium',
  className = ''
}) => {
  const [open, setOpen] = useState(false);

  const triggerLabel = useMemo(() => {
    if (!value || (!value.min && !value.max)) {
      return 'Budget';
    }
    if (value.min && value.max) {
      return `${formatCurrency(value.min)} - ${formatCurrency(value.max)}`;
    }
    if (value.min) return `From ${formatCurrency(value.min)}`;
    if (value.max) return `Up to ${formatCurrency(value.max)}`;
    return 'Budget';
  }, [value]);

  const content = (
    <div className={`flex flex-col gap-2 ${variant === 'inline' ? '' : 'w-64'} ${className}`}>
      <div className="flex flex-wrap gap-1">
        {PRESET_RANGES.map((preset) => {
          const isActive =
            (preset.min ?? undefined) === (value?.min ?? undefined) &&
            (preset.max ?? undefined) === (value?.max ?? undefined);

          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ min: preset.min, max: preset.max })}
              className={`rounded-full border border-white/40 px-2 py-1 text-xs text-white/90 hover:bg-white/15 transition ${
                isActive ? 'bg-[var(--color-primary)]/80 border-[var(--color-primary)] text-white' : ''
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wide text-white/70">Min</label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-md bg-black/20 border border-white/25 px-2 py-1 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            placeholder="e.g. 5000000"
            value={value?.min ?? ''}
            onChange={(e) => {
              const next = e.target.value === '' ? undefined : Number(e.target.value);
              onChange({ ...value, min: Number.isNaN(next as number) ? undefined : next });
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wide text-white/70">Max</label>
          <input
            type="number"
            inputMode="numeric"
            className="w-full rounded-md bg-black/20 border border-white/25 px-2 py-1 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
            placeholder="e.g. 10000000"
            value={value?.max ?? ''}
            onChange={(e) => {
              const next = e.target.value === '' ? undefined : Number(e.target.value);
              onChange({ ...value, max: Number.isNaN(next as number) ? undefined : next });
            }}
          />
        </div>
      </div>
    </div>
  );

  if (variant === 'inline') {
    return content;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1 rounded-lg border border-white/30 bg-white/10 text-white ${sizeClasses[size]} hover:bg-white/20 transition-colors whitespace-nowrap`}
      >
        <span className="truncate max-w-[160px] text-left">{triggerLabel}</span>
        <span className="text-[10px] opacity-80">{open ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 mt-2 rounded-xl border border-white/20 bg-black/70 backdrop-blur-xl p-3 shadow-2xl z-[60]"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BudgetSelector;











