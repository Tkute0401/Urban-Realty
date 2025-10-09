'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartIcon as HeartOutline, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import { HomeOutlined, LocalHotelOutlined, BathtubOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';

interface Property {
  _id: string;
  title: string;
  buildingName?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  description?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
  };
  images?: Array<{ url: string }>;
  projectDetails?: {
    launchDate?: string;
  };
}

interface PropertyCardProps {
  property: Property;
  index?: number;
  isSelected?: boolean;
  onClick?: (property: Property) => void;
  id?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  index = 0, 
  isSelected = false, 
  onClick, 
  id 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useThemeContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if property is in favorites when component mounts or user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && property?._id) {
        try {
          const response = await fetch(`/api/auth/favorites/${property._id}/status`);
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      } else {
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [user, property?._id]);

  const handleClick = () => {
    router.push(`/properties/${property._id}`);
    if (onClick) {
      onClick(property);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      toast.info('Please login to save favorites');
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await fetch(`/api/auth/favorites/${property._id}`, { method: 'DELETE' });
        toast.success('Removed from favorites');
      } else {
        await fetch(`/api/auth/favorites/${property._id}`, { method: 'PUT' });
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const formatPrice = (price: number) => {
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
        return <HomeOutlined className="text-[#78CADC] text-sm" />;
      case 'villa':
        return <HomeOutlined className="text-[#78CADC] text-sm" />;
      case 'land':
        return <HomeOutlined className="text-[#78CADC] text-sm" />;
      case 'commercial':
        return <HomeOutlined className="text-[#78CADC] text-sm" />;
      default:
        return <HomeOutlined className="text-[#78CADC] text-sm" />;
    }
  };

  const isDark = theme === 'dark';

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      className={`relative rounded-xl sm:rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#78CADC]/20 group
        ${isSelected ? 'border-2 border-[#78CADC] shadow-lg shadow-[#78CADC]/30' : 'border-[#78CADC]/50'}
        ${isDark ? 'bg-[#0B1011]' : 'bg-white'}`}
      onClick={handleClick}
      whileHover={{ y: -5 }}
    >
      {/* Status Badge */}
      {property.status && (
        <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-md text-xs font-bold ${
          property.status === 'For Sale' ? 'bg-[#78CADC] text-[#0B1011]' : 'bg-[#e74c3c] text-white'
        }`}>
          {property.status}
        </div>
      )}

      {/* Image Section */}
      <div className="relative aspect-video">
        {property.images?.length > 0 ? (
          <>
            {!imageLoaded && (
              <div className={`absolute inset-0 flex items-center justify-center ${
                isDark ? 'bg-gradient-to-br from-[#0B1011] to-[#1a2a32]' : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}>
                <div className="w-8 h-8 border-2 border-transparent border-t-[#78CADC] border-l-[#78CADC] rounded-full animate-spin" />
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
          <div className={`w-full h-full flex items-center justify-center ${
            isDark ? 'bg-gradient-to-br from-[#0B1011] to-[#1a2a32]' : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}>
            <HomeOutlined className="text-[#78CADC]/50 text-2xl" />
          </div>
        )}
        
        {/* Favorite Button */}
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
          <button 
            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-black/90 rounded-full hover:bg-black transition-all
                      backdrop-blur-sm shadow-md group-hover:opacity-100"
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
          >
            {loadingFavorite ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-white border-l-white rounded-full animate-spin" />
            ) : isFavorite ? (
              <HeartFilled className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 transition-all" />
            ) : (
              <HeartOutline className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-red-500 transition-all" />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-5">
        {/* Rating and Type */}
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            ))}
            <span className="text-xs sm:text-sm text-gray-400 ml-1">5.0 (??)</span>
          </div>
          <div className="flex items-center gap-1">
            {getPropertyTypeIcon()}
            <span className="text-xs sm:text-sm text-[#78CADC] capitalize">
              {property.type || 'Property'}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className={`font-poppins text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-1 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {property.buildingName || property.title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#78CADC] mb-2 sm:mb-3">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-poppins text-xs sm:text-sm line-clamp-1">
            {property.address?.street && `${property.address.street}, `}
            {property.address?.city}, {property.address?.state}
          </span>
        </div>
        
        {/* Description */}
        <p className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {property.description || 'No description available'}
        </p>
        
        {/* Features */}
        <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4">
          <Tooltip title="Area" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <HomeOutlined className="text-[#78CADC] text-sm" />
              <span className={`text-xs sm:text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {property.area ? `${property.area.toLocaleString()} sqft` : 'N/A'}
              </span>
            </div>
          </Tooltip>
          
          <Tooltip title="Bedrooms" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <LocalHotelOutlined className="text-[#78CADC] text-sm" />
              <span className={`text-xs sm:text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {property.bedrooms || '0'} Bed
              </span>
            </div>
          </Tooltip>
          
          <Tooltip title="Bathrooms" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <BathtubOutlined className="text-[#78CADC] text-sm" />
              <span className={`text-xs sm:text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {property.bathrooms || '0'} Bath
              </span>
            </div>
          </Tooltip>
        </div>
        
        {/* Price and CTA */}
        <div className={`pt-3 border-t ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <p className={`text-xl sm:text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {formatPrice(property.price)}
              {property.status === 'For Rent' && <span className="text-sm text-gray-400">/mo</span>}
            </p>
            {property.projectDetails?.launchDate && (
              <span className="text-xs bg-[#78CADC]/10 text-[#78CADC] px-2 py-1 rounded">
                {new Date(property.projectDetails.launchDate) > new Date() ? 
                  `Launch ${new Date(property.projectDetails.launchDate).toLocaleDateString()}` : 
                  'Ready to Move'}
              </span>
            )}
          </div>
          
          <motion.button 
            className="w-full bg-transparent border border-[#78cadc] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#78cadc]/20 transition-all text-xs sm:text-sm
                      group-hover:bg-[#78cadc] group-hover:text-[#0B1011] group-hover:font-bold"
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
          <div className="absolute inset-0 border-2 border-[#78CADC] rounded-xl sm:rounded-3xl opacity-0 animate-ping-slow" />
        </div>
      )}
    </motion.div>
  );
};

export default PropertyCard;
