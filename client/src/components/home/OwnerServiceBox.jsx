import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const OwnerServiceBlock = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#08171A]">
      {/* Divider line */}
      <div className="flex justify-center px-4 sm:px-0">
        <motion.div 
          initial={{ width: 0, marginRight: 'auto' }}
          animate={{ width: "60%", marginRight: 'auto' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-0.5 bg-[#78CADC] w-full mb-8 sm:mb-10" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col lg:flex-row-reverse gap-10 sm:gap-20">
        {/* Image section */}
        <div className="lg:w-1/2">
          <div className="relative">
            {/* White background frame */}
            <div className="absolute w-full h-full -ml-3 sm:-ml-5 mt-3 sm:mt-4 rounded-2xl sm:rounded-3xl bg-white border-2 border-white"></div>
            
            {/* Image container */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white relative z-10"
            >
              <img 
                src="/building_4.jpg" 
                alt="Property for sale or rent" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>
        </div>
        
        {/* Content section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 flex flex-col justify-center"
        >
          <div className="text-left">
            <span className="text-gray-400 font-poppins font-bold block tracking-wide text-sm sm:text-base">
              ARE YOU AN OWNER?
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mt-2 sm:mt-0">
              Sell or Rent <span className="text-[#78cadc]">Your Property</span> Faster with
              <br />Urban Realty 360
            </h2>
            <p className="font-poppins text-gray-300 mt-2 tracking-wide text-xs sm:text-sm mb-6 sm:mb-8">
              SELL OR RENT YOUR RESIDENTIAL/COMMERCIAL PROPERTY.
            </p>
            
            <div className="flex justify-start sm:justify-center sm:mr-25">
              <button className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-sky-300 transition-colors shadow-lg text-sm sm:text-base">
                <span>Post Your Property</span>
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OwnerServiceBlock;