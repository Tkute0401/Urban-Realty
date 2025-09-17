
'use client'

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ServiceBlockProps {
  title: string;
  subtitle: string;
  buttonText: string;
  imageRight?: boolean;
  propertyType?: string;
}

const ServiceBlock: React.FC<ServiceBlockProps> = ({ 
  title, 
  subtitle, 
  buttonText, 
  imageRight = false,
  propertyType = 'House'
}) => {
  console.log('🔧 ServiceBlock rendering...', { title });
  
  React.useEffect(() => {
    console.log('🔧 ServiceBlock mounted on client side!', { title });
  }, [title]);
  const router = useRouter();

  const handleClick = () => {
    const typeMap = {
      'BUY A HOME': 'BUY',
      'RENT A HOME': 'RENT',
      'BUY PLOTS/LAND': 'Land'
    };
    
    router.push(`/properties?propertyType=${typeMap[title] || 'House'}`);
  };

  const isBuyHome = title === "BUY A HOME";
  const isRentHome = title === "RENT A HOME";
  const isPlots = title === "BUY PLOTS/LAND";

  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-[var(--color-bg-dark)]">
      {/* Divider line with enhanced responsive behavior */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`h-0.5 bg-[var(--color-primary)] mb-8 sm:mb-10 lg:mb-12 ${imageRight ? 'mr-auto' : 'ml-auto'}`} 
        />
      </div>
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 sm:gap-14 lg:gap-20 xl:gap-24`}>
        <div className="lg:w-1/2 xl:w-[48%]">
          <div className="relative">
            {/* Enhanced responsive white frame */}
            <div className={`absolute inset-0 bg-white rounded-t-xl sm:rounded-t-2xl lg:rounded-t-3xl border-2 border-white transform ${
              imageRight ? 'translate-x-2 sm:translate-x-3 md:translate-x-4' : '-translate-x-2 sm:-translate-x-3 md:-translate-x-4'
            } translate-y-3 sm:translate-y-4 md:translate-y-5 lg:translate-y-6`}></div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-t-xl sm:rounded-t-2xl lg:rounded-t-3xl overflow-hidden border-2 border-white relative z-10"
            >
              <img 
                src="/building_4.jpg" 
                alt={title} 
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          </div>
        </div>
        
        <div className="lg:w-1/2 xl:w-[52%] flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={imageRight ? "text-left" : "text-right"}
          >
            <span className="text-gray-400 font-poppins font-bold mb-2 sm:mb-3 md:mb-4 block tracking-wide text-xs sm:text-sm md:text-base lg:text-lg">
              {isBuyHome ? "WANT TO BUY A HOME?" : isRentHome ? "WANT TO RENT A HOME?" : "WANT TO BUY PLOTS/LAND?"}
            </span>
            
            <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold mb-3 sm:mb-4 md:mb-5 text-white leading-tight">
              {subtitle} <br className="hidden sm:block" />
              <span className="text-[var(--color-primary)]">Dream {propertyType}.</span>
            </h2>
            
            <p className="font-poppins text-gray-300 mb-6 sm:mb-8 md:mb-10 tracking-wide text-xs sm:text-sm md:text-base">
              {isBuyHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
               isRentHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
               "EXPLORE RESIDENTIAL, AGRICULTURAL, INDUSTRIAL AND COMMERCIAL PLOTS/LAND."}
            </p>
            
            <div className={`flex ${imageRight ? "justify-start" : "justify-end"}`}>
              <button 
                className="flex items-center gap-2 bg-[var(--color-primary)] text-[var(--color-bg-dark)] font-bold px-4 sm:px-5 md:px-6 py-2 sm:py-3 md:py-3.5 rounded-lg md:rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
                onClick={handleClick}
              >
                {!imageRight && <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
                <span>{buttonText}</span>
                {imageRight && <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceBlock;