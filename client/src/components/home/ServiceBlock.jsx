import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ServiceBlock = ({ 
  title, 
  subtitle, 
  buttonText, 
  imageRight = false,
  propertyType = 'House'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const typeMap = {
      'BUY A HOME': 'BUY',
      'RENT A HOME': 'RENT',
      'BUY PLOTS/LAND': 'Land'
    };
    
    navigate(`/properties?propertyType=${typeMap[title] || 'House'}`);
  };

  const isBuyHome = title === "BUY A HOME";
  const isRentHome = title === "RENT A HOME";
  const isPlots = title === "BUY PLOTS/LAND";

  return (
    <section className="py-12 sm:py-16 bg-[#08171A]">
      {/* Divider line */}
      <div className="flex justify-center px-4 sm:px-0">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`h-0.5 bg-[#78CADC] mb-8 sm:mb-10 ${imageRight ? 'mr-auto' : 'ml-auto'}`} 
        />
      </div>
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 sm:gap-20`}>
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-xl sm:rounded-3xl transform translate-x-2 sm:translate-x-4 translate-y-2 sm:translate-y-4"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-xl sm:rounded-3xl overflow-hidden border-2 border-white relative z-10"
            >
              <img 
                src="/building_4.jpg" 
                alt={title} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>
        </div>
        
        <div className="lg:w-1/2 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={imageRight ? "text-left" : "text-right"}
          >
            <span className="text-gray-400 font-poppins font-bold mb-1 sm:mb-2 block tracking-wide text-sm sm:text-base">
              {isBuyHome ? "WANT TO BUY A HOME?" : isRentHome ? "WANT TO RENT A HOME?" : "WANT TO BUY PLOTS/LAND?"}
            </span>
            
            <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white leading-tight">
              {subtitle} <br />
              <span className="text-[#78CADC]">Dream {propertyType}.</span>
            </h2>
            
            <p className="font-poppins text-gray-300 mb-6 sm:mb-8 tracking-wide text-xs sm:text-sm">
              {isBuyHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
               isRentHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
               "EXPLORE RESIDENTIAL, AGRICULTURAL, INDUSTRIAL AND COMMERCIAL PLOTS/LAND."}
            </p>
            
            <div className={`flex ${imageRight ? "justify-start" : "justify-end"}`}>
              <button 
                className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#8DD9E5] transition-colors shadow-lg text-sm sm:text-base"
                onClick={handleClick}
              >
                {!imageRight && <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span>{buttonText}</span>
                {imageRight && <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceBlock;