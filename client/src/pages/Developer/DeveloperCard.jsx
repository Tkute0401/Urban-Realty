import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPinIcon, StarIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';

const DeveloperCard = ({ developer, isMobile }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/developers/${developer._id}`);
  };

  const formatProjectsCount = (count) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative bg-[#08171A] rounded-xl sm:rounded-3xl overflow-hidden border border-[#78CADC]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#78CADC]/20 group`}
      onClick={handleClick}
      whileHover={{ y: -5 }}
    >
      {/* Image Section */}
      <div className="relative aspect-video">
        {developer.logo?.url ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0B1011] to-[#1a2a32] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-transparent border-t-[#78CADC] border-l-[#78CADC] rounded-full animate-spin" />
              </div>
            )}
            <img 
              src={developer.logo.url} 
              alt={developer.name} 
              className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} bg-[#0B1011]`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0B1011] to-[#1a2a32] flex items-center justify-center">
            <BuildingOfficeIcon className="text-[#78CADC]/50 w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-5">
        {/* Rating */}
        <div className="flex items-center mb-2 sm:mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          ))}
          <span className="text-xs sm:text-sm text-gray-400 ml-1">5.0 (??)</span>
        </div>
        
        {/* Title */}
        <h3 className="font-poppins text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">
          {developer.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1 sm:gap-2 text-[#78CADC] mb-2 sm:mb-3">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-poppins text-xs sm:text-sm line-clamp-1">
            {developer.headquarters?.city && `${developer.headquarters.city}, `}
            {developer.headquarters?.state}
            {developer.headquarters?.country && `, ${developer.headquarters.country}`}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {developer.description || 'No description available'}
        </p>
        
        {/* Features */}
        <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4">
          <Tooltip title="Founded Year" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <BuildingOfficeIcon className="text-[#78CADC] w-4 h-4" />
              <span className="text-gray-300 text-xs sm:text-sm">
                {developer.foundedYear || 'N/A'}
              </span>
            </div>
          </Tooltip>
          
          <Tooltip title="Completed Projects" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <BuildingOfficeIcon className="text-[#78CADC] w-4 h-4" />
              <span className="text-gray-300 text-xs sm:text-sm">
                {formatProjectsCount(developer.completedProjects)} Projects
              </span>
            </div>
          </Tooltip>
        </div>
        
        {/* Specializations */}
        {developer.specializations?.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="text-xs text-gray-400 mb-1">Specializations:</div>
            <div className="flex flex-wrap gap-1">
              {developer.specializations.slice(0, 3).map((spec, index) => (
                <span key={index} className="text-xs bg-[#78CADC]/10 text-[#78CADC] px-2 py-1 rounded">
                  {spec.name}
                </span>
              ))}
              {developer.specializations.length > 3 && (
                <span className="text-xs bg-[#78CADC]/10 text-[#78CADC] px-2 py-1 rounded">
                  +{developer.specializations.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* CTA */}
        <div className="pt-3 border-t border-gray-800">
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
            <span className="font-poppins">View Developer</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeveloperCard;