'use client';

import React from 'react';

export interface BHKSelectorProps {
  value: number[];
  onChange: (bedrooms: number[]) => void;
  size?: 'small' | 'medium' | 'large';
  maxVisible?: number;
  className?: string;
}

const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2'
};

const options: { label: string; value: number }[] = [
  { label: '1 RK', value: 0 },
  { label: '1 BHK', value: 1 },
  { label: '2 BHK', value: 2 },
  { label: '3 BHK', value: 3 },
  { label: '4 BHK', value: 4 },
  { label: '5+ BHK', value: 5 }
];

const BHKSelector: React.FC<BHKSelectorProps> = ({
  value,
  onChange,
  size = 'medium',
  maxVisible,
  className = ''
}) => {
  const toggleValue = (v: number) => {
    if (value.includes(v)) {
      onChange(value.filter((x) => x !== v));
    } else {
      onChange([...value, v]);
    }
  };

  const handleAll = () => {
    onChange([]);
  };

  const visibleOptions =
    typeof maxVisible === 'number' && maxVisible > 0 ? options.slice(0, maxVisible) : options;
  const hiddenCount = options.length - visibleOptions.length;

  return (
    <div className={`flex items-center gap-1 overflow-x-auto scrollbar-thin ${className}`}>
      <button
        type="button"
        onClick={handleAll}
        className={`rounded-full border border-white/30 bg-white/10 text-white/80 hover:bg-white/20 transition-colors whitespace-nowrap ${sizeClasses[size]} ${
          value.length === 0 ? 'bg-[var(--color-primary)]/80 border-[var(--color-primary)] text-white' : ''
        }`}
      >
        All
      </button>
      {visibleOptions.map((opt) => {
        const isActive = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggleValue(opt.value)}
            className={`rounded-full border border-white/30 bg-white/10 text-white/80 hover:bg-white/20 transition-colors whitespace-nowrap ${sizeClasses[size]} ${
              isActive ? 'bg-[var(--color-primary)]/80 border-[var(--color-primary)] text-white' : ''
            }`}
          >
            {opt.label}
          </button>
        );
      })}
      {hiddenCount > 0 && (
        <span className="text-[11px] text-white/70 whitespace-nowrap">+{hiddenCount} more</span>
      )}
    </div>
  );
};

export default BHKSelector;













