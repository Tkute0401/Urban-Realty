import { Typography, Box } from '@mui/material';
import UsersTable from './UsersTable';

const AdminUsers = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <UsersTable />
    </Box>
  );
};

export default AdminUsers;