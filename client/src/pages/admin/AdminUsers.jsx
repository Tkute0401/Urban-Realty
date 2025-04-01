// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Avatar, Chip, Button, 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, 
  CircularProgress, IconButton 
} from '@mui/material';
import { 
  Edit, Delete, Person, Add, 
  Close, Check, Cancel 
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'buyer',
    mobile: ''
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/users');
      setUsers(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    setCurrentUser(user);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'buyer',
        mobile: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (currentUser) {
        await axios.put(`/api/v1/admin/users/${currentUser._id}`, formData);
      } else {
        await axios.post('/api/v1/admin/users', formData);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/v1/admin/users/${userId}`);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'agent': return 'primary';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add User
        </Button>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>
                        <Person />
                      </Avatar>
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.mobile || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {currentUser ? 'Edit User' : 'Add New User'}
          <IconButton 
            onClick={handleCloseDialog} 
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          <Box mb={2}>
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Box>
          {!currentUser && (
            <Box mb={2}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            startIcon={<Check />}
            onClick={handleSubmit}
          >
            Save
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Cancel />}
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;