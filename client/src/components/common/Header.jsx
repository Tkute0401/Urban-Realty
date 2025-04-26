// import { 
//   AppBar, 
//   Avatar,
//   Box, 
//   Button, 
//   IconButton, 
//   Menu, 
//   MenuItem, 
//   Toolbar, 
//   Typography, 
//   useMediaQuery 
// } from "@mui/material";
// import { 
//   Add, 
//   Home, 
//   List, 
//   Login, 
//   Person, 
//   PersonAdd, 
//   Menu as MenuIcon 
// } from "@mui/icons-material";
// import { useAuth } from "../../context/AuthContext";
// import { useTheme } from "@mui/material/styles";
// import { useState } from "react";
// import { Link } from "react-router-dom";

// const Header = () => {
//   const { user, logout } = useAuth();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <AppBar position="sticky" elevation={0} sx={{ 
//       backgroundColor: 'background.paper',
//       color: 'text.primary',
//       borderBottom: '1px solid',
//       borderColor: 'divider',
//       backdropFilter: 'blur(8px)',
//       WebkitBackdropFilter: 'blur(8px)',
//     }}>
//       <Toolbar sx={{ 
//         display: 'flex', 
//         justifyContent: 'space-between',
//         px: { xs: 2, sm: 3, md: 4 },
//         py: 1
//       }}>
//         {/* Logo/Brand */}
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Button 
//             component={Link} 
//             to="/" 
//             sx={{ 
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//               textTransform: 'none',
//               color: 'primary.main',
//               fontSize: { xs: '1.1rem', sm: '1.3rem' },
//               fontWeight: 700,
//               '&:hover': {
//                 backgroundColor: 'transparent'
//               }
//             }}
//           >
//             <Home color="primary" sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }} />
//             <Typography variant="h6" component="span" sx={{ 
//               display: { xs: 'none', sm: 'block' },
//               fontWeight: 700,
//               letterSpacing: '0.5px'
//             }}>
//               Urban Realty
//             </Typography>
//           </Button>
//         </Box>
//         {user?.role === 'admin' && (<Button 
//           align="right"
//           component={Link} 
//           to="/admin">
//             Admin
//           </Button>)}
//         {/* Navigation Links */}
//         {isMobile ? (
//           <>

//             <IconButton
//               color="inherit"
//               aria-label="menu"
//               onClick={handleMenuOpen}
//               size="large"
//               sx={{
//                 color: 'text.primary'
//               }}
//             >
//               <MenuIcon fontSize="medium" />
//             </IconButton>
//             <Menu
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleMenuClose}
//               PaperProps={{
//                 sx: {
//                   width: 280,
//                   maxWidth: '100%',
//                   mt: 1,
//                   borderRadius: 2,
//                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
//                 },
//               }}
//               MenuListProps={{
//                 sx: {
//                   py: 0
//                 }
//               }}
//               transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//               anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//             >
//               <MenuItem 
//                 component={Link} 
//                 to="/properties" 
//                 onClick={handleMenuClose}
//                 sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
//               >
//                 <List sx={{ mr: 1.5, color: 'primary.main' }} /> 
//                 <Typography variant="body1">Browse Properties</Typography>
//               </MenuItem>
              
//               {user?.role === 'agent' && (
//                 <MenuItem 
//                   component={Link} 
//                   to="/add-property" 
//                   onClick={handleMenuClose}
//                   sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
//                 >
//                   <Add sx={{ mr: 1.5, color: 'primary.main' }} /> 
//                   <Typography variant="body1">Add Property</Typography>
//                 </MenuItem>
//               )}
              
//               {user ? (
//                 <>
//                   <MenuItem 
//                     component={Link}
//                     to="/profile"
//                     onClick={handleMenuClose}
//                     sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
//                   >
//                     <Person sx={{ mr: 1.5, color: 'primary.main' }} />
//                     <Typography variant="body1">Profile</Typography>
//                   </MenuItem>
//                   <MenuItem 
//                     onClick={() => {
//                       handleMenuClose();
//                       logout();
//                     }}
//                     sx={{ py: 1.5 }}
//                   >
//                     <Typography variant="body1" color="error">Logout</Typography>
//                   </MenuItem>
//                 </>
//               ) : (
//                 <>
//                   <MenuItem 
//                     component={Link} 
//                     to="/login" 
//                     onClick={handleMenuClose}
//                     sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
//                   >
//                     <Login sx={{ mr: 1.5, color: 'primary.main' }} /> 
//                     <Typography variant="body1">Login</Typography>
//                   </MenuItem>
//                   <MenuItem 
//                     component={Link} 
//                     to="/register" 
//                     onClick={handleMenuClose}
//                     sx={{ py: 1.5 }}
//                   >
//                     <PersonAdd sx={{ mr: 1.5, color: 'primary.main' }} /> 
//                     <Typography variant="body1">Register</Typography>
//                   </MenuItem>
//                 </>
//               )}
//             </Menu>
//           </>
//         ) : (
//           <Box sx={{ 
//             display: 'flex', 
//             gap: { xs: 0.5, sm: 1, md: 2 },
//             alignItems: 'center'
//           }}>
//             <Button 
//               component={Link} 
//               to="/properties" 
//               startIcon={<List />}
//               sx={{
//                 textTransform: 'none',
//                 color: 'text.primary',
//                 '&:hover': {
//                   backgroundColor: 'rgba(46, 134, 171, 0.08)'
//                 }
//               }}
//             >
//               Browse
//             </Button>

//             {user?.role === 'agent' && (
//               <Button 
//                 component={Link} 
//                 to="/add-property"
//                 startIcon={<Add />}
//                 variant="contained"
//                 sx={{
//                   textTransform: 'none',
//                   boxShadow: 'none',
//                   '&:hover': {
//                     boxShadow: '0 4px 12px rgba(46, 134, 171, 0.3)'
//                   }
//                 }}
//               >
//                 Add Property
//               </Button>
//             )}

//             {user ? (
//               <>
//                 <IconButton
//                   component={Link}
//                   to="/profile"
//                   sx={{
//                     backgroundColor: 'rgba(46, 134, 171, 0.1)',
//                     '&:hover': {
//                       backgroundColor: 'rgba(46, 134, 171, 0.2)'
//                     }
//                   }}
//                 >
//                   <Avatar 
//                     sx={{ 
//                       width: 32, 
//                       height: 32,
//                       backgroundColor: 'primary.main',
//                       color: 'white'
//                     }}
//                   >
//                     {user.name.charAt(0).toUpperCase()}
//                   </Avatar>
//                 </IconButton>
//                 <Button 
//                   onClick={logout}
//                   sx={{
//                     textTransform: 'none',
//                     color: 'error.main',
//                     '&:hover': {
//                       backgroundColor: 'rgba(244, 67, 54, 0.08)'
//                     }
//                   }}
//                 >
//                   Logout
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button 
//                   component={Link} 
//                   to="/login" 
//                   startIcon={<Login />}
//                   sx={{
//                     textTransform: 'none',
//                     color: 'text.primary',
//                     '&:hover': {
//                       backgroundColor: 'rgba(46, 134, 171, 0.08)'
//                     }
//                   }}
//                 >
//                   Login
//                 </Button>
//                 <Button 
//                   component={Link} 
//                   to="/register" 
//                   startIcon={<PersonAdd />}
//                   variant="outlined"
//                   sx={{
//                     textTransform: 'none',
//                     borderColor: 'primary.main',
//                     color: 'primary.main',
//                     '&:hover': {
//                       backgroundColor: 'rgba(46, 134, 171, 0.08)',
//                       borderColor: 'primary.dark'
//                     }
//                   }}
//                 >
//                   Register
//                 </Button>
//               </>
//             )}
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

// Icon components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const RegisterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <line x1="19" y1="8" x2="19" y2="14"></line>
    <line x1="16" y1="11" x2="22" y2="11"></line>
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <HomeIcon />
            <span className="logo-text">Urban Realty</span>
          </Link>
        </div>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-item nav-item-outlined">
            ADMIN
          </Link>
        )}

        {/* Mobile Menu Button */}
        {isMobile ? (
          <div>
            <button className="menu-button" onClick={handleMenuToggle}>
              <MenuIcon />
            </button>
            
            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="mobile-menu" style={{ position: 'absolute', right: '1rem', top: '4rem' }}>
                <Link to="/properties" className="menu-item" onClick={handleMenuClose}>
                  <ListIcon className="menu-item-icon" />
                  <span>Browse Properties</span>
                </Link>
                
                {user?.role === 'agent' && (
                  <Link to="/add-property" className="menu-item" onClick={handleMenuClose}>
                    <AddIcon className="menu-item-icon" />
                    <span>Add Property</span>
                  </Link>
                )}
                
                {user ? (
                  <>
                    <Link to="/profile" className="menu-item" onClick={handleMenuClose}>
                      <PersonIcon className="menu-item-icon" />
                      <span>Profile</span>
                    </Link>
                    <div 
                      className="menu-item menu-logout" 
                      onClick={() => {
                        handleMenuClose();
                        logout();
                      }}
                    >
                      <span>Logout</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="menu-item" onClick={handleMenuClose}>
                      <LoginIcon className="menu-item-icon" />
                      <span>Login</span>
                    </Link>
                    <Link to="/register" className="menu-item" onClick={handleMenuClose}>
                      <RegisterIcon className="menu-item-icon" />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Desktop Navigation */
          <nav className="nav-container">
            <Link to="/properties" className="nav-item">
              <ListIcon />
              <span>Browse</span>
            </Link>

            {user?.role === 'agent' && (
              <Link to="/add-property" className="nav-item nav-item-outlined">
                <AddIcon />
                <span>Add Property</span>
              </Link>
            )}

            {user ? (
              <>
                <Link to="/profile" className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button 
                  onClick={logout} 
                  className="nav-item"
                  style={{ 
                    border: 'none', 
                    cursor: 'pointer', 
                    backgroundColor: 'transparent',
                    color: '#ff6b6b'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-item">
                  <LoginIcon />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="nav-item nav-item-outlined">
                  <RegisterIcon />
                  <span>Register</span>
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;