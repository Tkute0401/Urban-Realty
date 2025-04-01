import { Typography, Box } from '@mui/material';
import PropertiesTable from '../components/PropertiesTable';

const AdminProperties = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Property Management</Typography>
      <PropertiesTable />
    </Box>
  );
};

export default AdminProperties;