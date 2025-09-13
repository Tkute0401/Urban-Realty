// SQUARE FOOOOT App Color Palette
// Based on the official logo design

export const colors = {
  // Brand Colors (from logo)
  brand: {
    orange: '#FF6600',    // Primary orange from logo
    blue: '#1A00FF',      // Primary blue from dark logo
    white: '#FFFFFF',     // Clean white
  },

  // Light Theme
  light: {
    primary: '#FF6600',           // Brand orange
    primaryHover: '#E55A00',      // Darker orange for hover states
    primaryActive: '#CC4D00',     // Even darker for active states
    background: '#FFFFFF',        // Pure white background
    surface: '#F8F9FA',          // Light gray for cards/surfaces
    surfaceElevated: '#FFFFFF',   // White for elevated surfaces
    text: {
      primary: '#1A1A1A',         // Dark gray for primary text
      secondary: '#6B7280',       // Medium gray for secondary text
      disabled: '#9CA3AF',        // Light gray for disabled text
      inverse: '#FFFFFF',         // White text on dark backgrounds
    },
    border: {
      light: '#E5E7EB',          // Light border
      medium: '#D1D5DB',         // Medium border
      strong: '#9CA3AF',         // Strong border
    },
    status: {
      success: '#10B981',        // Green for success states
      warning: '#F59E0B',        // Amber for warnings
      error: '#EF4444',          // Red for errors
      info: '#3B82F6',           // Blue for info
    },
    accent: {
      orange: '#FF6600',         // Brand orange for accents
      orangeLight: '#FFB366',    // Light orange variant
      orangeDark: '#E55A00',     // Dark orange variant
    }
  },

  // Dark Theme
  dark: {
    primary: '#1A00FF',          // Brand blue
    primaryHover: '#3300FF',     // Lighter blue for hover states
    primaryActive: '#0000E6',    // Even lighter for active states
    background: '#0F0F23',       // Very dark blue background
    surface: '#1A1A2E',          // Dark blue for cards/surfaces
    surfaceElevated: '#16213E',  // Slightly lighter for elevated surfaces
    text: {
      primary: '#FFFFFF',        // White for primary text
      secondary: '#A1A1AA',      // Light gray for secondary text
      disabled: '#71717A',       // Medium gray for disabled text
      inverse: '#1A1A1A',        // Dark text on light backgrounds
    },
    border: {
      light: '#374151',          // Dark border
      medium: '#4B5563',         // Medium dark border
      strong: '#6B7280',         // Strong dark border
    },
    status: {
      success: '#34D399',        // Light green for success states
      warning: '#FBBF24',        // Light amber for warnings
      error: '#F87171',          // Light red for errors
      info: '#60A5FA',           // Light blue for info
    },
    accent: {
      orange: '#FF6600',         // Brand orange for accents
      orangeLight: '#FFB366',    // Light orange variant
      orangeDark: '#E55A00',     // Dark orange variant
      white: '#FFFFFF',          // White for highlights
    }
  },

  // Common colors used across both themes
  common: {
    transparent: 'transparent',
    black: '#000000',
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.3)',
  }
};

// Theme-specific color getters
export const getThemeColors = (isDark = false) => {
  return isDark ? colors.dark : colors.light;
};

// CSS Custom Properties for easy theming
export const cssVariables = {
  light: {
    '--color-primary': colors.light.primary,
    '--color-primary-hover': colors.light.primaryHover,
    '--color-primary-active': colors.light.primaryActive,
    '--color-background': colors.light.background,
    '--color-surface': colors.light.surface,
    '--color-surface-elevated': colors.light.surfaceElevated,
    '--color-text-primary': colors.light.text.primary,
    '--color-text-secondary': colors.light.text.secondary,
    '--color-text-disabled': colors.light.text.disabled,
    '--color-text-inverse': colors.light.text.inverse,
    '--color-border-light': colors.light.border.light,
    '--color-border-medium': colors.light.border.medium,
    '--color-border-strong': colors.light.border.strong,
    '--color-accent-orange': colors.light.accent.orange,
    '--color-accent-orange-light': colors.light.accent.orangeLight,
    '--color-accent-orange-dark': colors.light.accent.orangeDark,
  },
  dark: {
    '--color-primary': colors.dark.primary,
    '--color-primary-hover': colors.dark.primaryHover,
    '--color-primary-active': colors.dark.primaryActive,
    '--color-background': colors.dark.background,
    '--color-surface': colors.dark.surface,
    '--color-surface-elevated': colors.dark.surfaceElevated,
    '--color-text-primary': colors.dark.text.primary,
    '--color-text-secondary': colors.dark.text.secondary,
    '--color-text-disabled': colors.dark.text.disabled,
    '--color-text-inverse': colors.dark.text.inverse,
    '--color-border-light': colors.dark.border.light,
    '--color-border-medium': colors.dark.border.medium,
    '--color-border-strong': colors.dark.border.strong,
    '--color-accent-orange': colors.dark.accent.orange,
    '--color-accent-orange-light': colors.dark.accent.orangeLight,
    '--color-accent-orange-dark': colors.dark.accent.orangeDark,
    '--color-accent-white': colors.dark.accent.white,
  }
};

// Usage examples:
// import { colors, getThemeColors, cssVariables } from './color-palette';
// 
// // For React components:
// const themeColors = getThemeColors(isDarkMode);
// 
// // For CSS:
// document.documentElement.style.setProperty('--color-primary', colors.light.primary);