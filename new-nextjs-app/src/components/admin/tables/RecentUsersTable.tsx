"use client";
import React from 'react';
import { Avatar, Box, Button, Chip, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/navigation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import { formatDate } from '@/lib/utils/format';

export type RecentUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
};

type RecentUsersTableProps = {
  users: RecentUser[];
};

const RecentUsersTable: React.FC<RecentUsersTableProps> = ({ users }) => {
  const router = useRouter();
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Recent Users</Typography>
        <Button variant="outlined" size="small" onClick={() => router.push('/admin/users')}>View All</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(0, 5).map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{user.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight="500">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={user.role} color={user.role === 'admin' ? 'error' : user.role === 'agent' ? 'warning' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={user.status || 'active'} color={user.status === 'active' ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
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

export default RecentUsersTable;

