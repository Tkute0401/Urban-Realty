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
  TablePagination,
  TextField,
  InputAdornment,
  Avatar
} from '@mui/material';
import { MoreVert, Delete, Visibility, Mail, Phone, WhatsApp, Search } from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/format';
import { formatPrice } from '../../utils/format';

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/admin/contacts');
        setContacts(response.data.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, []);

  const handleMenuOpen = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/contacts/${selectedContact._id}`);
      setContacts(contacts.filter(contact => contact._id !== selectedContact._id));
    } catch (err) {
      console.error('Error deleting contact:', err);
    } finally {
      handleMenuClose();
    }
  };

  const handleViewProperty = () => {
    navigate(`/properties/${selectedContact.property._id}`);
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContactMethodIcon = (method) => {
    switch (method) {
      case 'email':
        return <Mail color="primary" />;
      case 'phone':
        return <Phone color="primary" />;
      case 'whatsapp':
        return <WhatsApp color="success" />;
      default:
        return <Mail color="primary" />;
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
    <Paper>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.length > 0 ? (
              filteredContacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(contact => (
                  <TableRow key={contact._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={contact.user?.avatar}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {contact.user?.name?.charAt(0)}
                        </Avatar>
                        <Typography>{contact.user?.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{contact.property?.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatPrice(contact.property?.price)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getContactMethodIcon(contact.contactMethod)}
                    </TableCell>
                    <TableCell>
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={contact.status} 
                        color={
                          contact.status === 'pending' ? 'default' :
                          contact.status === 'contacted' ? 'primary' :
                          contact.status === 'completed' ? 'success' : 'error'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, contact)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No contacts found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredContacts.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredContacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewProperty}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Property
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ContactsTable;