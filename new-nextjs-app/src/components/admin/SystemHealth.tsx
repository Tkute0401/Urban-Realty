"use client";
import React from 'react';
import { Avatar, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import { Speed as SpeedIcon, Storage as StorageIcon, NetworkCheck as NetworkIcon } from '@mui/icons-material';

type SystemHealth = {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
};

type SystemHealthProps = {
  health: SystemHealth;
};

const MetricCard: React.FC<{ title: string; value: number; icon: React.ReactNode; subtitle: string }> = ({ title, value, icon, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 40, height: 40, mb: 1 }}>
        {icon}
      </Avatar>
      <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--color-primary)' }}>
        {value}%
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        {subtitle}
      </Typography>
      <LinearProgress variant="determinate" value={value} sx={{ height: 8, borderRadius: 4 }} />
    </CardContent>
  </Card>
);

const SystemHealthSection: React.FC<SystemHealthProps> = ({ health }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          System Health
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MetricCard title="CPU Usage" value={health.cpu} icon={<SpeedIcon />} subtitle="Current load" />
          </Grid>
          <Grid item xs={6}>
            <MetricCard title="Memory" value={health.memory} icon={<StorageIcon />} subtitle="RAM usage" />
          </Grid>
          <Grid item xs={6}>
            <MetricCard title="Storage" value={health.storage} icon={<StorageIcon />} subtitle="Disk usage" />
          </Grid>
          <Grid item xs={6}>
            <MetricCard title="Network" value={health.network} icon={<NetworkIcon />} subtitle="Uptime" />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SystemHealthSection;

