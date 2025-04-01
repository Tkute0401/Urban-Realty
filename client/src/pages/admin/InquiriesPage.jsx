// src/pages/admin/InquiriesPage.jsx
import { useState, useEffect } from 'react';
import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Chip } from '@mui/material';
import { Mail, Phone, Check, Close } from '@mui/icons-material';
import axios from '../../services/axios';
import { formatDate } from '../../utils/format';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get('/api/v1/admin/inquiries');
        setInquiries(response.data.data);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      await axios.patch(`/api/v1/admin/inquiries/${inquiryId}/status`, { status: newStatus });
      setInquiries(inquiries.map(inquiry => 
        inquiry._id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
      ));
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Contact Inquiries
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inquiries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((inquiry) => (
                  <TableRow hover key={inquiry._id}>
                    <TableCell>
                      <Typography variant="subtitle2">{inquiry.property.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{inquiry.from.name}</Typography>
                        <Typography variant="body2">{inquiry.from.email}</Typography>
                        <Typography variant="body2">{inquiry.from.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{inquiry.to.name}</Typography>
                        <Typography variant="body2">{inquiry.to.email}</Typography>
                        <Typography variant="body2">{inquiry.to.phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" noWrap>
                          {inquiry.message}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={inquiry.status}
                        color={
                          inquiry.status === 'pending' ? 'default' :
                          inquiry.status === 'contacted' ? 'primary' :
                          inquiry.status === 'completed' ? 'success' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Mail />}
                          onClick={() => handleStatusChange(inquiry._id, 'contacted')}
                        >
                          Contacted
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Check />}
                          onClick={() => handleStatusChange(inquiry._id, 'completed')}
                        >
                          Complete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={inquiries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default InquiriesPage;