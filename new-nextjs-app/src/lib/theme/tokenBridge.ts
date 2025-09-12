// Token bridge to map legacy theme keys to semantic variables
// This provides a non-invasive mapping layer for existing theme usage

import { lightScheme, darkScheme } from '@/style-constants/color-schemes';

export interface LegacyThemeTokens {
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// Map legacy theme keys to semantic variables
export const mapLegacyToSemantic = (scheme: typeof lightScheme): LegacyThemeTokens => ({
  primary: scheme.primary,
  secondary: scheme.secondary,
  textPrimary: scheme.text,
  textSecondary: scheme.textMuted,
  background: scheme.bg,
  surface: scheme.surface,
  error: scheme.danger,
  warning: scheme.warning,
  success: scheme.success,
  info: scheme.accent,
});

// Get active scheme based on theme preference
export const getActiveScheme = (isDark: boolean = false) => {
  return isDark ? darkScheme : lightScheme;
};

// Convert scheme to legacy format for backward compatibility
export const getLegacyTheme = (isDark: boolean = false): LegacyThemeTokens => {
  const scheme = getActiveScheme(isDark);
  return mapLegacyToSemantic(scheme);
};

// Helper to apply theme to CSS variables
export const applyTheme = (isDark: boolean = false) => {
  const scheme = getActiveScheme(isDark);
  const root = document.documentElement;
  
  // Apply CSS variables
  Object.entries(scheme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Set theme attribute
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
};