export const tokens = {
  colors: {
    base: { white: "#ffffff", black: "#000000" }
  },
  spacing: [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64],
  radii: {
    none: "0px", sm: "2px", md: "4px", lg: "8px", xl: "12px", pill: "999px", round: "50%"
  },
  typography: {
    fontFamilies: { sans: "Lato, sans-serif", serif: "Playfair Display, serif" },
    sizes: { sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem" }
  },
  shadows: { sm: "0 1px 2px rgba(0,0,0,0.05)" },
  zIndex: { dropdown: 1000, sticky: 1020, overlay: 1030, modal: 1040, popover: 1060, tooltip: 1070 }
} as const;
