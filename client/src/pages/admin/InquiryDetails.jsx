// src/pages/admin/InquiryDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Avatar, 
  Divider, Chip, CircularProgress, Alert,
  TextField, MenuItem
} from '@mui/material';
import { 
  ArrowBack, Mail, Phone, Home, 
  CheckCircle, Pending, Cancel
} from '@mui/icons-material';
import axios from '../../services/axios';
import { formatDate } from '../../utils/format';

const InquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');

  const fetchInquiry = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/v1/admin/inquiries/${id}`);
      setInquiry(response.data.data);
      setStatus(response.data.data.status);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inquiry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiry();
  }, [id]);

  const updateStatus = async () => {
    try {
      await axios.patch(`/api/v1/admin/inquiries/${id}/status`, { status });
      fetchInquiry();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const statusIcons = {
    pending: <Pending color="warning" />,
    contacted: <CheckCircle color="info" />,
    completed: <CheckCircle color="success" />,
    rejected: <Cancel color="error" />
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/inquiries')}
        >
          Back to Inquiries
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/admin/inquiries')}
        sx={{ mb: 3 }}
      >
        Back to Inquiries
      </Button>

      <Typography variant="h4" gutterBottom>
        Inquiry Details
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" gutterBottom>
              Property: {inquiry.property?.title || 'N/A'}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Home color="action" />
              <Typography color="text.secondary">
                {inquiry.property?.address?.city || 'N/A'}, {inquiry.property?.address?.state || 'N/A'}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {statusIcons[inquiry.status]}
            <Chip 
              label={inquiry.status} 
              sx={{
                backgroundColor: inquiry.status === 'pending' ? 'warning.light' : 
                                inquiry.status === 'completed' ? 'success.light' : 
                                inquiry.status === 'rejected' ? 'error.light' : 'info.light',
                textTransform: 'capitalize'
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            From
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ width: 56, height: 56 }}>
              {inquiry.from.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{inquiry.from.name}</Typography>
              <Typography color="text.secondary">{inquiry.from.email}</Typography>
              <Typography color="text.secondary">{inquiry.from.phone}</Typography>
            </Box>
          </Box>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            To (Agent)
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ width: 56, height: 56 }}>
              {inquiry.to.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{inquiry.to.name}</Typography>
              <Typography color="text.secondary">{inquiry.to.email}</Typography>
              <Typography color="text.secondary">{inquiry.to.phone}</Typography>
            </Box>
          </Box>
        </Box>

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Message
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography>{inquiry.message}</Typography>
          </Paper>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Inquiry Date: {formatDate(inquiry.createdAt)}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Update Status
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <TextField
            select
            fullWidth
            size="small"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ maxWidth: 200 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="contacted">Contacted</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
          
          <Button 
            variant="contained" 
            onClick={updateStatus}
            disabled={status === inquiry.status}
          >
            Update
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default InquiryDetails;