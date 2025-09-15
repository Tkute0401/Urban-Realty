"use client";
import React from 'react';
import { Avatar, Box, Button, Chip, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils/format';

export type RecentContact = {
  _id: string;
  user?: { name?: string; email?: string };
  property?: { title?: string };
  status: string;
  createdAt: string;
};

type RecentContactsTableProps = {
  contacts: RecentContact[];
};

const RecentContactsTable: React.FC<RecentContactsTableProps> = ({ contacts }) => {
  const router = useRouter();
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Recent Contacts</Typography>
        <Button variant="outlined" size="small" onClick={() => router.push('/admin/contacts')}>View All</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.slice(0, 5).map((contact) => (
              <TableRow key={contact._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{contact.user?.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight="500">{contact.user?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{contact.user?.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{contact.property?.title}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={contact.status} color={contact.status === 'pending' ? 'warning' : 'success'} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatDate(contact.createdAt)}</Typography>
                </TableCell>
                <TableCell>
                  <IconButton size="small"><MoreVertIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentContactsTable;

