import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { HeartIcon as HeartOutline, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../services/axios';
import { toast } from 'react-toastify';

const PropertyCard = ({ property, index }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Check if property is in favorites when component mounts or user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && property?._id) {
        try {
          const response = await axios.get(`/auth/favorites/${property._id}/status`);
          console.log(user, property._id);
          setIsFavorite(response.data.isFavorite);
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
    navigate(`/properties/${property._id}`);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname } });
      toast.info('Please login to save favorites');
      return;
    }

    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await axios.delete(`/auth/favorites/${property._id}`);
        toast.success('Removed from favorites');
      } else {
        await axios.put(`/auth/favorites/${property._id}`);
        console.log(property._id,user);
        toast.success('Added to favorites');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
      toast.error(err.response?.data?.message || 'Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${price.toLocaleString()}`;
  };
  console.log(user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      className="bg-[#08171A] rounded-xl sm:rounded-3xl overflow-hidden border border-[#78CADC] cursor-pointer hover:shadow-lg hover:shadow-[#78CADC]/20 transition-shadow"
      onClick={handleClick}
    >
      <div className="relative aspect-video">
        {property.images?.length > 0 ? (
          <img 
            src={property.images[0].url} 
            alt={property.title} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <button 
          className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1 sm:p-2 bg-[#0c0d0e]/80 rounded-full hover:bg-[#0c0d0e] transition-colors"
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
            <HomeOutlinedIcon className="text-gray-400" style={{ fontSize: '1rem' }} />
            <span className="text-gray-300 text-xs sm:text-sm">
              {property.area ? `${property.area} sqft` : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LocalHotelOutlinedIcon className="text-gray-400" style={{ fontSize: '1rem' }} />
            <span className="text-gray-300 text-xs sm:text-sm">
              {property.bedrooms || '0'} Bed
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <BathtubOutlinedIcon className="text-gray-400" style={{ fontSize: '1rem' }} />
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
            className="w-full bg-transparent border border-[#78cadc] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#78cadc]/20 transition-all text-xs sm:text-sm"
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