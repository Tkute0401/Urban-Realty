import React, { useEffect, useMemo, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  toggle: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggle: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  console.log('🔧 ThemeProvider rendering...');
  
  // Always initialize with 'light' to ensure consistent SSR/CSR
  const [theme, setTheme] = useState('light');

  // Load saved theme after mount to avoid hydration mismatch
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('🔧 ThemeProvider - Loading saved theme:', savedTheme);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    console.log('🔧 ThemeProvider - Theme changed to:', theme);
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

