// src/pages/Admin/AdminContacts.jsx
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Button, Chip, TextField, 
    InputAdornment, IconButton, Pagination, Stack, Avatar, Badge
  } from '@mui/material';
  import { Search, Mail, Delete, Phone, WhatsApp } from '@mui/icons-material';
  import { useState, useEffect } from 'react';
  import axios from '../../services/axios';
  import { useMediaQuery, useTheme } from '@mui/material';
  import { formatDate } from '../../utils/format';
  
  const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    useEffect(() => {
      const fetchContacts = async () => {
        try {
          const response = await axios.get(`/admin/contacts?page=${page}&search=${searchTerm}`);
          setContacts(response.data.contacts);
          setTotalPages(response.data.totalPages);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load contacts');
          setLoading(false);
        }
      };
  
      fetchContacts();
    }, [page, searchTerm]);
  
    const handleDelete = async (contactId) => {
      try {
        await axios.delete(`/admin/contacts/${contactId}`);
        setContacts(contacts.filter(contact => contact._id !== contactId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete contact');
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
        <Typography color="error" align="center">
          {error}
        </Typography>
      );
    }
  
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Contact Inquiries
        </Typography>
  
        <TextField
          fullWidth
          placeholder="Search contacts..."
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
                <TableCell>Property</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={contact.user?.avatar} 
                        sx={{ mr: 2, bgcolor: theme.palette.primary.main }}
                      >
                        {contact.user?.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography>{contact.user?.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {contact.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{contact.property?.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPrice(contact.property?.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{contact.agent?.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: 200 }}>
                      {contact.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <IconButton 
                        size="small" 
                        href={`tel:${contact.user?.mobile}`}
                        color="primary"
                      >
                        <Phone fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        href={`https://wa.me/${contact.user?.mobile}`}
                        color="success"
                      >
                        <WhatsApp fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(contact._id)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
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
      </Box>
    );
  };
  
  export default AdminContacts;