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
  LocalHotelOutlined,
  BathtubOutlined,
  SquareFootOutlined
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { api } from '@/lib/services/api';
import { Badge } from './Badge';
import IconButton from './IconButton';

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
    const iconProps = { className: 'w-4 h-4 text-[var(--color-primary)]' };
    switch (property.type?.toLowerCase()) {
      case 'apartment':
        return <BuildingOfficeIcon {...iconProps} />;
      case 'villa':
      case 'house':
        return <HomeIcon {...iconProps} />;
      case 'commercial':
        return <BuildingOfficeIcon {...iconProps} />;
      default:
        return <HomeIcon {...iconProps} />;
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
      className={`
        relative bg-[var(--color-surface)] rounded-xl overflow-hidden 
        border transition-all duration-300 cursor-pointer 
        hover:shadow-lg hover:shadow-[var(--color-primary)]/20 
        group ${className || ''}
        ${isSelected 
          ? 'border-2 border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/30' 
          : 'border-[var(--color-border)]'
        }
      `}
      onClick={handleClick}
      whileHover={animate ? { y: -5 } : undefined}
    >
      {/* Status Badge */}
      {showStatus && property.status && (
        <div className="absolute top-3 left-3 z-10">
          <Badge
            content={property.status}
            variant="chip"
            color={getStatusColor(property.status) as any}
            size="small"
          />
        </div>
      )}

      {/* Image Section */}
      <div className={`relative ${variant === 'compact' ? 'aspect-square' : 'aspect-video'}`}>
        {property.images?.length ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-[var(--color-surface-elevated)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-transparent border-t-[var(--color-primary)] border-l-[var(--color-primary)] rounded-full animate-spin" />
              </div>
            )}
            <img 
              src={property.images[0].url} 
              alt={property.images[0].alt || displayTitle}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
            <HomeIcon className="w-12 h-12 text-[var(--color-text-muted)]" />
          </div>
        )}
        
        {/* Favorite Button */}
        {showFavorite && (
          <div className="absolute top-2 right-2">
            <IconButton
              onClick={handleFavoriteClick}
              loading={loadingFavorite}
              variant={isFavorite ? 'favorite' : 'default'}
              size="small"
              animate={animate}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <HeartFilled className="w-4 h-4 text-red-500" />
              ) : (
                <HeartOutline className="w-4 h-4 text-white hover:text-red-500 transition-colors" />
              )}
            </IconButton>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={variant === 'compact' ? 'p-3' : 'p-4'}>
        {/* Rating and Type */}
        {showRating && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < Math.floor(property.rating || 5) ? 'text-yellow-400' : 'text-gray-300'
                  }`} 
                />
              ))}
              <span className="text-xs text-[var(--color-text-muted)] ml-1">
                {property.rating || '5.0'} ({property.reviews || '??'})
              </span>
            </div>
            <div className="flex items-center gap-1">
              {getPropertyTypeIcon()}
              <span className="text-xs text-[var(--color-primary)] capitalize">
                {property.type || 'Property'}
              </span>
            </div>
          </div>
        )}
        
        {/* Title */}
        <h3 className={`font-semibold text-[var(--color-text)] mb-1 line-clamp-1 ${
          variant === 'compact' ? 'text-sm' : 'text-lg'
        }`}>
          {displayTitle}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-[var(--color-text-muted)] mb-2">
          <MapPinIcon className="w-3 h-3" />
          <span className="text-xs line-clamp-1">
            {displayAddress || 'Location not available'}
          </span>
        </div>
        
        {/* Description */}
        {shouldShowDescription && (
          <p className="text-[var(--color-text-muted)] text-sm mb-3 line-clamp-2">
            {property.description}
          </p>
        )}
        
        {/* Features */}
        {shouldShowFeatures && (
          <div className="flex gap-4 mb-3">
            {property.area && (
              <Tooltip title="Area" arrow>
                <div className="flex items-center gap-1">
                  <SquareFootOutlined className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs text-[var(--color-text)]">
                    {property.area.toLocaleString()} sqft
                  </span>
                </div>
              </Tooltip>
            )}
            
            {property.bedrooms !== undefined && (
              <Tooltip title="Bedrooms" arrow>
                <div className="flex items-center gap-1">
                  <LocalHotelOutlined className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs text-[var(--color-text)]">
                    {property.bedrooms} Bed
                  </span>
                </div>
              </Tooltip>
            )}
            
            {property.bathrooms !== undefined && (
              <Tooltip title="Bathrooms" arrow>
                <div className="flex items-center gap-1">
                  <BathtubOutlined className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs text-[var(--color-text)]">
                    {property.bathrooms} Bath
                  </span>
                </div>
              </Tooltip>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="flex justify-between items-center">
          <span className={`font-bold text-[var(--color-primary)] ${
            variant === 'compact' ? 'text-sm' : 'text-lg'
          }`}>
            {formatPrice(property.price)}
          </span>
          
          {property.developer && variant === 'detailed' && (
            <span className="text-xs text-[var(--color-text-muted)]">
              by {property.developer.name}
            </span>
          )}
        </div>
      </div>
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