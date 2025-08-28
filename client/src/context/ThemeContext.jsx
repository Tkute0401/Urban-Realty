// Create a theme context
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { urbanRealtyTheme } from '../Theme/NewTheme';

const ThemeContext = createContext();

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme-mode') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const theme = useMemo(() => createTheme({
    ...urbanRealtyTheme,
    palette: {
      ...urbanRealtyTheme.palette,
      mode,
      ...(mode === 'dark'
        ? {
            background: { default: '#121212', paper: '#1E1E1E' },
            text: { primary: '#FFFFFF', secondary: 'rgba(255, 255, 255, 0.7)' }
          }
        : {
            background: { default: '#F8F9FA', paper: '#FFFFFF' },
            text: { primary: '#333333', secondary: '#666666' }
          })
    }
  }), [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);