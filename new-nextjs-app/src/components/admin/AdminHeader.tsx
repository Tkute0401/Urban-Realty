"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Button } from '@mui/material';
import { Menu as MenuIcon, AccountCircle } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  console.log('🔧 AdminHeader rendering...');
  
  React.useEffect(() => {
    console.log('🔧 AdminHeader mounted on client side!');
  }, []);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    router.push('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-primary)',
        boxShadow: 'none',
        borderBottom: '1px solid var(--color-border-light)'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Admin Panel
        </Typography>
        
        <Button
          variant="text"
          color="inherit"
          component={Link}
          href="/"
          sx={{ mr: 2 }}
        >
          Home
        </Button>
        
        <div>
          <IconButton
            onClick={handleMenuOpen}
            color="inherit"
          >
            {user?.name ? (
              <Avatar sx={{ width: 32, height: 32 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              router.push('/profile');
            }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;