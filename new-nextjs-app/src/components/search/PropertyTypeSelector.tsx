'use client';

import React from 'react';

export interface PropertyTypeSelectorProps {
  value: string[];
  onChange: (types: string[]) => void;
  category?: 'residential' | 'commercial' | 'all';
  multiselect?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses: Record<'small' | 'medium' | 'large', string> = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2'
};

const RESIDENTIAL_TYPES = [
  'Apartment',
  'Independent House',
  'Villa',
  'Builder Floor',
  'Studio',
  'Plot/Land'
];

const COMMERCIAL_TYPES = [
  'Office Space',
  'Retail/Shop',
  'Warehouse',
  'Industrial',
  'Co-working'
];

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  value,
  onChange,
  category = 'all',
  multiselect = true,
  size = 'medium',
  className = ''
}) => {
  const handleToggle = (type: string) => {
    if (multiselect) {
      if (value.includes(type)) {
        onChange(value.filter((t) => t !== type));
      } else {
        onChange([...value, type]);
      }
    } else {
      onChange(value.includes(type) ? [] : [type]);
    }
  };

  const clearAll = () => onChange([]);

  const showResidential = category === 'residential' || category === 'all';
  const showCommercial = category === 'commercial' || category === 'all';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-white/70">Property Type</span>
        {value.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] text-[var(--color-primary)] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {showResidential && (
          <>
            {RESIDENTIAL_TYPES.map((type) => {
              const isActive = value.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggle(type)}
                  className={`rounded-full border border-white/30 bg-white/10 text-white/80 hover:bg-white/20 transition-colors whitespace-nowrap ${sizeClasses[size]} ${
                    isActive ? 'bg-[var(--color-primary)]/80 border-[var(--color-primary)] text-white' : ''
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </>
        )}

        {showCommercial && (
          <>
            {COMMERCIAL_TYPES.map((type) => {
              const isActive = value.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggle(type)}
                  className={`rounded-full border border-white/30 bg-white/10 text-white/80 hover:bg-white/20 transition-colors whitespace-nowrap ${sizeClasses[size]} ${
                    isActive ? 'bg-[var(--color-primary)]/80 border-[var(--color-primary)] text-white' : ''
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyTypeSelector;













