// Shared Property model structure across all platforms

import { PROPERTY_TYPES, PROPERTY_STATUS } from '../constants/index.js';

/**
 * Property model structure
 * This defines the common property data structure used across server, client, and mobile
 */
export const PropertyModel = {
  // Basic property information
  _id: String,
  title: String,
  description: String,
  type: {
    type: String,
    enum: Object.values(PROPERTY_TYPES),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(PROPERTY_STATUS),
    default: PROPERTY_STATUS.AVAILABLE
  },
  
  // Location information
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmarks: [String]
  },
  
  // Property details
  details: {
    bedrooms: Number,
    bathrooms: Number,
    balconies: Number,
    parking: Number,
    floor: Number,
    totalFloors: Number,
    builtUpArea: Number, // in sq ft
    carpetArea: Number, // in sq ft
    age: Number, // in years
    facing: String, // North, South, East, West
    furnished: String // Fully, Semi, Unfurnished
  },
  
  // Pricing information
  pricing: {
    price: Number,
    pricePerSqFt: Number,
    maintenance: Number,
    deposit: Number,
    negotiable: Boolean,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  
  // Media
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean,
    order: Number
  }],
  videos: [{
    url: String,
    caption: String,
    thumbnail: String
  }],
  floorPlan: {
    url: String,
    caption: String
  },
  
  // Amenities
  amenities: {
    basic: [String], // Power backup, Water supply, etc.
    luxury: [String], // Swimming pool, Gym, etc.
    security: [String], // CCTV, Security guard, etc.
    nearby: [String] // Schools, Hospitals, etc.
  },
  
  // Ownership and legal
  ownership: {
    type: String, // Freehold, Leasehold, etc.
    documents: [String],
    legalStatus: String
  },
  
  // Agent/Developer information
  agent: {
    id: String,
    name: String,
    phone: String,
    email: String
  },
  developer: {
    id: String,
    name: String,
    phone: String,
    email: String
  },
  
  // SEO and visibility
  slug: String,
  keywords: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
};

/**
 * Property validation rules
 */
export const PropertyValidationRules = {
  title: {
    required: true,
    minLength: 10,
    maxLength: 200
  },
  description: {
    required: true,
    minLength: 50,
    maxLength: 2000
  },
  type: {
    required: true,
    enum: Object.values(PROPERTY_TYPES)
  },
  status: {
    required: true,
    enum: Object.values(PROPERTY_STATUS)
  },
  location: {
    address: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    city: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    state: {
      required: true,
      minLength: 2,
      maxLength: 100
    },
    pincode: {
      required: true,
      pattern: /^[1-9][0-9]{5}$/
    }
  },
  pricing: {
    price: {
      required: true,
      min: 0
    }
  }
};

/**
 * Property transformation functions
 */
export const PropertyTransformers = {
  /**
   * Transform property for client response
   * @param {object} property - Property object
   * @returns {object} - Transformed property object
   */
  toClientResponse: (property) => {
    return {
      ...property,
      primaryImage: property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url,
      imageCount: property.images?.length || 0,
      formattedPrice: formatCurrency(property.pricing?.price),
      formattedPricePerSqFt: formatCurrency(property.pricing?.pricePerSqFt),
      fullAddress: `${property.location?.address}, ${property.location?.city}, ${property.location?.state} - ${property.location?.pincode}`
    };
  },
  
  /**
   * Transform property for mobile response
   * @param {object} property - Property object
   * @returns {object} - Transformed property object
   */
  toMobileResponse: (property) => {
    return {
      ...PropertyTransformers.toClientResponse(property),
      shortDescription: property.description?.substring(0, 150) + '...',
      amenitiesCount: (property.amenities?.basic?.length || 0) + 
                     (property.amenities?.luxury?.length || 0) + 
                     (property.amenities?.security?.length || 0)
    };
  },
  
  /**
   * Get property type display name
   * @param {string} type - Property type
   * @returns {string} - Display name
   */
  getTypeDisplayName: (type) => {
    const typeMap = {
      [PROPERTY_TYPES.APARTMENT]: 'Apartment',
      [PROPERTY_TYPES.VILLA]: 'Villa',
      [PROPERTY_TYPES.PLOT]: 'Plot',
      [PROPERTY_TYPES.COMMERCIAL]: 'Commercial'
    };
    return typeMap[type] || type;
  },
  
  /**
   * Get property status display name
   * @param {string} status - Property status
   * @returns {string} - Display name
   */
  getStatusDisplayName: (status) => {
    const statusMap = {
      [PROPERTY_STATUS.AVAILABLE]: 'Available',
      [PROPERTY_STATUS.SOLD]: 'Sold',
      [PROPERTY_STATUS.RENTED]: 'Rented',
      [PROPERTY_STATUS.PENDING]: 'Pending'
    };
    return statusMap[status] || status;
  },
  
  /**
   * Check if property is available
   * @param {object} property - Property object
   * @returns {boolean} - Whether property is available
   */
  isAvailable: (property) => {
    return property.status === PROPERTY_STATUS.AVAILABLE && property.isActive;
  },
  
  /**
   * Get property size display
   * @param {object} property - Property object
   * @returns {string} - Size display string
   */
  getSizeDisplay: (property) => {
    const details = property.details;
    if (!details) return '';
    
    const parts = [];
    if (details.bedrooms) parts.push(`${details.bedrooms} BHK`);
    if (details.builtUpArea) parts.push(`${details.builtUpArea} sq ft`);
    
    return parts.join(', ');
  }
};

// Helper function for currency formatting (imported from shared utils)
const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};