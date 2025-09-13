// Map styles configuration using CSS variables
// This allows for dynamic theming and consistent colors

export const getMapStyles = () => {
  // Get CSS variable values from the document
  const getCSSVariable = (variable) => {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }
    // Fallback values for SSR
    return getFallbackColor(variable);
  };

  const getFallbackColor = (variable) => {
    const fallbacks = {
      '--color-bg-dark': '#0c0d0e',
      '--color-primary-blue': '#1A2BFF',
      '--color-primary-orange': '#F76B1C',
      '--color-text-primary': '#111827',
      '--color-text-secondary': '#6B7280',
      '--color-border-medium': '#D1D5DB',
    };
    return fallbacks[variable] || '#000000';
  };

  return [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-primary-blue')
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-primary-blue')
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-primary-blue')
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-primary-blue')
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-primary-blue')
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-primary')
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": getCSSVariable('--color-bg-dark')
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": getCSSVariable('--color-text-secondary')
        }
      ]
    }
  ];
};

// Light theme map styles
export const getLightMapStyles = () => [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

// Dark theme map styles
export const getDarkMapStyles = () => [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c2e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
];