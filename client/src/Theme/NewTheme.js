// In your theme configuration (or create a new theme file)
import { createTheme } from '@mui/material/styles';

export const urbanRealtyTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },},
  palette: {
    primary: {
      main: '#2E86AB', // Deep ocean blue
      light: '#5AB1D1',
      dark: '#1B5E7A',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF7D00', // Vibrant orange
      light: '#FF9E40',
      dark: '#E65100',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F8F9FA', // Light gray background
      paper: '#FFFFFF'
    },
    text: {
      primary: '#333333',
      secondary: '#666666'
    },
    success: {
      main: '#4CAF50'
    },
    warning: {
      main: '#FFC107'
    },
    error: {
      main: '#F44336'
    }
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    subtitle1: {
      fontWeight: 500
    },
    body1: {
      lineHeight: 1.6
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E0E0E0'
            },
            '&:hover fieldset': {
              borderColor: '#2E86AB'
            }
          }
        }
      }
    }
  }
});