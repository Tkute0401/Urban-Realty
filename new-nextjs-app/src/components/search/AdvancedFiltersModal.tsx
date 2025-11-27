'use client';

import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  TextField,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';

export interface AdvancedFiltersState {
  minArea: string;
  maxArea: string;
  furnished?: boolean;
  verified?: boolean;
  hasVirtualTour?: boolean;
}

export interface AdvancedFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: AdvancedFiltersState;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  open,
  onClose,
  filters,
  onChange,
  onReset
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseApply = () => {
    onClose();
  };

  const chipVariant = (active: boolean) => (active ? 'filled' : 'outlined');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          backgroundColor: 'var(--color-surface)'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>More Filters</DialogTitle>
      <DialogContent dividers sx={{ py: 2 }}>
        <Grid container spacing={3}>
          {/* Price & Size */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Area (sq.ft)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Area"
                  type="number"
                  size="small"
                  value={filters.minArea}
                  onChange={(e) => onChange('minArea', e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Area"
                  type="number"
                  size="small"
                  value={filters.maxArea}
                  onChange={(e) => onChange('maxArea', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Special */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
              Special
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Furnished"
                clickable
                size="small"
                variant={chipVariant(filters.furnished === true)}
                onClick={() => onChange('furnished', filters.furnished === true ? undefined : true)}
              />
              <Chip
                label="Verified Only"
                clickable
                size="small"
                variant={chipVariant(filters.verified === true)}
                onClick={() => onChange('verified', filters.verified === true ? undefined : true)}
              />
              <Chip
                label="Has Virtual Tour"
                clickable
                size="small"
                variant={chipVariant(filters.hasVirtualTour === true)}
                onClick={() =>
                  onChange('hasVirtualTour', filters.hasVirtualTour === true ? undefined : true)
                }
              />
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onReset}>Reset</Button>
        <Button
          onClick={handleCloseApply}
          variant="contained"
          sx={{ backgroundColor: 'var(--color-primary)' }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdvancedFiltersModal;



