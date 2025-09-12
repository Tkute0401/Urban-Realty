export const tokens = {
  colors: {
    base: {
      white: '#ffffff',
      black: '#000000',
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827',
      brandPrimary: '#78cadc',
      brandPrimaryDark: '#66b4c4',
      accent: '#f5f5f5',
      danger: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6'
    },
  },
  spacing: [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64],
  radii: {
    none: '0px',
    sm: '2px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    pill: '999px',
    round: '50%'
  },
  typography: {
    fonts: {
      playfair: 'Playfair Display, serif',
      lato: 'Lato, sans-serif'
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeights: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.5,
      relaxed: 1.625
    }
  },
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 1px 3px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.15)'
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    overlay: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060
  }
} as const

export type Tokens = typeof tokens

