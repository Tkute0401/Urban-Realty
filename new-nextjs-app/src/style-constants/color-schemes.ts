import { tokens } from './tokens';
export type ColorScheme = {
  bg: string; surface: string; surfaceElevated: string; text: string; textMuted: string;
  primary: string; primaryHover: string; primaryContrast: string; secondary: string; accent: string;
  success: string; warning: string; danger: string; border: string; focusRing: string;
};
export const lightScheme: ColorScheme = {
  bg: '#ffffff', surface: '#ffffff', surfaceElevated: '#f7f7f7', text: '#111827', textMuted: '#6b7280',
  primary: '#78cadc', primaryHover: '#66b4c4', primaryContrast: '#0b132b', secondary: '#2d2d2d', accent: '#f5f5f5',
  success: '#16a34a', warning: '#f59e0b', danger: '#ef4444', border: '#e5e7eb', focusRing: '#2563eb'
};
export const darkScheme: ColorScheme = {
  bg: '#0b132b', surface: '#111827', surfaceElevated: '#1f2937', text: '#f9fafb', textMuted: '#9ca3af',
  primary: '#78cadc', primaryHover: '#8ad7e8', primaryContrast: '#0b132b', secondary: '#d1d5db', accent: '#374151',
  success: '#22c55e', warning: '#f59e0b', danger: '#f87171', border: '#374151', focusRing: '#3b82f6'
};
export { tokens };
