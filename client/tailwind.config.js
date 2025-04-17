module.exports = {
    content: ['./src/**/*.{js,jsx}'],
    theme: {
      extend: {
        colors: {
          primary: '#78cadc',
          'primary-dark': '#66b4c4',
          secondary: '#2d2d2d',
          accent: '#f5f5f5',
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
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
    ],
  };