// src/pages/User/Profile.jsx
import { Box, Typography, Avatar, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar 
          sx={{ width: 64, height: 64, mr: 2 }}
          src={user?.avatar}
        />
        <Box>
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {user?.role}
          </Typography>
        </Box>
      </Box>

      <Button 
        variant="contained" 
        color="error"
        onClick={logout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Profile;