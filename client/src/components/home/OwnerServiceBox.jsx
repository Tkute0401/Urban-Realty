import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const OwnerServiceBlock = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-[#08171A]">
      {/* Divider line - Enhanced responsiveness */}
      <div className="flex justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ width: 0, marginRight: 'auto' }}
          animate={{ width: "60%", marginRight: 'auto' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-0.5 bg-[#78CADC] w-full mb-8 sm:mb-10 lg:mb-12" 
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
            <span className="text-gray-400 font-poppins font-bold block tracking-wide text-xs sm:text-sm md:text-base lg:text-lg">
              ARE YOU AN OWNER?
            </span>
            <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white leading-tight mt-2 sm:mt-3 md:mt-4">
              Sell or Rent <span className="text-[#78cadc]">Your Property</span> Faster with
              <br className="hidden sm:block" />Urban Realty 360
            </h2>
            <p className="font-poppins text-gray-300 mt-3 sm:mt-4 tracking-wide text-xs sm:text-sm md:text-base mb-6 sm:mb-8 md:mb-10">
              SELL OR RENT YOUR RESIDENTIAL/COMMERCIAL PROPERTY.
            </p>
            
            <div className="flex justify-start">
              <button className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-4 sm:px-5 md:px-6 py-2 sm:py-3 md:py-3.5 rounded-lg md:rounded-xl hover:bg-sky-300 transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg">
                <span>Post Your Property</span>
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