import { Box, Typography, Avatar, Button, Paper, Divider, Chip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { styled } from '@mui/material/styles';

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: '#0B1011',
  color: '#fff',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  border: `2px solid #78CADC`,
  fontFamily: '"Poppins", sans-serif',
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#78CADC',
  color: '#0B1011',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: '8px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#5fb4c9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(120, 202, 220, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8,
      px: 2,
      background: 'linear-gradient(to bottom, #0B1011 0%, #1a2a32 100%)',
      fontFamily: '"Poppins", sans-serif'
    }}>
      <ProfileCard elevation={3}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: '#78CADC',
            mb: 4,
            textAlign: 'center',
            fontFamily: '"Poppins", sans-serif'
          }}
        >
          My Profile
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center', 
          gap: 4,
          mb: 4
        }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              border: '3px solid #78CADC',
              boxShadow: '0 4px 20px rgba(120, 202, 220, 0.4)',
              fontFamily: '"Poppins", sans-serif'
            }}
            src={user?.avatar}
          />
          
          <Box sx={{ flex: 1, fontFamily: '"Poppins", sans-serif' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, fontFamily: '"Poppins", sans-serif' }}>
              {user?.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip 
                label={user?.role} 
                sx={{ 
                  backgroundColor: '#78CADC', 
                  color: '#0B1011',
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif'
                }} 
              />
            </Box>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
            
            <Typography variant="body1" sx={{ mb: 1, fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}>
              <strong style={{ fontWeight: 500 }}>Email:</strong> {user?.email}
            </Typography>
            
            {user?.phone && (
              <Typography variant="body1" sx={{ mb: 1, fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}>
                <strong style={{ fontWeight: 500 }}>Phone:</strong> {user?.phone}
              </Typography>
            )}
            
            {user?.joinedDate && (
              <Typography variant="body1" sx={{ mb: 1, fontFamily: '"Poppins", sans-serif', fontWeight: 400 }}>
                <strong style={{ fontWeight: 500 }}>Member Since:</strong> {new Date(user.joinedDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 3,
          mt: 4,
          flexWrap: 'wrap',
          fontFamily: '"Poppins", sans-serif'
        }}>
          <ProfileButton 
            variant="contained"
            onClick={logout}
            sx={{
              backgroundColor: '#e74c3c',
              '&:hover': {
                backgroundColor: '#c0392b'
              }
            }}
          >
            Logout
          </ProfileButton>
          
          <ProfileButton variant="contained">
            Edit Profile
          </ProfileButton>
          
          {user?.role === 'admin' && (
            <ProfileButton variant="contained">
              Admin Dashboard
            </ProfileButton>
          )}
        </Box>
      </ProfileCard>
    </Box>
  );
};

export default Profile;