// src/pages/admin/AdminInquiries.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Chip, Button, IconButton, 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, 
  CircularProgress, Avatar 
} from '@mui/material';
import { 
  Edit, Delete, Email, Check, 
  Close, ArrowForward 
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentInquiry, setCurrentInquiry] = useState(null);
  const [status, setStatus] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/inquiries');
      setInquiries(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (inquiry) => {
    setCurrentInquiry(inquiry);
    setStatus(inquiry.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentInquiry(null);
  };

  const handleStatusChange = async () => {
    try {
      await axios.patch(`/api/v1/admin/inquiries/${currentInquiry._id}/status`, {
        status
      });
      fetchInquiries();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await axios.delete(`/api/v1/admin/inquiries/${inquiryId}`);
        fetchInquiries();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete inquiry');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'default';
      case 'contacted': return 'primary';
      case 'completed': return 'success';
      case 'rejected': return 'error';
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
        <Typography variant="h4">Inquiry Management</Typography>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries.map((inquiry) => (
                <TableRow key={inquiry._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>
                        <Email />
                      </Avatar>
                      <Box>
                        <Typography fontWeight="500">{inquiry.from.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inquiry.from.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {inquiry.property?.title || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ maxWidth: isMobile ? 100 : 200 }}>
                      {inquiry.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={inquiry.status} 
                      color={getStatusColor(inquiry.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenDialog(inquiry)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(inquiry._id)}>
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
          Update Inquiry Status
          <IconButton 
            onClick={handleCloseDialog} 
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              From: {currentInquiry?.from.name} ({currentInquiry?.from.email})
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Property: {currentInquiry?.property?.title || 'N/A'}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
              {currentInquiry?.message}
            </Typography>
          </Box>
          <Box mb={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              margin="normal"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained" 
            startIcon={<Check />}
            onClick={handleStatusChange}
          >
            Update
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Close />}
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminInquiries;