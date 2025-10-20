module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          // Use CSS variables for all colors
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-contrast': 'var(--color-primary-contrast)',
          'primary-light': 'var(--color-primary-light)',
          'primary-dark': 'var(--color-primary-dark)',
          secondary: 'var(--color-secondary)',
          accent: 'var(--color-accent)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
          error: 'var(--color-error)',
          border: 'var(--color-border)',
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          'surface-elevated': 'var(--color-surface-elevated)',
          text: 'var(--color-text)',
          'text-primary': 'var(--color-text-primary)',
          'text-muted': 'var(--color-text-muted)',
          white: 'var(--color-white)',
          // Contrast-safe text colors
          'text-on-light': 'var(--color-text-on-light)',
          'text-on-dark': 'var(--color-text-on-dark)',
          'text-on-primary': 'var(--color-text-on-primary)',
          'text-muted-on-light': 'var(--color-text-muted-on-light)',
          'text-muted-on-dark': 'var(--color-text-muted-on-dark)',
        },
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
          playfair: ['Playfair Display', 'serif'],
          lato: ['Lato', 'sans-serif'],
        },
        zIndex: {
          'dropdown': 'var(--z-dropdown)',
          'sticky': 'var(--z-sticky)',
          'overlay': 'var(--z-overlay)',
          'modal': 'var(--z-modal)',
          'popover': 'var(--z-popover)',
          'tooltip': 'var(--z-tooltip)',
          'header': 'var(--z-header)',
          'mobile-menu': 'var(--z-mobile-menu)',
          'search-bar': 'var(--z-search-bar)',
          'hero-overlay': 'var(--z-hero-overlay)',
        },
        backdropBlur: {
          'elementor': '6px',
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-up': 'slideUp 0.4s ease-out',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          slideUp: {
            '0%': { transform: 'translateY(50px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
        },
        screens: {
          'xs': '320px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
        spacing: {
          '18': '4.5rem',
          '88': '22rem',
          '128': '32rem',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  };

