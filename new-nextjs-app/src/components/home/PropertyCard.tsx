'use client'

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeartIcon as HeartOutline, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import http from '@/lib/services/http';

interface PropertyImage {
  url: string;
}

interface PropertyAddress {
  city?: string;
  state?: string;
}

interface PropertyModel {
  _id: string;
  images?: PropertyImage[];
  title?: string;
  buildingName?: string;
  address?: PropertyAddress;
  description?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
  status?: string;
}

type PropertyCardProps = {
  property: PropertyModel;
  index: number;
};

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  
  // Check if property is in favorites when component mounts or user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && property?._id) {
        try {
          const response = await http.get(`/auth/favorites/${property._id}/status`);
          setIsFavorite(Boolean(response.data?.isFavorite));
        } catch (err) {
          // eslint-disable-next-line no-console
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
  };

  const handleFavoriteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!user) {
      const from = encodeURIComponent(pathname || '/');
      router.push(`/login?from=${from}`);
      toast.info('Please login to save favorites');
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await http.delete(`/auth/favorites/${property._id}`);
        toast.success('Removed from favorites');
      } else {
        await http.put(`/auth/favorites/${property._id}`);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error('Error updating favorite:', err);
      toast.error(err?.response?.data?.message || 'Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const formatPrice = (price?: number): string => {
    if (!price) return 'Price not available';
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      className="bg-[var(--color-bg-dark)] rounded-xl sm:rounded-3xl overflow-hidden border border-[var(--color-primary)] cursor-pointer hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-shadow"
      onClick={handleClick}
    >
      <div className="relative aspect-video">
        {property.images?.length ? (
          <img 
            src={property.images[0].url} 
            alt={property.title || 'Property image'} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <button 
          className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 bg-[var(--color-bg-dark)]/80 rounded-full hover:bg-[var(--color-bg-dark)] transition-colors"
          onClick={handleFavoriteClick}
          disabled={loadingFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {loadingFavorite ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-transparent border-t-white border-l-white rounded-full animate-spin" />
          ) : isFavorite ? (
            <HeartFilled className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          ) : (
            <HeartOutline className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:text-red-500 transition-colors" />
          )}
        </button>
      </div>

      <div className="p-3 sm:p-5">
        <div className="flex mb-1 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          ))}
          <span className="text-xs sm:text-sm text-gray-400 ml-1">5.0 (??)</span>
        </div>
        
        <h3 className="font-poppins text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">
          {property.buildingName || property.title}
        </h3>
        
        <div className="flex items-center gap-1 sm:gap-2 text-red-500 mb-2 sm:mb-3">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-poppins text-xs sm:text-sm line-clamp-1">
            {property.address?.city}, {property.address?.state}
          </span>
        </div>
        
        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <HomeOutlinedIcon className="text-gray-400 text-[1rem]" />
            <span className="text-gray-300 text-xs sm:text-sm">
              {property.area ? `${property.area} sqft` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LocalHotelOutlinedIcon className="text-gray-400 text-[1rem]" />
            <span className="text-gray-300 text-xs sm:text-sm">
              {property.bedrooms || '0'} Bed
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <BathtubOutlinedIcon className="text-gray-400 text-[1rem]" />
            <span className="text-gray-300 text-xs sm:text-sm">
              {property.bathrooms || '0'} Bath
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-800">
          <p className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
            {formatPrice(property.price)}
            {property.status === 'For Rent' && '/mo'}
          </p>
          <button 
            className="w-full bg-transparent border border-[var(--color-primary)] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[var(--color-primary)]/20 transition-all text-xs sm:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span className="font-poppins">View Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;

