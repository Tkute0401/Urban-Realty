"use client";
import React from 'react';
import { Avatar, Box, Button, Chip, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export type RecentProperty = {
  _id: string;
  title: string;
  images?: string[];
  location?: string;
  agent?: { name?: string };
  price?: number;
  status?: string;
  views?: number;
};

type RecentPropertiesTableProps = {
  properties: RecentProperty[];
};

const RecentPropertiesTable: React.FC<RecentPropertiesTableProps> = ({ properties }) => {
  const router = useRouter();
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">Recent Properties</Typography>
        <Button variant="outlined" size="small" onClick={() => router.push('/admin/properties')}>View All</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.slice(0, 5).map((property) => (
              <TableRow key={property._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={property.images?.[0]} variant="rounded" sx={{ width: 50, height: 50 }}>
                      <HomeIcon />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="500">{property.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        <LocationOnIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        {property.location}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{property.agent?.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="500">₹{property.price?.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={property.status || 'active'} color={property.status === 'active' ? 'success' : 'warning'} size="small" />
                </TableCell>
                <TableCell>
                  <Typography>{property.views || 0}</Typography>
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

export default RecentPropertiesTable;

