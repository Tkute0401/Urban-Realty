"use client";
import React from 'react';
import { Card, CardContent, LinearProgress, Typography, Box } from '@mui/material';

type PlatformMetricsProps = {
  growthRate: number;
  conversionRate: number;
  avgResponseTime: number;
};

const MetricRow: React.FC<{ label: string; value: string | number; progress: number }> = ({ label, value, progress }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" mb={1}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" fontWeight="bold">{value}</Typography>
    </Box>
    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
  </Box>
);

const PlatformMetrics: React.FC<PlatformMetricsProps> = ({ growthRate, conversionRate, avgResponseTime }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Platform Metrics
        </Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          <MetricRow label="Growth Rate" value={`${growthRate}%`} progress={growthRate} />
          <MetricRow label="Conversion Rate" value={`${conversionRate}%`} progress={conversionRate} />
          <MetricRow label="Avg Response Time" value={`${avgResponseTime}h`} progress={Math.min((24 - avgResponseTime) / 24 * 100, 100)} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlatformMetrics;

