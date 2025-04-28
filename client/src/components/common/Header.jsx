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