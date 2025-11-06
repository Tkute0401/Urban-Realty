'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  MoreVert,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Apartment as ApartmentIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { api } from '@/lib/services/api';

const AgentProjects = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { deleteProject } = useProjects();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAgentProjects();
    }
  }, [user]);

  const fetchAgentProjects = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await api.agent.projects();
      const agentProjects = Array.isArray(response.data) ? response.data : (response.data?.items || []);
      
      setProjects(agentProjects);
      
      // Calculate stats
      setStats({
        total: agentProjects.length,
        active: agentProjects.filter((p: any) => 
          p.status === 'Planning' || p.status === 'Under Construction'
        ).length,
        completed: agentProjects.filter((p: any) => 
          p.status === 'Completed'
        ).length
      });
    } catch (err) {
      console.error('Error fetching agent projects:', err);
      setError('Failed to load your projects');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleEdit = (projectId: string) => {
    handleMenuClose();
    router.push(`/projects/edit/${projectId}`);
  };

  const handleDelete = async (projectId: string) => {
    handleMenuClose();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        await fetchAgentProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
        setError('Failed to delete project');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'info';
      case 'Under Construction': return 'warning';
      case 'Completed': return 'success';
      case 'On Hold': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    return <ApartmentIcon />;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
          My Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/projects/add')}
          sx={{
            background: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            '&:hover': {
              background: 'var(--color-primary-hover)'
            }
          }}
        >
          Add Project
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
            color: 'var(--color-primary-contrast)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Total Projects</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-warning) 0%, #f59e0b 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Active Projects</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Completed Projects</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects List */}
      {loading && projects.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by adding your first project
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/projects/add')}
          >
            Add Project
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }
                }}
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                <Box
                  sx={{
                    height: 200,
                    background: project.images?.[0]?.url 
                      ? `url(${project.images[0].url}) center/cover`
                      : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {!project.images?.[0]?.url && (
                    <BusinessIcon sx={{ fontSize: 64, color: 'white', opacity: 0.7 }} />
                  )}
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.9)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, project._id);
                    }}
                  >
                    <MoreVert />
                  </IconButton>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status) as any}
                    size="small"
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {project.type}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, mb: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {project.location?.city}, {project.location?.state}
                    </Typography>
                  </Box>
                  {project.startingPrice && (
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ₹{project.startingPrice.toLocaleString()}
                      {project.pricePerSqFt && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' '}/ sq ft
                        </Typography>
                      )}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedProject && handleEdit(selectedProject)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => selectedProject && handleDelete(selectedProject)}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AgentProjects;

