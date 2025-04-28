// import { ChevronRightIcon } from "@heroicons/react/24/outline";

// const OwnerServiceBlock = () => {
//   return (
//     <section className="py-16 bg-[#08171A]">
//       <div className="max-w-7xl mx-auto px-8">
//         <div className="mb-6">
//           {/* Text alignment adjusted to match the design exactly */}
//           <span className="text-gray-400 font-sans font-bold block tracking-wide">ARE YOU AN OWNER?</span>
//           <h2 className="font-serif text-4xl font-bold text-white leading-tight">
//             Sell or Rent <span className="text-[#78cadc]">Your Property</span> Faster with
//             <br />Urban Realty 360
//           </h2>
//           <p className="font-sans text-gray-300 mt-2 tracking-wide text-sm">
//             SELL OR RENT YOUR RESIDENTIAL/COMMERCIAL PROPERTY.
//           </p>
//         </div>
        
//         <button className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-lg hover:bg-sky-300 transition-colors">
//           <span>Post Your Property</span>
//           <ChevronRightIcon className="w-5 h-5" />
//         </button>
//       </div>
//     </section>
//   );
// };

// export default OwnerServiceBlock;

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const OwnerServiceBlock = () => {
  return (
    <section className="py-16 bg-[#08171A]">
      {/* Divider line with animation - 60% width, thicker, and #78CADC color */}
      <div className="flex justify-center">
        <motion.div 
          initial={{ width: 0, marginRight: 'auto' }}
          animate={{ width: "60%", marginRight: 'auto' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-0.5 bg-[#78CADC] w-full mb-10" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row-reverse gap-12">
        {/* Image section - now on the right */}
        <div className="lg:w-1/2">
          {/* Image with white border effect - matches ServiceBlock */}
          <div className="relative">
            {/* White background frame with shadow */}
            <div className={`
              absolute w-full h-full -ml-5 mt-4 rounded-3xl bg-white border-2 border-white
            `}></div>
            
            {/* Image container with animation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border-2 border-white relative z-10"
            >
              <img 
                src="/building_4.jpg" 
                alt="Property for sale or rent" 
                className="w-full h-full object-cover" 
              />
            </motion.div>
          </div>
        </div>
        
        {/* Content section - now on the left */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:w-1/2 flex flex-col justify-center"
        >
          <div className="text-left">
            <span className="text-gray-400 font-sans font-bold block tracking-wide">ARE YOU AN OWNER?</span>
            <h2 className="font-serif text-4xl font-bold text-white leading-tight">
              Sell or Rent <span className="text-[#78cadc]">Your Property</span> Faster with
              <br />Urban Realty 360
            </h2>
            <p className="font-sans text-gray-300 mt-2 tracking-wide text-sm mb-8">
              SELL OR RENT YOUR RESIDENTIAL/COMMERCIAL PROPERTY.
            </p>
            
            <div className="flex justify-center mr-25">
              <button className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-xl hover:bg-sky-300 transition-colors shadow-lg">
                <span>Post Your Property</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OwnerServiceBlock;