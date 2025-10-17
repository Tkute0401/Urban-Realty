'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
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
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Badge,
  Tooltip
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Message as MessageIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useContactRequests, useUpdateContactRequest, useDeleteContactRequest } from '@/hooks/useContact';
import { formatDistanceToNow } from 'date-fns';

interface ContactDashboardProps {
  userRole: 'agent' | 'developer' | 'admin';
  userId?: string;
}

const ContactDashboard: React.FC<ContactDashboardProps> = ({ userRole, userId }) => {
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const { data: contactRequests, isLoading, refetch } = useContactRequests({
    role: userRole,
    userId: userId,
    status: statusFilter === 'all' ? undefined : statusFilter
  });

  const updateContactMutation = useUpdateContactRequest();
  const deleteContactMutation = useDeleteContactRequest();

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, contact: any) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleActionClose = () => {
    setActionMenuAnchor(null);
    setSelectedContact(null);
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedContact) return;

    try {
      await updateContactMutation.mutateAsync({
        id: selectedContact._id,
        status,
        response: responseText || undefined
      });
      handleActionClose();
      setResponseDialogOpen(false);
      setResponseText('');
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedContact) return;

    try {
      await deleteContactMutation.mutateAsync(selectedContact._id);
      handleActionClose();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleDirectContact = (method: 'phone' | 'email' | 'whatsapp') => {
    if (!selectedContact) return;

    const message = `Hi ${selectedContact.user.name}, thank you for your interest. I'll get back to you soon.`;

    switch (method) {
      case 'phone':
        if (selectedContact.user.mobile) {
          window.open(`tel:${selectedContact.user.mobile}`);
        }
        break;
      case 'email':
        if (selectedContact.user.email) {
          window.open(`mailto:${selectedContact.user.email}?subject=Re: Your Inquiry&body=${encodeURIComponent(message)}`);
        }
        break;
      case 'whatsapp':
        const phoneNumber = selectedContact.user.mobile?.replace(/\D/g, '');
        if (phoneNumber) {
          window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        }
        break;
    }
    handleActionClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'completed': return 'success';
      case 'spam': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />;
      case 'contacted': return <MessageIcon />;
      case 'completed': return <CheckCircleIcon />;
      case 'spam': return <CancelIcon />;
      default: return null;
    }
  };

  const filteredContacts = contactRequests?.data?.filter((contact: any) => {
    const matchesSearch = searchQuery === '' || 
      contact.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.property?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];

  const stats = {
    total: contactRequests?.data?.length || 0,
    pending: contactRequests?.data?.filter((c: any) => c.status === 'pending').length || 0,
    contacted: contactRequests?.data?.filter((c: any) => c.status === 'contacted').length || 0,
    completed: contactRequests?.data?.filter((c: any) => c.status === 'completed').length || 0
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading contact requests...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Contact Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Contacts
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Contacted
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {stats.contacted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="spam">Spam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contact</TableCell>
                <TableCell>Property/Project</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Contact Method</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContacts.map((contact: any) => (
                <TableRow key={contact._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={contact.user.avatar}
                        sx={{ width: 40, height: 40 }}
                      >
                        {contact.user.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {contact.user.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {contact.user.email}
                        </Typography>
                        {contact.user.mobile && (
                          <Typography variant="body2" color="textSecondary">
                            {contact.user.mobile}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {contact.property ? (
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {contact.property.title}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          ₹{contact.property.price?.toLocaleString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        General Inquiry
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {contact.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={contact.contactMethod === 'phone' ? <PhoneIcon /> : 
                            contact.contactMethod === 'email' ? <EmailIcon /> : 
                            <WhatsAppIcon />}
                      label={contact.contactMethod}
                      size="small"
                      color={contact.contactMethod === 'phone' ? 'success' : 
                             contact.contactMethod === 'email' ? 'primary' : 
                             'success'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(contact.status)}
                      label={contact.status}
                      size="small"
                      color={getStatusColor(contact.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleActionClick(e, contact)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={() => setResponseDialogOpen(true)}>
          <ListItemIcon>
            <ReplyIcon />
          </ListItemIcon>
          <ListItemText>Respond</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('contacted')}>
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText>Mark as Contacted</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('completed')}>
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText>Mark as Completed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('spam')}>
          <ListItemIcon>
            <CancelIcon />
          </ListItemIcon>
          <ListItemText>Mark as Spam</ListItemText>
        </MenuItem>
        <Divider />
        {selectedContact?.user.mobile && (
          <MenuItem onClick={() => handleDirectContact('phone')}>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText>Call</ListItemText>
          </MenuItem>
        )}
        {selectedContact?.user.email && (
          <MenuItem onClick={() => handleDirectContact('email')}>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText>Email</ListItemText>
          </MenuItem>
        )}
        {selectedContact?.user.mobile && (
          <MenuItem onClick={() => handleDirectContact('whatsapp')}>
            <ListItemIcon>
              <WhatsAppIcon />
            </ListItemIcon>
            <ListItemText>WhatsApp</ListItemText>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onClose={() => setResponseDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Respond to Contact</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleStatusUpdate('contacted')} 
            variant="contained"
            disabled={!responseText.trim()}
          >
            Send Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactDashboard;
