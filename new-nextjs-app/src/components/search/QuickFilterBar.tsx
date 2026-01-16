'use client';

import React from 'react';
import { Box, Button, MenuItem, Select, Typography } from '@mui/material';
import BHKSelector from '@/components/search/BHKSelector';
import BudgetSelector, { BudgetRange } from '@/components/search/BudgetSelector';
import PropertyTypeSelector from '@/components/search/PropertyTypeSelector';

export interface FilterState {
  propertyType: string;
  type: string;
  priceMin: string;
  priceMax: string;
  bedrooms: string;
  constructionStatus: string[];
  sort?: string;
}

export interface QuickFilterBarProps {
  filters: FilterState;
  onFilterChange: (key: string, value: any) => void;
  onMoreFiltersClick: () => void;
  activeFilterCount: number;
}

const QuickFilterBar: React.FC<QuickFilterBarProps> = ({
  filters,
  onFilterChange,
  onMoreFiltersClick,
  activeFilterCount
}) => {
  const budgetRange: BudgetRange = {
    min: filters.priceMin ? Number(filters.priceMin) || undefined : undefined,
    max: filters.priceMax ? Number(filters.priceMax) || undefined : undefined
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 2,
        alignItems: 'center'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1, minWidth: 240 }}>
        <Box sx={{ minWidth: 140 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            BHK
          </Typography>
          <BHKSelector
            value={filters.bedrooms ? [Number(filters.bedrooms)] : []}
            onChange={(vals) => {
              const max = vals.length ? Math.max(...vals) : '';
              onFilterChange('bedrooms', max === '' ? '' : String(max));
            }}
            size="small"
          />
        </Box>

        <Box sx={{ minWidth: 180 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            Budget
          </Typography>
          <BudgetSelector
            value={budgetRange}
            onChange={(range) => {
              onFilterChange('priceMin', range.min ? String(range.min) : '');
              onFilterChange('priceMax', range.max ? String(range.max) : '');
            }}
            variant="dropdown"
            size="small"
          />
        </Box>

        <Box sx={{ minWidth: 220 }}>
          <PropertyTypeSelector
            value={filters.type ? filters.type.split(',').filter(Boolean) : []}
            onChange={(types) => onFilterChange('type', types.join(','))}
            category={filters.propertyType === 'COMMERCIAL' ? 'commercial' : 'all'}
            multiselect
            size="small"
          />
        </Box>

        <Box sx={{ minWidth: 160 }}>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            Status
          </Typography>
          <Select
            value={filters.constructionStatus[0] || ''}
            onChange={(e) =>
              onFilterChange('constructionStatus', e.target.value ? [e.target.value as string] : [])
            }
            size="small"
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Any status</MenuItem>
            <MenuItem value="Ready to Move">Ready to Move</MenuItem>
            <MenuItem value="Under Construction">Under Construction</MenuItem>
            <MenuItem value="New Launch">New Launch</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Select
          value={filters.sort || 'relevance'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          size="small"
        >
          <MenuItem value="relevance">Relevance</MenuItem>
          <MenuItem value="newest">Newest First</MenuItem>
          <MenuItem value="priceLow">Price: Low to High</MenuItem>
          <MenuItem value="priceHigh">Price: High to Low</MenuItem>
        </Select>

        <Button
          variant="outlined"
          onClick={onMoreFiltersClick}
          sx={{
            textTransform: 'none',
            borderRadius: '999px',
            borderColor: 'var(--color-primary)'
          }}
        >
          More Filters
          {activeFilterCount > 0 && (
            <Box
              component="span"
              sx={{
                ml: 1,
                px: 1,
                borderRadius: '999px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: 12
              }}
            >
              {activeFilterCount}
            </Box>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default QuickFilterBar;













