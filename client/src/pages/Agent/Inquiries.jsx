// src/pages/agent/Inquiries.jsx
import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField,
  TablePagination,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from '../../services/axios';
import { formatDate } from '../../utils/format';
import { useAuth } from '../../context/AuthContext';

const AgentInquiries = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  const { data, isLoading } = useQuery(
    ['agentInquiries', page, rowsPerPage, searchTerm], 
    async () => {
      const res = await axios.get(
        `/inquiries/my-inquiries?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`
      );
      return res.data;
    }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setOpenDialog(true);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Inquiries
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search inquiries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((inquiry) => (
              <TableRow 
                key={inquiry._id} 
                hover 
                onClick={() => handleViewInquiry(inquiry)}
                sx={{ cursor: 'pointer', backgroundColor: inquiry.read ? 'inherit' : 'action.hover' }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                      {inquiry.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography fontWeight="bold">{inquiry.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {inquiry.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {inquiry.property?.title || 'N/A'}
                </TableCell>
                <TableCell>
                  {formatDate(inquiry.createdAt)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={inquiry.read ? 'Read' : 'New'} 
                    color={inquiry.read ? 'default' : 'primary'} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleViewInquiry(inquiry);
                  }}>
                    <EmailIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.count || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Inquiry Details</Typography>
            <IconButton onClick={() => setOpenDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedInquiry && (
            <>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  From: {selectedInquiry.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Email: {selectedInquiry.email}
                </Typography>
                {selectedInquiry.phone && (
                  <Typography variant="body1" gutterBottom>
                    Phone: {selectedInquiry.phone}
                  </Typography>
                )}
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Regarding Property: {selectedInquiry.property?.title || 'N/A'}
                </Typography>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Message:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.100' }}>
                  <Typography>{selectedInquiry.message}</Typography>
                </Paper>
              </Box>

              <Box display="flex" gap={2}>
                <Button 
                  variant="contained" 
                  startIcon={<EmailIcon />}
                  href={`mailto:${selectedInquiry.email}`}
                >
                  Reply via Email
                </Button>
                {selectedInquiry.phone && (
                  <Button 
                    variant="contained" 
                    startIcon={<PhoneIcon />}
                    href={`tel:${selectedInquiry.phone}`}
                  >
                    Call
                  </Button>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentInquiries;