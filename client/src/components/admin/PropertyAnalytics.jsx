import React from 'react';
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PropertyAnalytics = ({ data = [] }) => {
  // Sample data if no data provided
  const sampleData = {
    propertyTypes: [
      { name: 'Residential', value: 45, color: '#8884d8' },
      { name: 'Commercial', value: 25, color: '#82ca9d' },
      { name: 'Land', value: 15, color: '#ffc658' },
      { name: 'Industrial', value: 10, color: '#ff7300' },
      { name: 'Other', value: 5, color: '#8dd1e1' }
    ],
    monthlyListings: [
      { month: 'Jan', new: 45, sold: 32, active: 180 },
      { month: 'Feb', new: 52, sold: 38, active: 194 },
      { month: 'Mar', new: 48, sold: 41, active: 201 },
      { month: 'Apr', new: 61, sold: 45, active: 217 },
      { month: 'May', new: 55, sold: 49, active: 223 },
      { month: 'Jun', new: 58, sold: 52, active: 229 },
      { month: 'Jul', new: 62, sold: 48, active: 243 },
      { month: 'Aug', new: 59, sold: 51, active: 251 },
      { month: 'Sep', new: 64, sold: 54, active: 261 },
      { month: 'Oct', new: 67, sold: 57, active: 271 },
      { month: 'Nov', new: 71, sold: 59, active: 283 },
      { month: 'Dec', new: 68, sold: 62, active: 289 }
    ],
    priceRanges: [
      { range: '$0-100k', count: 85, percentage: 28 },
      { range: '$100k-250k', count: 120, percentage: 40 },
      { range: '$250k-500k', count: 65, percentage: 22 },
      { range: '$500k-1M', count: 20, percentage: 7 },
      { range: '$1M+', count: 10, percentage: 3 }
    ]
  };

  const chartData = data.length > 0 ? data : sampleData;

  if (!chartData || Object.keys(chartData).length === 0) {
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
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
        Property Analytics
      </Typography>
      
      <Grid container spacing={3}>
        {/* Property Types Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Property Types Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.propertyTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.propertyTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Listings Trend */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Monthly Listings Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.monthlyListings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="new" fill="#8884d8" name="New Listings" />
                  <Bar dataKey="sold" fill="#82ca9d" name="Sold" />
                  <Bar dataKey="active" fill="#ffc658" name="Active" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Price Range Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Price Range Distribution</Typography>
              <Grid container spacing={2}>
                {chartData.priceRanges.map((range, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Typography variant="h6" color="primary">
                        {range.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {range.range}
                      </Typography>
                      <Chip 
                        label={`${range.percentage}%`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#f8f9fa' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {chartData.monthlyListings[chartData.monthlyListings.length - 1]?.active || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Properties
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#f8f9fa' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {chartData.monthlyListings[chartData.monthlyListings.length - 1]?.new || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    New This Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#f8f9fa' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main">
                    {chartData.monthlyListings[chartData.monthlyListings.length - 1]?.sold || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sold This Month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#f8f9fa' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main">
                    {chartData.propertyTypes.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Property Types
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyAnalytics;