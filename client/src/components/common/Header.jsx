import { 
  AppBar, 
  Avatar,
  Box, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Toolbar, 
  Typography, 
  useMediaQuery 
} from "@mui/material";
import { 
  Add, 
  Home, 
  List, 
  Login, 
  Person, 
  PersonAdd, 
  Menu as MenuIcon 
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      backgroundColor: 'background.paper',
      color: 'text.primary',
      borderBottom: '1px solid',
      borderColor: 'divider',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
    }}>
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3, md: 4 },
        py: 1
      }}>
        {/* Logo/Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'none',
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
              fontWeight: 700,
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            <Home color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }} />
            <Typography variant="h6" component="span" sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              Urban Realty
            </Typography>
          </Button>
        </Box>
        {user?.role === 'admin' && (<Button 
          component={Link} 
          to="/admin">
            Admin
          </Button>)}
        {/* Navigation Links */}
        {isMobile ? (
          <>

            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              size="large"
              sx={{
                color: 'text.primary'
              }}
            >
              <MenuIcon fontSize="medium" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  width: 280,
                  maxWidth: '100%',
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                },
              }}
              MenuListProps={{
                sx: {
                  py: 0
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem 
                component={Link} 
                to="/properties" 
                onClick={handleMenuClose}
                sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <List sx={{ mr: 1.5, color: 'primary.main' }} /> 
                <Typography variant="body1">Browse Properties</Typography>
              </MenuItem>
              
              {user?.role === 'agent' && (
                <MenuItem 
                  component={Link} 
                  to="/add-property" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <Add sx={{ mr: 1.5, color: 'primary.main' }} /> 
                  <Typography variant="body1">Add Property</Typography>
                </MenuItem>
              )}
              
              {user ? (
                <>
                  <MenuItem 
                    component={Link}
                    to="/profile"
                    onClick={handleMenuClose}
                    sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <Person sx={{ mr: 1.5, color: 'primary.main' }} />
                    <Typography variant="body1">Profile</Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      logout();
                    }}
                    sx={{ py: 1.5 }}
                  >
                    <Typography variant="body1" color="error">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem 
                    component={Link} 
                    to="/login" 
                    onClick={handleMenuClose}
                    sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    <Login sx={{ mr: 1.5, color: 'primary.main' }} /> 
                    <Typography variant="body1">Login</Typography>
                  </MenuItem>
                  <MenuItem 
                    component={Link} 
                    to="/register" 
                    onClick={handleMenuClose}
                    sx={{ py: 1.5 }}
                  >
                    <PersonAdd sx={{ mr: 1.5, color: 'primary.main' }} /> 
                    <Typography variant="body1">Register</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0.5, sm: 1, md: 2 },
            alignItems: 'center'
          }}>
            <Button 
              component={Link} 
              to="/properties" 
              startIcon={<List />}
              sx={{
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(46, 134, 171, 0.08)'
                }
              }}
            >
              Browse
            </Button>

            {user?.role === 'agent' && (
              <Button 
                component={Link} 
                to="/add-property"
                startIcon={<Add />}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(46, 134, 171, 0.3)'
                  }
                }}
              >
                Add Property
              </Button>
            )}

            {user ? (
              <>
                <IconButton
                  component={Link}
                  to="/profile"
                  sx={{
                    backgroundColor: 'rgba(46, 134, 171, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 134, 171, 0.2)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32,
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Button 
                  onClick={logout}
                  sx={{
                    textTransform: 'none',
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/login" 
                  startIcon={<Login />}
                  sx={{
                    textTransform: 'none',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 134, 171, 0.08)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/register" 
                  startIcon={<PersonAdd />}
                  variant="outlined"
                  sx={{
                    textTransform: 'none',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 134, 171, 0.08)',
                      borderColor: 'primary.dark'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;