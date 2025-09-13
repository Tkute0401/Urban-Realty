// Brand Colors System - Based on Logo Analysis
// Primary Brand Colors from Logo
export const brandColors = {
  // Primary Brand Colors - From Logo
  primaryOrange: '#F76B1C',
  primaryBlue: '#1A2BFF',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// Extended Orange Palette
export const orangePalette = {
  50: '#FFF7ED',
  100: '#FFEDD5',
  200: '#FED7AA',
  300: '#FDBA74',
  400: '#FB923C',
  500: '#F76B1C', // Primary brand orange
  600: '#EA580C',
  700: '#C2410C',
  800: '#9A3412',
  900: '#7C2D12',
} as const;

// Extended Blue Palette
export const bluePalette = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#1A2BFF', // Primary brand blue
  600: '#1D4ED8',
  700: '#1E40AF',
  800: '#1E3A8A',
  900: '#1E3A8A',
} as const;

// Neutral Colors
export const neutralPalette = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
} as const;

// Semantic Colors
export const semanticColors = {
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

// Complete Color System
export const colors = {
  brand: brandColors,
  orange: orangePalette,
  blue: bluePalette,
  neutral: neutralPalette,
  semantic: semanticColors,
} as const;

// Theme-aware color system
export const createThemeColors = (mode: 'light' | 'dark' = 'light') => {
  const isDark = mode === 'dark';
  
  return {
    mode,
    brand: brandColors,
    orange: orangePalette,
    blue: bluePalette,
    neutral: neutralPalette,
    semantic: semanticColors,
    
    // Background Colors
    bg: {
      primary: isDark ? neutralPalette[900] : brandColors.white,
      secondary: isDark ? neutralPalette[800] : neutralPalette[50],
      tertiary: isDark ? neutralPalette[700] : neutralPalette[100],
      dark: isDark ? brandColors.black : neutralPalette[900],
    },
    
    // Text Colors
    text: {
      primary: isDark ? brandColors.white : neutralPalette[900],
      secondary: isDark ? neutralPalette[300] : neutralPalette[600],
      muted: isDark ? neutralPalette[400] : neutralPalette[500],
      inverse: isDark ? neutralPalette[900] : brandColors.white,
    },
    
    // Border Colors
    border: {
      light: isDark ? neutralPalette[700] : neutralPalette[200],
      medium: isDark ? neutralPalette[600] : neutralPalette[300],
      dark: isDark ? neutralPalette[500] : neutralPalette[400],
    },
    
    // Primary Colors
    primary: {
      main: brandColors.primaryOrange,
      light: orangePalette[400],
      dark: orangePalette[600],
      contrast: brandColors.white,
    },
    
    // Secondary Colors
    secondary: {
      main: brandColors.primaryBlue,
      light: bluePalette[400],
      dark: bluePalette[700],
      contrast: brandColors.white,
    },
  };
};

// CSS Variables for global usage
export const cssVariables = {
  light: {
    '--color-primary-orange': brandColors.primaryOrange,
    '--color-primary-blue': brandColors.primaryBlue,
    '--color-white': brandColors.white,
    '--color-black': brandColors.black,
    '--color-bg-primary': brandColors.white,
    '--color-bg-secondary': neutralPalette[50],
    '--color-bg-tertiary': neutralPalette[100],
    '--color-text-primary': neutralPalette[900],
    '--color-text-secondary': neutralPalette[600],
    '--color-text-muted': neutralPalette[500],
    '--color-border-light': neutralPalette[200],
    '--color-border-medium': neutralPalette[300],
    '--color-border-dark': neutralPalette[400],
  },
  dark: {
    '--color-primary-orange': brandColors.primaryOrange,
    '--color-primary-blue': brandColors.primaryBlue,
    '--color-white': brandColors.white,
    '--color-black': brandColors.black,
    '--color-bg-primary': neutralPalette[900],
    '--color-bg-secondary': neutralPalette[800],
    '--color-bg-tertiary': neutralPalette[700],
    '--color-text-primary': brandColors.white,
    '--color-text-secondary': neutralPalette[300],
    '--color-text-muted': neutralPalette[400],
    '--color-border-light': neutralPalette[700],
    '--color-border-medium': neutralPalette[600],
    '--color-border-dark': neutralPalette[500],
  },
} as const;

export default colors;