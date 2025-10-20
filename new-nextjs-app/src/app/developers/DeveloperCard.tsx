'use client'

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPinIcon, StarIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';

const DeveloperCard = ({ developer, isMobile }) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    router.push(`/developers/${developer._id}`);
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
      className={`relative rounded-xl sm:rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg group h-full flex flex-col`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-primary)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        minHeight: '400px'
      }}
      onClick={handleClick}
      whileHover={{ y: -5 }}
    >
      {/* Image Section */}
      <div className="relative" style={{ height: '120px', minHeight: '120px', maxHeight: '120px' }}>
        {developer.logo?.url ? (
          <>
            {!imageLoaded && (
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)' }}
              >
                <div 
                  className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
                  style={{ 
                    borderTopColor: 'var(--color-primary)',
                    borderLeftColor: 'var(--color-primary)' 
                  }}
                />
              </div>
            )}
            <img 
              src={developer.logo.url} 
              alt={developer.name} 
              className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundColor: 'var(--color-surface)' }}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)' }}
          >
            <BuildingOfficeIcon className="text-[var(--color-primary)]/50 w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-5 flex-grow flex flex-col">
        {/* Rating */}
        <div className="flex items-center mb-2 sm:mb-3">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--color-warning)' }} />
          ))}
          <span className="text-xs sm:text-sm ml-1" style={{ color: 'var(--color-text-muted)' }}>5.0 (??)</span>
        </div>
        
        {/* Title */}
        <h3 className="font-poppins text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-1" style={{ color: 'var(--color-text-primary)' }}>
          {developer.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1 sm:gap-2 text-[var(--color-primary)] mb-2 sm:mb-3">
          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="font-poppins text-xs sm:text-sm line-clamp-1">
            {developer.headquarters?.city && `${developer.headquarters.city}, `}
            {developer.headquarters?.state}
            {developer.headquarters?.country && `, ${developer.headquarters.country}`}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {developer.description || 'No description available'}
        </p>
        
        {/* Features */}
        <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4">
          <Tooltip title="Founded Year" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <BuildingOfficeIcon className="text-[var(--color-primary)] w-4 h-4" />
              <span className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {developer.foundedYear || 'N/A'}
              </span>
            </div>
          </Tooltip>
          
          <Tooltip title="Completed Projects" arrow>
            <div className="flex items-center gap-1 sm:gap-2">
              <BuildingOfficeIcon className="text-[var(--color-primary)] w-4 h-4" />
              <span className="text-xs sm:text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {formatProjectsCount(developer.completedProjects)} Projects
              </span>
            </div>
          </Tooltip>
        </div>
        
        {/* Specializations */}
        {developer.specializations?.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Specializations:</div>
            <div className="flex flex-wrap gap-1">
              {developer.specializations.slice(0, 3).map((spec, index) => (
                <span key={index} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                  {spec.name}
                </span>
              ))}
              {developer.specializations.length > 3 && (
                <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                  +{developer.specializations.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* CTA */}
        <div className="pt-3 mt-auto" style={{ borderTop: '1px solid var(--color-border)' }}>
          <motion.button 
            className="w-full bg-transparent border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm
                      group-hover:font-bold"
            style={{ 
              borderColor: 'var(--color-primary)', 
              color: 'var(--color-text-primary)',
              backgroundColor: 'transparent'
            }}
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