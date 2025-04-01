import { Typography, Box } from '@mui/material';
import ContactsTable from '../components/ContactsTable';

const AdminContacts = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Contact Requests</Typography>
      <ContactsTable />
    </Box>
  );
};

export default AdminContacts;