'use client'

import React from 'react';
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const OwnerServiceBlock = () => {
  console.log('🔧 OwnerServiceBlock rendering...');
  
  React.useEffect(() => {
    console.log('🔧 OwnerServiceBlock mounted on client side!');
  }, []);
  const router = useRouter();
  const { user } = useAuth();

  const canPostProperty = !!user && [
    'individual_seller',
    'agent',
    'developer',
    'admin'
  ].includes(user.role);

  const handlePostClick = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (canPostProperty) {
      router.push('/add-property');
      return;
    }
    router.push('/register');
  };
  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-[var(--color-surface)]">
      {/* Divider line - Enhanced responsiveness */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ width: 0, marginRight: 'auto' }}
          animate={{ width: "60%", marginRight: 'auto' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-0.5 bg-[var(--color-primary)] w-full mb-8 sm:mb-10 lg:mb-12" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row-reverse gap-10 sm:gap-14 lg:gap-20 xl:gap-24">
        {/* Image section with enhanced responsive sizing */}
        <div className="lg:w-1/2 xl:w-[48%]">
          <div className="relative">
            {/* White background frame with responsive adjustments */}
            <div className="absolute w-full h-full ml-2 sm:ml-3 md:ml-4 lg:ml-5 mt-4 sm:mt-5 md:mt-6 lg:mt-7 rounded-t-xl sm:rounded-t-2xl lg:rounded-t-3xl border-2 border-white bg-white"></div>
            
            {/* Image container with responsive animations */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-t-xl sm:rounded-t-2xl lg:rounded-t-3xl overflow-hidden border-2 border-white relative z-10"
            >
              <img 
                src="/building_4.jpg" 
                alt="Property for sale or rent" 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
        
        {/* Content section with enhanced typography responsiveness */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 xl:w-[52%] flex flex-col justify-center"
        >
          <div className="text-left">
            <span className="text-[var(--color-text-muted)] font-poppins font-bold block tracking-wide text-xs sm:text-sm md:text-base lg:text-lg">
              ARE YOU AN OWNER?
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-[var(--color-text)] leading-tight mt-2 sm:mt-3 md:mt-4">
              Sell or Rent <span className="text-[var(--color-primary)]">Your Property</span> Faster with
              <br className="hidden sm:block" />SQUAREFOOT
            </h2>
            <p className="font-poppins text-[var(--color-text-muted)] mt-3 sm:mt-4 tracking-wide text-xs sm:text-sm md:text-base mb-6 sm:mb-8 md:mb-10">
              SELL OR RENT YOUR RESIDENTIAL/COMMERCIAL PROPERTY.
            </p>
            
            <div className="flex justify-start">
              <button onClick={handlePostClick} className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-bold px-4 sm:px-5 md:px-6 py-2 sm:py-3 md:py-3.5 rounded-lg md:rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg">
                <span>{canPostProperty ? 'Post Your Property' : (user ? 'Switch to a posting account' : 'Login to Post Property')}</span>
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </motion.div>
      </div><br/><br/><br/><br/>
    </section>
  );
};

export default OwnerServiceBlock;