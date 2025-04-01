import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';
import { 
  MoreVert, 
  Edit, 
  Delete, 
  VerifiedUser, 
  Phone, 
  Close, 
  Save 
} from '@mui/icons-material';
import axios from '../../services/axios';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    occupation: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (!selectedUser) return;
    
    setEditFormData({
      name: selectedUser.name,
      email: selectedUser.email,
      mobile: selectedUser.mobile || '',
      role: selectedUser.role,
      occupation: selectedUser.occupation || ''
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async () => {
    if (!selectedUser || !selectedUser._id) {
      setError('No user selected for editing');
      setEditDialogOpen(false);
      return;
    }

    try {
      const response = await axios.put(
        `/admin/users/${selectedUser._id}`, 
        editFormData
      );
      
      if (response.data.success) {
        setUsers(users.map(user => 
          user._id === selectedUser._id ? response.data.data : user
        ));
        setEditDialogOpen(false);
      } else {
        setError(response.data.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await axios.delete(`/admin/users/${selectedUser._id}`);
      setUsers(users.filter(user => user._id !== selectedUser._id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      handleMenuClose();
    }
  };

  const handleVerifyAgent = async () => {
    if (!selectedUser || selectedUser.role !== 'agent') return;

    try {
      const response = await axios.put(`/admin/agents/${selectedUser._id}/verify`);
      setUsers(users.map(user => 
        user._id === selectedUser._id ? response.data.data : user
      ));
    } catch (err) {
      console.error('Error verifying agent:', err);
      setError('Failed to verify agent');
    } finally {
      handleMenuClose();
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.mobile ? (
                      <Box display="flex" alignItems="center">
                        <Phone fontSize="small" sx={{ mr: 1 }} />
                        {user.mobile}
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === 'admin' ? 'primary' : 
                        user.role === 'agent' ? 'secondary' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={user.occupation || 'Not specified'}>
                      <span>{user.occupation || '-'}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {user.role === 'agent' && (
                      <Chip 
                        label={user.isVerified ? 'Verified' : 'Unverified'} 
                        color={user.isVerified ? 'success' : 'warning'}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1">No users found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditClick}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
          {selectedUser?.role === 'agent' && !selectedUser?.isVerified && (
            <MenuItem onClick={handleVerifyAgent}>
              <VerifiedUser fontSize="small" sx={{ mr: 1 }} /> Verify Agent
            </MenuItem>
          )}
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </TableContainer>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: '400px' }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={editFormData.email}
              onChange={handleEditFormChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mobile"
              name="mobile"
              value={editFormData.mobile}
              onChange={handleEditFormChange}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Role"
              name="role"
              value={editFormData.role}
              onChange={handleEditFormChange}
              margin="normal"
              required
            >
              <MenuItem value="buyer">Buyer</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={editFormData.occupation}
              onChange={handleEditFormChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            startIcon={<Close />}
            color="secondary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            startIcon={<Save />}
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTable;