import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAgentLeads, useUpdateLeadStatus } from '@/hooks/api/agent';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils/format';

const AgentLeads = () => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contactMethodFilter, setContactMethodFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadDetailDialog, setLeadDetailDialog] = useState(false);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkStatus, setBulkStatus] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Fetch agent's contact requests
  const { data: leads, isLoading, error } = useAgentLeads(
    user?.id,
    {
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      contactMethod: contactMethodFilter !== 'all' ? contactMethodFilter : undefined,
    }
  );

  // Update lead status mutation
  const updateLeadStatusMutation = useUpdateLeadStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentLeads'] });
      setStatusUpdateDialog(false);
      setNewStatus('');
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusUpdate = () => {
    if (selectedLead && newStatus) {
      updateLeadStatusMutation.mutate({
        leadId: selectedLead._id,
        status: newStatus
      });
    }
  };

  const handleBulkStatusUpdate = () => {
    if (selectedLeads.length > 0 && bulkStatus) {
      // Update all selected leads
      Promise.all(
        selectedLeads.map(leadId =>
          updateLeadStatusMutation.mutateAsync({ leadId, status: bulkStatus })
        )
      ).then(() => {
        setBulkActionDialog(false);
        setBulkStatus('');
        setSelectedLeads([]);
      });
    }
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead._id));
    }
  };

  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setLeadDetailDialog(true);
  };

  const handleUpdateStatus = (lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setStatusUpdateDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'followup': return 'primary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />;
      case 'contacted': return <PhoneIcon />;
      case 'followup': return <EmailIcon />;
      case 'closed': return <DoneIcon />;
      default: return <PersonIcon />;
    }
  };

  const getContactMethodIcon = (method) => {
    switch (method) {
      case 'email': return <EmailIcon />;
      case 'phone': return <PhoneIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      default: return <EmailIcon />;
    }
  };

  const getContactMethodColor = (method) => {
    switch (method) {
      case 'email': return 'primary';
      case 'phone': return 'success';
      case 'whatsapp': return 'success';
      default: return 'default';
    }
  };

  const filteredLeads = leads?.data || [];

  // Group leads by status for tabs
  const pendingLeads = filteredLeads.filter(lead => lead.status === 'pending');
  const contactedLeads = filteredLeads.filter(lead => lead.status === 'contacted');
  const followupLeads = filteredLeads.filter(lead => lead.status === 'followup');
  const closedLeads = filteredLeads.filter(lead => lead.status === 'closed');

  const tabData = [
    { label: 'All', count: filteredLeads.length, data: filteredLeads },
    { label: 'Pending', count: pendingLeads.length, data: pendingLeads },
    { label: 'Contacted', count: contactedLeads.length, data: contactedLeads },
    { label: 'Follow Up', count: followupLeads.length, data: followupLeads },
    { label: 'Closed', count: closedLeads.length, data: closedLeads }
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading leads...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Lead Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all your property inquiries
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          {selectedLeads.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setBulkActionDialog(true)}
              startIcon={<EditIcon />}
            >
              Bulk Update ({selectedLeads.length})
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['agentLeads'] })}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load leads: {error.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Leads
                  </Typography>
                  <Typography variant="h4">
                    {filteredLeads.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4">
                    {pendingLeads.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Contacted
                  </Typography>
                  <Typography variant="h4">
                    {contactedLeads.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <PhoneIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Closed
                  </Typography>
                  <Typography variant="h4">
                    {closedLeads.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <DoneIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="followup">Follow Up</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Contact Method</InputLabel>
                <Select
                  value={contactMethodFilter}
                  label="Contact Method"
                  onChange={(e) => setContactMethodFilter(e.target.value)}
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="phone">Phone</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setContactMethodFilter('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Badge badgeContent={tab.count} color="primary">
                    {tab.label}
                  </Badge>
                }
              />
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Lead</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Contact Method</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tabData[activeTab].data.map((lead) => (
                  <TableRow key={lead._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          {lead.user?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="500">
                            {lead.user?.name || 'Unknown'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lead.user?.email}
                          </Typography>
                          {lead.user?.mobile && (
                            <Typography variant="body2" color="text.secondary">
                              {lead.user.mobile}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="500">
                          {lead.property?.title || 'Property'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{lead.property?.price?.toLocaleString() || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getContactMethodIcon(lead.contactMethod)}
                        label={lead.contactMethod}
                        color={getContactMethodColor(lead.contactMethod)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(lead.status)}
                        label={lead.status}
                        color={getStatusColor(lead.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(lead.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewLead(lead)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update Status">
                          <IconButton
                            size="small"
                            onClick={() => handleUpdateStatus(lead)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reply via Email">
                          <IconButton
                            size="small"
                            href={`mailto:${lead.user?.email}`}
                          >
                            <EmailIcon />
                          </IconButton>
                        </Tooltip>
                        {lead.user?.mobile && (
                          <Tooltip title="Call">
                            <IconButton
                              size="small"
                              href={`tel:${lead.user.mobile}`}
                            >
                              <PhoneIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {tabData[activeTab].data.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">
                No leads found in this category
              </Typography>
            </Box>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={leads?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={leadDetailDialog} onClose={() => setLeadDetailDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Lead Details</Typography>
            <IconButton onClick={() => setLeadDetailDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLead && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{selectedLead.user?.name?.charAt(0) || 'U'}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={selectedLead.user?.name || 'Unknown'}
                        secondary={selectedLead.user?.email}
                      />
                    </ListItem>
                    {selectedLead.user?.mobile && (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <PhoneIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Phone"
                          secondary={selectedLead.user.mobile}
                        />
                      </ListItem>
                    )}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Property Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <HomeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={selectedLead.property?.title || 'Property'}
                        secondary={`₹${selectedLead.property?.price?.toLocaleString() || 'N/A'}`}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Message</Typography>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.100' }}>
                    <Typography>{selectedLead.message}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<EmailIcon />}
                      href={`mailto:${selectedLead.user?.email}`}
                    >
                      Reply via Email
                    </Button>
                    {selectedLead.user?.mobile && (
                      <Button
                        variant="contained"
                        startIcon={<PhoneIcon />}
                        href={`tel:${selectedLead.user.mobile}`}
                      >
                        Call
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setLeadDetailDialog(false);
                        handleUpdateStatus(selectedLead);
                      }}
                    >
                      Update Status
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusUpdateDialog} onClose={() => setStatusUpdateDialog(false)}>
        <DialogTitle>Update Lead Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="followup">Follow Up</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={updateLeadStatusMutation.isLoading}
          >
            {updateLeadStatusMutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
        <DialogTitle>Bulk Update Status</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Update status for {selectedLeads.length} selected leads
          </Typography>
          <FormControl fullWidth>
            <InputLabel>New Status</InputLabel>
            <Select
              value={bulkStatus}
              label="New Status"
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="followup">Follow Up</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBulkStatusUpdate}
            variant="contained"
            disabled={updateLeadStatusMutation.isLoading || !bulkStatus}
          >
            {updateLeadStatusMutation.isLoading ? 'Updating...' : 'Update All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentLeads;