import React from "react";
import { motion } from "framer-motion";
import { HeartIcon, MapPinIcon, StarIcon } from "@heroicons/react/24/outline";
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/properties/${property._id}`);
  };

  const formatPrice = (price) => {
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
      className="bg-[#08171A] rounded-3xl overflow-hidden border border-gray-800 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-video">
        {property.images?.length > 0 ? (
          <img 
            src={property.images[0].url} 
            alt={property.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <button 
          className="absolute top-4 right-4 p-2 bg-[#0c0d0e]/50 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            // Handle favorite
          }}
        >
          <HeartIcon className="w-5 h-5 text-white hover:text-red-500 transition-colors" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-400 ml-1">5.0 (??)</span>
        </div>
        
        <h3 className="font-sans text-xl font-bold text-white mb-2">
          {property.buildingName || property.title}
        </h3>
        
        <div className="flex items-center gap-2 text-red-500 mb-3">
          <MapPinIcon className="w-4 h-4" />
          <span className="font-sans text-sm">
            {property.address?.city}, {property.address?.state}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <HomeOutlinedIcon className="text-gray-400" />
            <span className="text-gray-300 text-sm">{property.area} sqft</span>
          </div>
          <div className="flex items-center gap-2">
            <LocalHotelOutlinedIcon className="text-gray-400" />
            <span className="text-gray-300 text-sm">{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-2">
            <BathtubOutlinedIcon className="text-gray-400" />
            <span className="text-gray-300 text-sm">{property.bathrooms} Bath</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-800">
          <p className="text-2xl font-bold text-white mb-3">
            {formatPrice(property.price)}
            {property.status === 'For Rent' && '/mo'}
          </p>
          <button 
            className="w-full bg-transparent border border-[#78cadc] text-white px-4 py-2 rounded-lg hover:bg-[#78cadc]/20 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span className="font-sans text-sm">View Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;