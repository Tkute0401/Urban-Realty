'use client'

import { BottomNavigation, BottomNavigationAction, Paper, useMediaQuery, useTheme } from '@mui/material';
import { Home, Search, Add, Favorite, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isMobile) return null;

  const handleNavigation = (newValue: string) => {
    router.push(newValue);
  };

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      borderTop: '1px solid',
      borderColor: 'divider'
    }} elevation={3}>
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(event, newValue) => {
          handleNavigation(newValue);
        }}
        sx={{
          backgroundColor: 'background.paper',
          '& .Mui-selected': {
            color: 'primary.main'
          }
        }}
      >
        <BottomNavigationAction 
          label="Home" 
          value="/" 
          icon={<Home />} 
        />
        <BottomNavigationAction 
          label="Browse" 
          value="/properties" 
          icon={<Search />} 
        />
        {user?.role === 'agent' && (
          <BottomNavigationAction 
            label="Add" 
            value="/properties/add" 
            icon={<Add />} 
          />
        )}
        <BottomNavigationAction 
          label="Profile" 
          value={user ? "/user/profile" : "/login"} 
          icon={<Person />} 
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNav;