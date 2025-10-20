'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Divider
} from '@mui/material';
import {
  Business,
  People,
  Home,
  TrendingUp,
  Add,
  Visibility
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import DeveloperUsersTable from '../DeveloperUsersTable';
import DeveloperProfilesTable from '../DeveloperProfilesTable';
import ProjectsTable from '../ProjectsTable';
import http from '@/lib/services/http';

interface DeveloperStats {
  totalDevelopers: number;
  activeDevelopers: number;
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  upcomingProjects: number;
}

const DeveloperManagementDashboard = () => {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<DeveloperStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeveloperStats();
  }, []);

  const fetchDeveloperStats = async () => {
    try {
      setLoading(true);
      const response = await http.get('/api/v1/admin/developers/stats');
      setStats(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch developer statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Developer Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage developer users, profiles, and their projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/admin/developers/users')}
        >
          Add Developer User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Developers
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalDevelopers}
                    </Typography>
                  </Box>
                  <Business color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Active Developers
                    </Typography>
                    <Typography variant="h4">
                      {stats.activeDevelopers}
                    </Typography>
                  </Box>
                  <People color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Projects
                    </Typography>
                    <Typography variant="h4">
                      {stats.totalProjects}
                    </Typography>
                  </Box>
                  <Home color="info" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Completed Projects
                    </Typography>
                    <Typography variant="h4">
                      {stats.completedProjects}
                    </Typography>
                  </Box>
                  <TrendingUp color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Project Status Breakdown */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="Project Status" />
              <CardContent>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Completed</Typography>
                    <Chip label={stats.completedProjects} color="success" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Ongoing</Typography>
                    <Chip label={stats.ongoingProjects} color="warning" size="small" />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Upcoming</Typography>
                    <Chip label={stats.upcomingProjects} color="info" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader title="Quick Actions" />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<People />}
                      onClick={() => router.push('/admin/developers/users')}
                    >
                      Manage Users
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Business />}
                      onClick={() => router.push('/admin/developers/profiles')}
                    >
                      Manage Profiles
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Home />}
                      onClick={() => router.push('/admin/projects')}
                    >
                      Manage Projects
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => router.push('/admin/analytics')}
                    >
                      View Analytics
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs for different management sections */}
      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Developer Users" />
          <Tab label="Developer Profiles" />
          <Tab label="Projects" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <DeveloperUsersTable />}
          {tabValue === 1 && <DeveloperProfilesTable />}
          {tabValue === 2 && <ProjectsTable />}
        </Box>
      </Paper>
    </Box>
  );
};

export default DeveloperManagementDashboard;
