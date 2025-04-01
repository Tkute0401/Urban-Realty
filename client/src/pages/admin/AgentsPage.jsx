// src/pages/admin/AgentsPage.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, 
  IconButton, CircularProgress, TextField, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Chip, Tooltip, Badge
} from '@mui/material';
import { 
  Edit, Delete, Search, Refresh, 
  Person, CheckCircle, Cancel, Email, Phone
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/format';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const navigate = useNavigate();

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/v1/admin/users?role=agent');
      setAgents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDeleteAgent = async () => {
    try {
      await axios.delete(`/api/v1/admin/users/${selectedAgent._id}`);
      setOpenDeleteDialog(false);
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete agent');
    }
  };

  const toggleAgentStatus = async (agentId, isActive) => {
    try {
      await axios.patch(`/api/v1/admin/users/${agentId}/status`, {
        active: !isActive
      });
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update agent status');
    }
  };

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && agents.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Agent Management</Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/admin/users/new-agent')}
          >
            Add New Agent
          </Button>
          <IconButton onClick={fetchAgents}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Box mb={3} p={2} bgcolor="error.light" borderRadius={1}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search agents by name, email or license..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
        />
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Agent</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Since</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Tooltip title={agent.active ? "Active" : "Inactive"}>
                            <Box
                              component="span"
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: agent.active ? 'success.main' : 'error.main',
                                border: '2px solid white'
                              }}
                            />
                          </Tooltip>
                        }
                      >
                        <Avatar src={agent.avatar}>
                          {agent.name.charAt(0)}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography fontWeight="500">{agent.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {agent.specializations?.join(', ') || 'No specializations'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{agent.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{agent.phone || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {agent.licenseNumber || (
                      <Chip label="Not Verified" size="small" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={agent.active ? "Deactivate agent" : "Activate agent"}>
                      <IconButton onClick={() => toggleAgentStatus(agent._id, agent.active)}>
                        {agent.active ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Cancel color="error" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{formatDate(agent.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/admin/users/${agent._id}/edit`)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton 
                      onClick={() => {
                        setSelectedAgent(agent);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete agent {selectedAgent?.name}? This will also remove all their listings and associated data.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteAgent} 
            color="error"
            variant="contained"
          >
            Delete Agent
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentsPage;