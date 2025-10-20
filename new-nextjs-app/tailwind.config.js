module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          // Use CSS variables for consistent theming
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          'primary-light': 'var(--color-primary-light)',
          'primary-dark': 'var(--color-primary-dark)',
          'primary-contrast': 'var(--color-primary-contrast)',
          
          secondary: 'var(--color-secondary)',
          'secondary-hover': 'var(--color-secondary-hover)',
          'secondary-light': 'var(--color-secondary-light)',
          'secondary-dark': 'var(--color-secondary-dark)',
          'secondary-contrast': 'var(--color-secondary-contrast)',
          
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          
          success: 'var(--color-success)',
          'success-light': 'var(--color-success-light)',
          'success-dark': 'var(--color-success-dark)',
          
          warning: 'var(--color-warning)',
          'warning-light': 'var(--color-warning-light)',
          'warning-dark': 'var(--color-warning-dark)',
          
          danger: 'var(--color-danger)',
          'danger-light': 'var(--color-danger-light)',
          'danger-dark': 'var(--color-danger-dark)',
          
          error: 'var(--color-error)',
          'error-light': 'var(--color-error-light)',
          
          info: 'var(--color-info)',
          'info-light': 'var(--color-info-light)',
          'info-dark': 'var(--color-info-dark)',
          
          // Background colors
          bg: 'var(--color-bg)',
          'bg-primary': 'var(--color-bg-primary)',
          'bg-secondary': 'var(--color-bg-secondary)',
          'bg-tertiary': 'var(--color-bg-tertiary)',
          
          // Surface colors
          surface: 'var(--color-surface)',
          'surface-elevated': 'var(--color-surface-elevated)',
          'surface-raised': 'var(--color-surface-raised)',
          
          // Text colors
          text: 'var(--color-text)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-muted': 'var(--color-text-muted)',
          'text-inverse': 'var(--color-text-inverse)',
          
          // Border colors
          border: 'var(--color-border)',
          'border-light': 'var(--color-border-light)',
          'border-medium': 'var(--color-border-medium)',
          'border-dark': 'var(--color-border-dark)',
          
          // Base colors
          white: 'var(--color-white)',
          black: 'var(--color-black)',
        },
        fontFamily: {
          playfair: ['Playfair Display', 'serif'],
          lato: ['Lato', 'sans-serif'],
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
          'mobile': '640px',
          'tablet': '1024px',
          'desktop': '1280px',
          'wide': '1536px',
        },
        zIndex: {
          'base': '0',
          'elevated': '10',
          'raised': '20',
          'dropdown': '1000',
          'sticky': '1020',
          'fixed': '1030',
          'overlay': '1040',
          'modal': '1050',
          'popover': '1060',
          'tooltip': '1070',
          'notification': '1080',
          'max': '9999',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  };

