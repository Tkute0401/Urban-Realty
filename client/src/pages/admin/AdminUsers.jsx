// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, 
  IconButton, CircularProgress, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, Chip
} from '@mui/material';
import { 
  Add, Edit, Delete, Search, Refresh, 
  Person, AdminPanelSettings, Engineering
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/format';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/v1/admin/users';
      if (roleFilter !== 'all') {
        url += `?role=${roleFilter}`;
      }
      
      const response = await axios.get(url);
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/api/v1/admin/users/${selectedUser._id}`);
      setOpenDeleteDialog(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate('/admin/users/new')}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Box mb={3} p={2} bgcolor="error.light" borderRadius={1}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
        />
        
        <TextField
          select
          variant="outlined"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Roles</MenuItem>
          <MenuItem value="buyer">Buyers</MenuItem>
          <MenuItem value="agent">Agents</MenuItem>
          <MenuItem value="admin">Admins</MenuItem>
        </TextField>
        
        <IconButton onClick={fetchUsers}>
          <Refresh />
        </IconButton>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={user.avatar}>
                        {user.name.charAt(0)}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="buyer">Buyer</MenuItem>
                      <MenuItem value="agent">Agent</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/admin/users/${user._id}`)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton 
                      onClick={() => {
                        setSelectedUser(user);
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
          Are you sure you want to delete user {selectedUser?.name}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;