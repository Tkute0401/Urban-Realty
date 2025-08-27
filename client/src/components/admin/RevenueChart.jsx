import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const RevenueChart = ({ data = [] }) => {
  // Sample data if no data provided
  const sampleData = [
    { month: 'Jan', revenue: 12000, growth: 15 },
    { month: 'Feb', revenue: 13500, growth: 12.5 },
    { month: 'Mar', revenue: 14200, growth: 5.2 },
    { month: 'Apr', revenue: 15800, growth: 11.3 },
    { month: 'May', revenue: 16500, growth: 4.4 },
    { month: 'Jun', revenue: 17800, growth: 7.9 },
    { month: 'Jul', revenue: 19200, growth: 7.9 },
    { month: 'Aug', revenue: 20100, growth: 4.7 },
    { month: 'Sep', revenue: 21800, growth: 8.5 },
    { month: 'Oct', revenue: 22500, growth: 3.2 },
    { month: 'Nov', revenue: 23800, growth: 5.8 },
    { month: 'Dec', revenue: 24500, growth: 2.9 }
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
            Revenue: ${payload[0].value?.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="success.main">
            Growth: +{payload[1]?.value?.toFixed(1)}%
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
          Revenue Trends
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: '50%' }} />
            <Typography variant="caption">Revenue</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: '50%' }} />
            <Typography variant="caption">Growth</Typography>
          </Box>
        </Box>
      </Box>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#1976d2"
            fill="#1976d2"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="growth"
            stroke="#4caf50"
            strokeWidth={2}
            dot={{ fill: '#4caf50', strokeWidth: 2, r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Revenue
          </Typography>
          <Typography variant="h6" color="primary">
            ${chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Avg Monthly Growth
          </Typography>
          <Typography variant="h6" color="success.main">
            +{(chartData.reduce((sum, item) => sum + item.growth, 0) / chartData.length).toFixed(1)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RevenueChart;