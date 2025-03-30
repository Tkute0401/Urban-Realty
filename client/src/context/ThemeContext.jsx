// Create a theme context
import { createContext, useContext, useMemo, useState } from 'react';
import { urbanRealtyTheme } from '../Theme/NewTheme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  
  const theme = useMemo(() => createTheme({
    ...urbanRealtyTheme,
    palette: {
      ...urbanRealtyTheme.palette,
      mode,
      ...(mode === 'dark' ? {
        background: {
          default: '#121212',
          paper: '#1E1E1E'
        },
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.7)'
        }
      } : {})
    }
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ toggleColorMode }}>
      <ThemeProvider theme={urbanRealtyTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);