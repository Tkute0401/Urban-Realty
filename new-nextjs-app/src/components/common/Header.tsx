'use client'

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeContext } from '@/contexts/ThemeProvider';
import './Header.css';

// Icon components

const ListIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const AddIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const LoginIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
    <polyline points="10 17 15 12 10 7"></polyline>
    <line x1="15" y1="12" x2="3" y2="12"></line>
  </svg>
);

const RegisterIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
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

const PersonIcon = ({ className = "menu-item-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const DashboardIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
  </svg>
);

const BuildingIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
    <path d="M6 12h4"></path>
    <path d="M6 20h4"></path>
    <path d="M10 4h4"></path>
    <path d="M10 8h4"></path>
  </svg>
);

const SunIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = ({ className = "nav-icon" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const Header: React.FC = () => {
  console.log('🔧 Header component rendering...');
  
  React.useEffect(() => {
    console.log('🔧 Header mounted on client side!');
  }, []);
  const { user, logout } = useAuth() as AuthContextType;
  const { theme, toggle: toggleTheme } = useContext(ThemeContext);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="header-container">
        {/* Logo */}
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <img 
                src="/vite.png" 
                alt="Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-all duration-300 hover:scale-105" 
              />
            {/* <span className="logo-text">Urban Realty</span> */}
          </Link>
        </div>

        {/* Admin Link */}
        {user?.role === 'admin' && (
          <Link href="/admin" className="nav-item nav-item-outlined">
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
              <div className="mobile-menu">
                <Link href="/properties" className="menu-item" onClick={handleMenuClose}>
                  <ListIcon className="menu-item-icon" />
                  <span>Browse Properties</span>
                </Link>
                
                <Link href="/subscriptions" className="menu-item" onClick={handleMenuClose}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M12 11v6"></path>
                    <path d="M9 14l3 3 3-3"></path>
                  </svg>
                  <span>Subscription Plans</span>
                </Link>
                
                <div className="menu-item" onClick={toggleTheme}>
                  {theme === 'light' ? 
                    <MoonIcon className="menu-item-icon" /> : 
                    <SunIcon className="menu-item-icon" />
                  }
                  <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </div>
                
                {/* Role-specific menu items */}
                {user?.role === 'admin' && (
                  <Link href="/admin" className="menu-item" onClick={handleMenuClose}>
                    <DashboardIcon className="menu-item-icon" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                
                {user?.role === 'agent' && (
                  <>
                    <Link href="/agent" className="menu-item" onClick={handleMenuClose}>
                      <DashboardIcon className="menu-item-icon" />
                      <span>Agent Dashboard</span>
                    </Link>
                    <Link href="/add-property" className="menu-item" onClick={handleMenuClose}>
                      <AddIcon className="menu-item-icon" />
                      <span>Add Property</span>
                    </Link>
                  </>
                )}
                
                {user?.role === 'developer' && (
                  <>
                    <Link href="/developers" className="menu-item" onClick={handleMenuClose}>
                      <BuildingIcon className="menu-item-icon" />
                      <span>Developer Dashboard</span>
                    </Link>
                    <Link href="/developers/add" className="menu-item" onClick={handleMenuClose}>
                      <AddIcon className="menu-item-icon" />
                      <span>Add Project</span>
                    </Link>
                  </>
                )}
                
                {user ? (
                  <>
                    <Link href="/profile" className="menu-item" onClick={handleMenuClose}>
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
                    <Link href="/login" className="menu-item" onClick={handleMenuClose}>
                      <LoginIcon className="menu-item-icon" />
                      <span>Login</span>
                    </Link>
                    <Link href="/register" className="menu-item" onClick={handleMenuClose}>
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
            <Link href="/properties" className="nav-item">
              <ListIcon />
              <span>Browse</span>
            </Link>

            <Link href="/subscriptions" className="nav-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M12 11v6"></path>
                <path d="M9 14l3 3 3-3"></path>
              </svg>
              <span>Plans</span>
            </Link>

            <button onClick={toggleTheme} className="nav-item theme-toggle" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              <span className="theme-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            {/* Role-specific navigation items */}
            {user?.role === 'admin' && (
              <Link href="/admin" className="nav-item nav-item-outlined">
                <DashboardIcon />
                <span>Admin Panel</span>
              </Link>
            )}

            {user?.role === 'agent' && (
              <>
                <Link href="/agent" className="nav-item">
                  <DashboardIcon />
                  <span>Dashboard</span>
                </Link>
                <Link href="/add-property" className="nav-item nav-item-outlined">
                  <AddIcon />
                  <span>Add Property</span>
                </Link>
              </>
            )}

            {user?.role === 'developer' && (
              <>
                <Link href="/developers" className="nav-item">
                  <BuildingIcon />
                  <span>Dashboard</span>
                </Link>
                <Link href="/developers/add" className="nav-item nav-item-outlined">
                  <AddIcon />
                  <span>Add Project</span>
                </Link>
              </>
            )}

            {user ? (
              <>
                <Link href="/profile" className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    router.push('/');
                  }} 
                  className="nav-item button-link"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-item">
                  <LoginIcon />
                  <span>Login</span>
                </Link>
                <Link href="/register" className="nav-item nav-item-outlined">
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