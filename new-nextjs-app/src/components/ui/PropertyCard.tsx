'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon as HeartOutline, 
  MapPinIcon, 
  StarIcon,
  HomeIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import {
  LocalHotelOutlined as LocalHotelOutlinedIcon,
  HomeOutlined as HomeOutlinedIcon,
  BathtubOutlined as BathtubOutlinedIcon
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { api } from '@/lib/services/api';

// Types
interface PropertyImage {
  url: string;
  alt?: string;
}

interface PropertyAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  locality?: string;
}

interface PropertyLocation {
  coordinates?: [number, number];
  address?: PropertyAddress;
}

export interface Property {
  _id: string;
  title?: string;
  buildingName?: string;
  description?: string;
  images?: PropertyImage[];
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: 'apartment' | 'villa' | 'land' | 'commercial' | 'house';
  propertyType?: string;
  listingType?: 'sale' | 'rent';
  status?: 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
  address?: PropertyAddress;
  location?: PropertyLocation;
  rating?: number;
  reviews?: number;
  developer?: {
    _id: string;
    name: string;
  };
  amenities?: string[];
  features?: string[];
}

interface PropertyCardProps {
  property: Property;
  index?: number;
  variant?: 'default' | 'compact' | 'detailed';
  isSelected?: boolean;
  showFavorite?: boolean;
  showStatus?: boolean;
  showRating?: boolean;
  showFeatures?: boolean;
  showDescription?: boolean;
  onClick?: (property: Property) => void;
  onFavoriteToggle?: (property: Property, isFavorite: boolean) => void;
  className?: string;
  id?: string;
  lazy?: boolean;
  animate?: boolean;
}

const PropertyCardContent: React.FC<Omit<PropertyCardProps, 'lazy'>> = ({
  property,
  index = 0,
  variant = 'default',
  isSelected = false,
  showFavorite = true,
  showStatus = true,
  showRating = true,
  showFeatures = true,
  showDescription = true,
  onClick,
  onFavoriteToggle,
  className,
  id,
  animate = true,
}) => {
  console.log('🔧 PropertyCard rendering...', { propertyId: property?._id, index });
  
  React.useEffect(() => {
    console.log('🔧 PropertyCard mounted on client side!', { propertyId: property?._id, index });
  }, [property?._id, index]);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && property?._id && showFavorite) {
        try {
          const response = await api.auth.favoriteStatus(property._id);
          setIsFavorite(Boolean(response.data?.isFavorite));
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      } else {
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [user, property?._id, showFavorite]);

  // Handlers
  const handleClick = () => {
    if (onClick) {
      onClick(property);
    } else {
      router.push(`/properties/${property._id}`);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      const from = encodeURIComponent(pathname || '/');
      router.push(`/login?from=${from}`);
      toast.info('Please login to save favorites');
      return;
    }

    setLoadingFavorite(true);
    try {
      const response = await api.auth.toggleFavorite(property._id, !isFavorite);
      // Prefer server-provided state, fallback to local toggle
      const newFavoriteStatus = Boolean(response.data?.isFavorite ?? !isFavorite);
      
      setIsFavorite(newFavoriteStatus);
      onFavoriteToggle?.(property, newFavoriteStatus);
      
      // Show appropriate toast message
      const message = newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites';
      toast.success(message);
    } catch (err: any) {
      console.error('Error updating favorite:', err);
      try {
        const status = await api.auth.favoriteStatus(property._id);
        const serverState = Boolean(status.data?.isFavorite);
        setIsFavorite(serverState);
      } catch (_) {}
      toast.error(err?.message || 'Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  // Utility functions
  const formatPrice = (price?: number): string => {
    if (!price) return 'Price not available';
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  const getPropertyTypeIcon = () => {
    switch (property.type?.toLowerCase()) {
      case 'apartment':
        return <HomeOutlinedIcon className="text-[var(--color-primary)] icon-sm" />;
      case 'villa':
        return <HomeOutlinedIcon className="text-[var(--color-primary)] icon-sm" />;
      case 'land':
        return <HomeOutlinedIcon className="text-[var(--color-primary)] icon-sm" />;
      case 'commercial':
        return <HomeOutlinedIcon className="text-[var(--color-primary)] icon-sm" />;
      default:
        return <HomeOutlinedIcon className="text-[var(--color-primary)] icon-sm" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'For Sale':
        return 'success';
      case 'For Rent':
        return 'info';
      case 'Sold':
        return 'error';
      case 'Rented':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const displayTitle = property.buildingName || property.title || 'Untitled Property';
  const displayAddress = [
    property.address?.street,
    property.address?.city,
    property.address?.state
  ].filter(Boolean).join(', ');

  const shouldShowFeatures = showFeatures && variant !== 'compact';
  const shouldShowDescription = showDescription && variant === 'detailed' && property.description;

  return (
    <motion.div
      id={id}
      initial={animate ? { opacity: 0, y: 50 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      className={`relative bg-[var(--color-surface)] rounded-xl sm:rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/20 group
        ${isSelected ? 'border-2 border-[var(--color-primary)] shadow-lg shadow-primary/30' : 'border-[var(--color-border)]'} ${className || ''}`}
      onClick={handleClick}
      whileHover={animate ? { y: -5 } : undefined}
    >
      {/* Status Badge */}
      {showStatus && property.status && (
        <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-xs font-bold ${
          property.status === 'For Sale' ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]' : 'bg-[var(--color-danger)] text-white'
        }`}>
          {property.status}
        </div>
      )}

      {/* Image Section */}
      <div className={`relative ${variant === 'compact' ? 'aspect-square' : 'aspect-video'}`}>
{property.images?.length > 0 ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-elevated)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-transparent border-t-[var(--color-primary)] border-l-[var(--color-primary)] rounded-full animate-spin" />
              </div>
            )}
            <img 
              src={property.images[0].url} 
              alt={property.title} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-elevated)] flex items-center justify-center">
            <HomeOutlinedIcon className="text-[var(--color-primary)]/50 icon-lg" />
          </div>
        )}
        
        {/* Favorite Button */}
        {showFavorite && (
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
            <button 
              className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-[var(--color-surface)]/90 rounded-full hover:bg-[var(--color-surface)] transition-all
                        backdrop-blur-sm shadow-md group-hover:opacity-100 border border-[var(--color-border)]"
              onClick={handleFavoriteClick}
              disabled={loadingFavorite}
            >
              {loadingFavorite ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-[var(--color-primary)] border-l-[var(--color-primary)] rounded-full animate-spin" />
              ) : isFavorite ? (
                <HeartFilled className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-danger)] transition-all" />
              ) : (
                <HeartOutline className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text)] hover:text-[var(--color-danger)] transition-all" />
              )}
            </button>
          </Tooltip>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-5">
        {/* Rating and Type */}
        {showRating && (
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              ))}
              <span className="text-xs sm:text-sm text-[var(--color-text-muted)] ml-1">5.0 (??)</span>
            </div>
            <div className="flex items-center gap-1">
              {getPropertyTypeIcon()}
              <span className="text-xs sm:text-sm text-[var(--color-primary)] capitalize">
                {property.type || 'Property'}
              </span>
            </div>
          </div>
        )}
        
        {/* Title */}
        <h3 className="font-poppins text-lg sm:text-xl font-bold text-[var(--color-text)] mb-1 sm:mb-2 line-clamp-1">
          {property.buildingName || property.title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1 sm:gap-2 text-[var(--color-primary)] mb-2 sm:mb-3">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-poppins text-xs sm:text-sm line-clamp-1">
            {property.address?.street && `${property.address.street}, `}
            {property.address?.city}, {property.address?.state}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-[var(--color-text-muted)] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {property.description || 'No description available'}
        </p>
        
        {/* Features */}
        <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4">
          <Tooltip title="Area" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <HomeOutlinedIcon className="text-[var(--color-primary)] icon-sm" />
              <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">
                {property.area ? `${property.area.toLocaleString()} sqft` : 'N/A'}
              </span>
            </div>
          </Tooltip>
          
          <Tooltip title="Bedrooms" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <LocalHotelOutlinedIcon className="text-[var(--color-primary)] icon-sm" />
              <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">
                {property.bedrooms || '0'} Bed
              </span>
            </div>
          </Tooltip>
          
          <Tooltip title="Bathrooms" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <BathtubOutlinedIcon className="text-[var(--color-primary)] icon-sm" />
              <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">
                {property.bathrooms || '0'} Bath
              </span>
            </div>
          </Tooltip>
        </div>
        
        {/* Price and CTA */}
        <div className="pt-3 border-t border-[var(--color-border)]">
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <p className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">
              {formatPrice(property.price)}
              {property.status === 'For Rent' && <span className="text-sm text-[var(--color-text-muted)]">/mo</span>}
            </p>
            {(property as any).projectDetails?.launchDate && (
              <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-1 rounded">
                {new Date((property as any).projectDetails.launchDate) > new Date() ? 
                  `Launch ${new Date((property as any).projectDetails.launchDate).toLocaleDateString()}` : 
                  'Ready to Move'}
              </span>
            )}
          </div>
          
          <motion.button 
            className="w-full bg-transparent border border-[var(--color-primary)] text-[var(--color-text)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[var(--color-primary)]/20 transition-all text-xs sm:text-sm
                      group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-primary-contrast)] group-hover:font-bold"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-poppins">View Details</span>
          </motion.button>
        </div>
      </div>

      {/* Highlight animation when selected */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-[var(--color-primary)] rounded-xl sm:rounded-3xl opacity-0 animate-ping-slow" />
        </div>
      )}
    </motion.div>
  );
};

// Main PropertyCard component with lazy loading support
export const PropertyCard: React.FC<PropertyCardProps> = (props) => {
  if (props.lazy) {
    return (
      <Suspense
        fallback={
          <div className={`bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] ${props.className || ''}`}>
            <div className={`bg-[var(--color-surface-elevated)] animate-pulse ${
              props.variant === 'compact' ? 'aspect-square' : 'aspect-video'
            }`} />
            <div className="p-4">
              <div className="h-4 bg-[var(--color-surface-elevated)] rounded animate-pulse mb-2" />
              <div className="h-3 bg-[var(--color-surface-elevated)] rounded animate-pulse mb-2" />
              <div className="h-3 bg-[var(--color-surface-elevated)] rounded animate-pulse w-2/3" />
            </div>
          </div>
        }
      >
        <PropertyCardContent {...props} />
      </Suspense>
    );
  }

  return <PropertyCardContent {...props} />;
};

export { PropertyCard as default };