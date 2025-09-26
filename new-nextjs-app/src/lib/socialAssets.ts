// Social media assets configuration for Squarefooot

export interface SocialAsset {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface SocialAssets {
  default: SocialAsset;
  twitter: SocialAsset;
  facebook: SocialAsset;
  linkedin: SocialAsset;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://urbanrealty.com';

// Default social media assets
export const defaultSocialAssets: SocialAssets = {
  default: {
    url: `${baseUrl}/social/urban-realty-og-default.jpg`,
    width: 1200,
    height: 630,
    alt: 'Squarefooot - Premier Real Estate Platform'
  },
  twitter: {
    url: `${baseUrl}/social/urban-realty-twitter-card.jpg`,
    width: 1200,
    height: 600,
    alt: 'Squarefooot - Find Your Dream Property'
  },
  facebook: {
    url: `${baseUrl}/social/urban-realty-facebook.jpg`,
    width: 1200,
    height: 630,
    alt: 'Squarefooot - Trusted Real Estate Services'
  },
  linkedin: {
    url: `${baseUrl}/social/urban-realty-linkedin.jpg`,
    width: 1200,
    height: 627,
    alt: 'Squarefooot - Professional Real Estate Solutions'
  }
};

// Property-specific social assets
export function getPropertySocialAssets(
  propertyTitle: string,
  propertyPrice: string,
  propertyLocation: string,
  propertyImage?: string
): SocialAssets {
  const alt = `${propertyTitle} - ${propertyPrice} in ${propertyLocation}`;
  
  return {
    default: {
      url: propertyImage || defaultSocialAssets.default.url,
      width: 1200,
      height: 630,
      alt
    },
    twitter: {
      url: propertyImage || defaultSocialAssets.twitter.url,
      width: 1200,
      height: 600,
      alt
    },
    facebook: {
      url: propertyImage || defaultSocialAssets.facebook.url,
      width: 1200,
      height: 630,
      alt
    },
    linkedin: {
      url: propertyImage || defaultSocialAssets.linkedin.url,
      width: 1200,
      height: 627,
      alt
    }
  };
}

// Developer-specific social assets
export function getDeveloperSocialAssets(
  developerName: string,
  projectCount?: number
): SocialAssets {
  const projectText = projectCount ? ` - ${projectCount} Projects` : '';
  const alt = `${developerName}${projectText} | Squarefooot`;
  
  return {
    default: {
      url: `${baseUrl}/social/urban-realty-developer-default.jpg`,
      width: 1200,
      height: 630,
      alt
    },
    twitter: {
      url: `${baseUrl}/social/urban-realty-developer-twitter.jpg`,
      width: 1200,
      height: 600,
      alt
    },
    facebook: {
      url: `${baseUrl}/social/urban-realty-developer-facebook.jpg`,
      width: 1200,
      height: 630,
      alt
    },
    linkedin: {
      url: `${baseUrl}/social/urban-realty-developer-linkedin.jpg`,
      width: 1200,
      height: 627,
      alt
    }
  };
}

// Service page social assets
export const serviceSocialAssets = {
  emiCalculator: {
    default: {
      url: `${baseUrl}/social/urban-realty-emi-calculator.jpg`,
      width: 1200,
      height: 630,
      alt: 'EMI Calculator - Squarefooot Financial Tools'
    },
    twitter: {
      url: `${baseUrl}/social/urban-realty-emi-calculator-twitter.jpg`,
      width: 1200,
      height: 600,
      alt: 'Calculate your home loan EMI with Squarefooot'
    }
  },
  career: {
    default: {
      url: `${baseUrl}/social/urban-realty-careers.jpg`,
      width: 1200,
      height: 630,
      alt: 'Join Squarefooot Team - Real Estate Careers'
    },
    twitter: {
      url: `${baseUrl}/social/urban-realty-careers-twitter.jpg`,
      width: 1200,
      height: 600,
      alt: 'Build your career in real estate with Squarefooot'
    }
  },
  howWeWork: {
    default: {
      url: `${baseUrl}/social/urban-realty-how-we-work.jpg`,
      width: 1200,
      height: 630,
      alt: 'How Squarefooot Works - Our Process'
    },
    twitter: {
      url: `${baseUrl}/social/urban-realty-process-twitter.jpg`,
      width: 1200,
      height: 600,
      alt: 'Discover Squarefooot streamlined real estate process'
    }
  },
  privacyPolicy: {
    default: {
      url: `${baseUrl}/social/urban-realty-privacy.jpg`,
      width: 1200,
      height: 630,
      alt: 'Squarefooot Privacy Policy - Data Protection'
    }
  }
};

// Generate Open Graph meta tags
export function generateOpenGraphTags(assets: SocialAssets, title: string, description: string) {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': assets.default.url,
    'og:image:width': assets.default.width.toString(),
    'og:image:height': assets.default.height.toString(),
    'og:image:alt': assets.default.alt,
    'og:type': 'website',
    'og:site_name': 'Squarefooot'
  };
}

// Generate Twitter Card meta tags
export function generateTwitterTags(assets: SocialAssets, title: string, description: string) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': assets.twitter.url,
    'twitter:image:alt': assets.twitter.alt,
    'twitter:site': '@urbanrealty',
    'twitter:creator': '@urbanrealty'
  };
}

// Image optimization utility
export function getOptimizedImageUrl(
  originalUrl: string,
  width: number,
  height: number,
  quality: number = 85
): string {
  // If using a CDN like Cloudinary, construct optimized URL
  if (originalUrl.includes('cloudinary.com')) {
    const parts = originalUrl.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/${parts[1]}`;
    }
  }
  
  // For Next.js Image optimization
  const params = new URLSearchParams({
    url: originalUrl,
    w: width.toString(),
    h: height.toString(),
    q: quality.toString()
  });
  
  return `/_next/image?${params.toString()}`;
}