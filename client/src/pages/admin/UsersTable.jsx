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
  CircularProgress
} from '@mui/material';
import { MoreVert, Edit, Delete, VerifiedUser } from '@mui/icons-material';
import axios from '../../services/axios';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/v1/admin/users');
        setUsers(response.data.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/admin/users/${selectedUser._id}`);
      setUsers(users.filter(user => user._id !== selectedUser._id));
    } catch (err) {
      console.error('Error deleting user:', err);
    } finally {
      handleMenuClose();
    }
  };

  const handleVerifyAgent = async () => {
    try {
      const response = await axios.put(`/api/v1/admin/agents/${selectedUser._id}/verify`);
      setUsers(users.map(user => 
        user._id === selectedUser._id ? response.data.data : user
      ));
    } catch (err) {
      console.error('Error verifying agent:', err);
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user._id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip 
                  label={user.role} 
                  color={user.role === 'admin' ? 'primary' : 'default'}
                />
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
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
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
  );
};

export default UsersTable;