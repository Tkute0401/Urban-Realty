// src/pages/Admin/AdminUsers.jsx
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Button, Chip, TextField, 
    InputAdornment, IconButton, Pagination, Stack, Avatar 
  } from '@mui/material';
  import { Search, Edit, Delete, PersonAdd } from '@mui/icons-material';
  import { useState, useEffect } from 'react';
  import axios from '../../services/axios';
  // import UserEditDialog from '../../components/Admin/UserEditDialog';
  // import UserDeleteDialog from '../../components/Admin/UserDeleteDialog';
  import { useMediaQuery, useTheme } from '@mui/material';
  
  const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`/admin/users?page=${page}&search=${searchTerm}`);
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load users');
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, [page, searchTerm]);
  
    const handleEditOpen = (user) => {
      setSelectedUser(user);
      setEditOpen(true);
    };
  
    const handleDeleteOpen = (user) => {
      setSelectedUser(user);
      setDeleteOpen(true);
    };
  
    const handleUserUpdated = (updatedUser) => {
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      console.log("    ");
    };
  
    const handleUserDeleted = (userId) => {
      setUsers(users.filter(user => user._id !== userId));
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
        <Typography color="error" align="center">
          {error}
        </Typography>
      );
    }
  
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" gutterBottom>
            User Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<PersonAdd />}
            onClick={() => handleEditOpen({})}
          >
            Add User
          </Button>
        </Box>
  
        <TextField
          fullWidth
          placeholder="Search users..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={user.avatar} 
                        sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === 'admin' ? 'primary' : 
                        user.role === 'agent' ? 'secondary' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(user)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOpen(user)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
{/*   
        <UserEditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
  
        <UserDeleteDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          user={selectedUser}
          onUserDeleted={handleUserDeleted}
        /> */}
      </Box>
    );
  };
  
  export default AdminUsers;