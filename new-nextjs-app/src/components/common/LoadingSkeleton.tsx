'use client'

import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton, LinearProgress } from '@mui/material';

const DashboardSkeleton = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={32} />
      </Box>

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={40} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={16} />
                  </Box>
                  <Skeleton variant="circular" width={56} height={56} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Metrics Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2].map((item) => (
                  <Box key={item}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Skeleton variant="text" width="30%" height={20} />
                      <Skeleton variant="text" width="20%" height={20} />
                    </Box>
                    <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="50%" height={32} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={16} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="40%" height={14} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section Skeleton */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[1, 2, 3].map((item) => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={16} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="60%" height={14} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
        <Box>
          {/* Table Header */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2, pb: 1, borderBottom: '1px solid #e0e0e0' }}>
            {Array(columns).fill(0).map((_, index) => (
              <Skeleton key={index} variant="text" width="20%" height={20} />
            ))}
          </Box>
          {/* Table Rows */}
          {Array(rows).fill(0).map((_, rowIndex) => (
            <Box key={rowIndex} sx={{ display: 'flex', gap: 2, mb: 1, py: 1 }}>
              {Array(columns).fill(0).map((_, colIndex) => (
                <Skeleton key={colIndex} variant="text" width="20%" height={16} />
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const CardSkeleton = () => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Skeleton variant="text" width="40%" height={36} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={16} />
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = ({ height = 300 }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box>
        <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Skeleton variant="rectangular" width={12} height={12} />
              <Skeleton variant="text" width={60} height={14} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main LoadingSkeleton export with sub-components
const LoadingSkeleton = {
  Dashboard: DashboardSkeleton,
  Table: TableSkeleton,
  Card: CardSkeleton,
  Chart: ChartSkeleton,
};

export default LoadingSkeleton;
export { DashboardSkeleton, TableSkeleton, CardSkeleton, ChartSkeleton };