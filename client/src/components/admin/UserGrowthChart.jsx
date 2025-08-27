import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const UserGrowthChart = ({ data = [] }) => {
  // Sample data if no data provided
  const sampleData = [
    { month: 'Jan', users: 1250, newUsers: 180, growth: 16.8 },
    { month: 'Feb', users: 1420, newUsers: 170, growth: 13.6 },
    { month: 'Mar', users: 1580, newUsers: 160, growth: 11.3 },
    { month: 'Apr', users: 1720, newUsers: 140, growth: 8.9 },
    { month: 'May', users: 1850, newUsers: 130, growth: 7.6 },
    { month: 'Jun', users: 1980, newUsers: 130, growth: 7.0 },
    { month: 'Jul', users: 2100, newUsers: 120, growth: 6.1 },
    { month: 'Aug', users: 2210, newUsers: 110, growth: 5.2 },
    { month: 'Sep', users: 2310, newUsers: 100, growth: 4.5 },
    { month: 'Oct', users: 2400, newUsers: 90, growth: 3.9 },
    { month: 'Nov', users: 2480, newUsers: 80, growth: 3.3 },
    { month: 'Dec', users: 2550, newUsers: 70, growth: 2.8 }
  ];

  const chartData = data.length > 0 ? data : sampleData;

  if (!chartData || chartData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: 1,
            p: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body1" color="primary">
            Total Users: {payload[0]?.value?.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="secondary.main">
            New Users: {payload[1]?.value}
          </Typography>
          <Typography variant="body2" color="success.main">
            Growth: +{payload[2]?.value?.toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="text.primary">
          User Growth
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: '50%' }} />
            <Typography variant="caption">Total</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#9c27b0', borderRadius: '50%' }} />
            <Typography variant="caption">New</Typography>
          </Box>
        </Box>
      </Box>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={11}
          />
          <YAxis 
            stroke="#666"
            fontSize={11}
            tickFormatter={(value) => value > 1000 ? `${(value / 1000).toFixed(1)}k` : value}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#1976d2"
            strokeWidth={3}
            dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
            name="Total Users"
          />
          <Line
            type="monotone"
            dataKey="newUsers"
            stroke="#9c27b0"
            strokeWidth={2}
            dot={{ fill: '#9c27b0', strokeWidth: 2, r: 3 }}
            name="New Users"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 1 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Users
          </Typography>
          <Typography variant="h6" color="primary">
            {chartData[chartData.length - 1]?.users?.toLocaleString() || 0}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Monthly Growth
          </Typography>
          <Typography variant="h6" color="success.main">
            +{chartData[chartData.length - 1]?.growth?.toFixed(1) || 0}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserGrowthChart;