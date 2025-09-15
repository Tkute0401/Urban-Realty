'use client'

import { useEffect, useState } from 'react';
import type React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Box, Typography, Avatar, Button, Paper, Divider, Chip, 
  Tabs, Tab, Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite, Person, ExitToApp, Edit, AdminPanelSettings } from '@mui/icons-material';
import { useProperties } from '../../../contexts/PropertiesContext';
import apiService from '@/lib/services/apiService';
import PropertyCard from '../../../components/home/PropertyCard';
import FavoritesGrid from '../../../components/user/FavoritesGrid';
  

// Favorites grid moved to reusable component

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: 'var(--color-bg-dark)',
  color: 'var(--color-text-inverse)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  border: `2px solid var(--color-primary)`,
  fontFamily: '"Poppins", sans-serif',
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-bg-dark)',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: '8px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: 'var(--color-primary-hover)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(120, 202, 220, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const { properties, getAgentProperties, agentProperties } = useProperties();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      getAgentProperties(user);
    }
  }, [user, getAgentProperties]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      setLoadingFavorites(true);
      try {
        const res = await apiService.getFavorites() as { data: any };
        // Normalize API shape
        const items = Array.isArray(res?.data?.data) ? res.data.data : (res?.data || []);
        setFavorites(items);
      } catch (e) {
        setFavorites([]);
      } finally {
        setLoadingFavorites(false);
      }
    };
    loadFavorites();
  }, [user]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleEditProfile = () => {
    router.push('/user/profile/edit');
  };

  const handleManageSubscription = () => {
    router.push('/subscription-management');
  };

  const handleAdminDashboard = () => {
    router.push('/admin');
  };

  const handleViewProperty = (propertyId: number) => {
    router.push(`/properties/${propertyId}`);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8,
      px: 2,
      background: 'linear-gradient(to bottom, var(--color-bg-dark) 0%, var(--color-bg-secondary) 100%)',
      fontFamily: '"Poppins", sans-serif'
    }}>
      <ProfileCard elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
          >
            <Tab 
              value="profile" 
              label="Profile" 
              icon={<Person />} 
              iconPosition="start"
              sx={{ color: 'var(--color-primary)' }}
            />
            <Tab 
              value="favorites" 
              label="Favorites" 
              icon={<Favorite />} 
              iconPosition="start"
              sx={{ color: 'var(--color-primary)' }}
            />
          </Tabs>
        </Box>

        {activeTab === 'profile' ? (
          <>
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
                  border: '3px solid var(--color-primary)',
                  boxShadow: '0 4px 20px rgba(120, 202, 220, 0.4)',
                }}
                src={user?.avatar}
              />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {user?.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={user?.role} 
                    sx={{ 
                      backgroundColor: 'var(--color-primary)', 
                      color: 'var(--color-bg-dark)',
                      fontWeight: 600,
                    }} 
                  />
                </Box>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                
                {user?.phone && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {user?.phone}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 3,
              mt: 4,
              flexWrap: 'wrap'
            }}>
              <Button
                variant="contained"
                startIcon={<ExitToApp />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: 'var(--color-error)',
                  '&:hover': { backgroundColor: 'var(--color-error-hover)' }
                }}
              >
                Logout
              </Button>
              
              <Button 
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditProfile}
                sx={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-dark)' }}
              >
                Edit Profile
              </Button>
              
              <Button 
                variant="contained"
                startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M12 11v6"></path>
                  <path d="M9 14l3 3 3-3"></path>
                </svg>}
                onClick={handleManageSubscription}
                sx={{ backgroundColor: 'var(--color-warning)', color: 'var(--color-bg-dark)' }}
              >
                Manage Subscription
              </Button>
              
              {user?.role === 'admin' && (
                <Button 
                  variant="contained"
                  startIcon={<AdminPanelSettings />}
                  onClick={handleAdminDashboard}
                  sx={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg-dark)' }}
                >
                  Admin Dashboard
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-primary)' }}>
              Your Favorite Properties
            </Typography>
            {loadingFavorites ? (
              <Typography>Loading...</Typography>
            ) : (
              <FavoritesGrid items={favorites} onView={handleViewProperty} />
            )}
          </Box>
        )}
        {user?.role === 'agent' && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-primary)' }}>
              Your Properties
            </Typography>
            
            <Grid container spacing={3}>
              {agentProperties.map((property, index) => (
                <Grid item xs={12} sm={6} key={property._id}>
                  <PropertyCard property={property} index={index} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </ProfileCard>
    </Box>
  );
};

export default Profile;