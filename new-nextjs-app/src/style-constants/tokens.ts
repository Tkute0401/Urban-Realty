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
    sizes: { 
      xs: "0.75rem",   // 12px
      sm: "0.875rem",   // 14px
      md: "1rem",       // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",  // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem",    // 48px
      "6xl": "3.75rem"  // 60px
    }
  },
  shadows: { 
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
    xl: "0 20px 25px rgba(0,0,0,0.1)"
  },
  // Comprehensive z-index scale for proper layering
  zIndex: {
    // Base layers (0-100)
    base: 0,
    elevated: 10,
    raised: 20,
    
    // Interactive layers (100-1000)
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
    
    // Maximum layer
    max: 9999
  },
  // Responsive breakpoints
  breakpoints: {
    mobile: "640px",
    tablet: "1024px", 
    desktop: "1280px",
    wide: "1536px"
  },
  // Touch target minimum size
  touchTarget: "44px"
} as const;
