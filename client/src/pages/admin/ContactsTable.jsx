import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Pagination,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CheckCircle as ResolvedIcon,
  Warning as PendingIcon,
  Schedule as ScheduledIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const ContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [editingContact, setEditingContact] = useState({});

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/contacts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setContacts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = async () => {
    try {
      await axios.put(`/admin/contacts/${editingContact._id}`, editingContact, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchContacts();
      setEditDialogOpen(false);
      setEditingContact({});
    } catch (err) {
      console.error('Error updating contact:', err);
      setError('Failed to update contact. Please try again.');
    }
  };

  const handleDeleteContact = async () => {
    try {
      await axios.delete(`/admin/contacts/${selectedContact._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchContacts();
      setDeleteDialogOpen(false);
      setSelectedContact(null);
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact. Please try again.');
    }
  };

  const handleStatusChange = async (contactId, status) => {
    try {
      await axios.put(`/admin/contacts/${contactId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchContacts();
    } catch (err) {
      console.error('Error updating contact status:', err);
      setError('Failed to update contact status. Please try again.');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    const matchesType = filterType === 'all' || contact.type === filterType;
    const matchesPriority = filterPriority === 'all' || contact.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'pending': return 'warning';
      case 'scheduled': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <ResolvedIcon />;
      case 'pending': return <PendingIcon />;
      case 'scheduled': return <ScheduledIcon />;
      case 'cancelled': return <DeleteIcon />;
      default: return <MessageIcon />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'inquiry': return 'primary';
      case 'complaint': return 'error';
      case 'feedback': return 'success';
      case 'appointment': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
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
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="inquiry">Inquiry</MenuItem>
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchContacts}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentContacts.map((contact) => (
              <TableRow key={contact._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {contact.name?.charAt(0) || contact.email?.charAt(0) || 'C'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{contact.name || 'No Name'}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {contact.email}
                      </Typography>
                      {contact.phone && (
                        <Typography variant="caption" color="textSecondary">
                          📞 {contact.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={contact.type || 'general'} 
                    color={getTypeColor(contact.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={contact.priority || 'medium'} 
                    color={getPriorityColor(contact.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={contact.status || 'pending'} 
                    color={getStatusColor(contact.status)}
                    size="small"
                    icon={getStatusIcon(contact.status)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(contact.createdAt).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedContact(contact);
                          setViewDialogOpen(true);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Contact">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setEditingContact(contact);
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Contact">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          setSelectedContact(contact);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredContacts.length / contactsPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>

      {/* View Contact Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Contact Details</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            {selectedContact.name?.charAt(0) || selectedContact.email?.charAt(0) || 'C'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedContact.name || 'No Name'}
                          secondary="Full Name"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <EmailIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedContact.email}
                          secondary="Email Address"
                        />
                      </ListItem>
                      {selectedContact.phone && (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <PhoneIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={selectedContact.phone}
                            secondary="Phone Number"
                          />
                        </ListItem>
                      )}
                      {selectedContact.location && (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                              <LocationIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={selectedContact.location}
                            secondary="Location"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Request Details</Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            <MessageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedContact.type || 'General'}
                          secondary="Request Type"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'error.main' }}>
                            <BusinessIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedContact.priority || 'Medium'}
                          secondary="Priority Level"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <CalendarIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={new Date(selectedContact.createdAt).toLocaleDateString()}
                          secondary="Submission Date"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(selectedContact.status) }}>
                            {getStatusIcon(selectedContact.status)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedContact.status || 'Pending'}
                          secondary="Current Status"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Message</Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedContact.message || 'No message provided'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setViewDialogOpen(false);
              setEditingContact(selectedContact);
              setEditDialogOpen(true);
            }}
          >
            Edit Contact
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editingContact.name || ''}
                onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editingContact.email || ''}
                onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={editingContact.phone || ''}
                onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={editingContact.type || 'inquiry'}
                  onChange={(e) => setEditingContact({ ...editingContact, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="inquiry">Inquiry</MenuItem>
                  <MenuItem value="complaint">Complaint</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="appointment">Appointment</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={editingContact.priority || 'medium'}
                  onChange={(e) => setEditingContact({ ...editingContact, priority: e.target.value })}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingContact.status || 'pending'}
                  onChange={(e) => setEditingContact({ ...editingContact, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                value={editingContact.message || ''}
                onChange={(e) => setEditingContact({ ...editingContact, message: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditContact}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete contact from "{selectedContact?.name || selectedContact?.email}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteContact}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactsTable;