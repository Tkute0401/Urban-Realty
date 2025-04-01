// src/pages/admin/AdminInquiries.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, 
  IconButton, CircularProgress, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Avatar
} from '@mui/material';
import { 
  Mail, Delete, Search, Refresh, 
  CheckCircle, Pending, Cancel
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/format';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const navigate = useNavigate();

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/admin/inquiries';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await axios.get(url);
      setInquiries(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleDeleteInquiry = async () => {
    try {
      await axios.delete(`/admin/inquiries/${selectedInquiry._id}`);
      setOpenDeleteDialog(false);
      fetchInquiries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete inquiry');
    }
  };

  const updateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await axios.patch(`/admin/inquiries/${inquiryId}/status`, {
        status: newStatus
      });
      fetchInquiries();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update inquiry status');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    inquiry.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.from.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusIcons = {
    pending: <Pending color="warning" />,
    contacted: <CheckCircle color="info" />,
    completed: <CheckCircle color="success" />,
    rejected: <Cancel color="error" />
  };

  if (loading && inquiries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Inquiry Management</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Refresh />}
          onClick={fetchInquiries}
        >
          Refresh
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
          placeholder="Search inquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
        />
        
        <TextField
          select
          variant="outlined"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="contacted">Contacted</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>From</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow 
                  key={inquiry._id} 
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/inquiries/${inquiry._id}`)}
                >
                  <TableCell>
                    <Typography fontWeight="500">
                      {inquiry.property?.title || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar>
                        {inquiry.from.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography>{inquiry.from.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inquiry.from.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {statusIcons[inquiry.status]}
                      <Chip 
                        label={inquiry.status} 
                        size="small"
                        sx={{
                          backgroundColor: inquiry.status === 'pending' ? 'warning.light' : 
                                          inquiry.status === 'completed' ? 'success.light' : 
                                          inquiry.status === 'rejected' ? 'error.light' : 'info.light',
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInquiry(inquiry);
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
          Are you sure you want to delete this inquiry? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteInquiry} 
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

export default AdminInquiries;