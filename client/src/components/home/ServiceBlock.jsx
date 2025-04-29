// // import React from "react";
// // import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// // import { useNavigate } from "react-router-dom";
// // import { motion } from "framer-motion";

// // const ServiceBlock = ({ 
// //   title, 
// //   subtitle, 
// //   buttonText, 
// //   imageRight = false,
// //   propertyType = 'House'
// // }) => {
// //   const navigate = useNavigate();

// //   const handleClick = () => {
// //     const typeMap = {
// //       'BUY A HOME': 'BUY',
// //       'RENT A HOME': 'RENT',
// //       'BUY PLOTS/LAND': 'Land'
// //     };
    
// //     navigate(`/properties?propertyType=${typeMap[title] || 'House'}`);
// //   };

// //   // Determine the section type based on title
// //   const isBuyHome = title === "BUY A HOME";
// //   const isRentHome = title === "RENT A HOME";
// //   const isPlots = title === "BUY PLOTS/LAND";

// //   return (
// //     <section className="py-16 bg-[#08171A]">
// //       {/* Divider line with animation - 60% width, thicker, and #78CADC color */}
// //       <div className="flex justify-center">
// //         <motion.div 
// //           initial={{ width: 0 }}
// //           animate={{ width: "60%" }}
// //           transition={{ duration: 1.8, ease: "easeInOut" }}
// //           className={`h-0.5 bg-[#78CADC] mb-10 ${imageRight ? 'mr-auto' : 'ml-auto'}`} 
// //         />
// //       </div>
      
// //       <div className={`max-w-7xl mx-auto px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12`}>
// //         <div className="lg:w-1/2">
// //           {/* Image with white border effect */}
// //           <div className="relative">
// //             {/* White background frame with shadow */}
// //             <div className={`
// //               absolute w-full h-full mt-14 rounded-3xl bg-white border-2 border-white
// //               ${imageRight ? '-ml-15' : '-ml-15'}
// //             `}></div>
            
// //             {/* Image container with animation */}
// //             <motion.div
// //               initial={{ opacity: 0, y: 50 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.6 }}
// //               className="rounded-3xl overflow-hidden border-2 border-white relative z-10"
// //             >
// //               <img 
// //                 src="/building_4.jpg" 
// //                 alt={title} 
// //                 className="w-full h-full object-cover" 
// //               />
// //             </motion.div>
// //           </div>
// //         </div>
        
// //         <div className="lg:w-1/2 flex flex-col justify-center">
// //           {/* Text alignment based on image position */}
// //           <motion.div 
// //             initial={{ opacity: 0, y: 30 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.2 }}
// //             className={imageRight ? "text-left" : "text-right"}
// //           >
// //             <span className="text-gray-400 font-sans font-bold mb-2 block tracking-wide">
// //               {isBuyHome ? "WANT TO BUY A HOME?" : isRentHome ? "WANT TO RENT A HOME?" : "WANT TO BUY PLOTS/LAND?"}
// //             </span>
            
// //             <h2 className="font-serif text-5xl font-bold mb-4 text-white leading-tight">
// //               {subtitle} <br />
// //               <span className="text-[#78CADC]">Dream {propertyType}.</span>
// //             </h2>
            
// //             <p className="font-sans text-gray-300 mb-8 tracking-wide">
// //               {isBuyHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
// //                isRentHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
// //                "EXPLORE RESIDENTIAL, AGRICULTURAL, INDUSTRIAL AND COMMERCIAL PLOTS/LAND."}
// //             </p>
            
// //             <div className={`flex ${imageRight ? "justify-center mr-25" : "justify-center ml-20"}`}>
// //               <button 
// //                 className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-xl hover:bg-[#8DD9E5] transition-colors shadow-lg"
// //                 onClick={handleClick}
// //               >
// //                 {/* Fixed arrow direction based on image position */}
// //                 {imageRight && <ChevronLeftIcon className="w-5 h-5" />}
// //                 <span>{buttonText}</span>
// //                 {!imageRight && <ChevronRightIcon className="w-5 h-5" />}
// //               </button>
// //             </div>
// //           </motion.div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default ServiceBlock;


// import React from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// const ServiceBlock = ({ 
//   title, 
//   subtitle, 
//   buttonText, 
//   imageRight = false,
//   propertyType = 'House'
// }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     const typeMap = {
//       'BUY A HOME': 'BUY',
//       'RENT A HOME': 'RENT',
//       'BUY PLOTS/LAND': 'Land'
//     };
    
//     navigate(`/properties?propertyType=${typeMap[title] || 'House'}`);
//   };

//   // Determine the section type based on title
//   const isBuyHome = title === "BUY A HOME";
//   const isRentHome = title === "RENT A HOME";
//   const isPlots = title === "BUY PLOTS/LAND";

//   return (
//     <section className="py-16 bg-[#08171A]">
//       {/* Divider line with animation - 60% width, thicker, and #78CADC color */}
//       <div className="flex justify-center">
//         <motion.div 
//           initial={{ width: 0 }}
//           animate={{ width: "60%" }}
//           transition={{ duration: 1.8, ease: "easeInOut" }}
//           className={`h-0.5 bg-[#78CADC] mb-10 ${imageRight ? 'mr-auto' : 'ml-auto'}`} 
//         />
//       </div>
      
//       <div className={`max-w-7xl mx-auto px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12`}>
//         <div className="lg:w-1/2">
//           {/* Image with border effect similar to the reference image */}
//           <div className="relative">
//             {/* Background shadow/frame for depth effect */}
//             <div className="absolute inset-0 bg-white rounded-3xl transform translate-x-4 translate-y-4">
//             ${imageRight ? '-ml-15' : '-ml-15'}
//             </div>
            
//             {/* Image container with animation */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="rounded-3xl overflow-hidden border-2 border-white relative z-10"
//             >
//               <img 
//                 src="/building_4.jpg" 
//                 alt={title} 
//                 className="w-full h-full object-cover" 
//               />
//             </motion.div>
//           </div>
//         </div>
        
//         <div className="lg:w-1/2 flex flex-col justify-center">
//           {/* Text alignment based on image position */}
//           <motion.div 
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className={imageRight ? "text-left" : "text-right"}
//           >
//             <span className="text-gray-400 font-sans font-bold mb-2 block tracking-wide">
//               {isBuyHome ? "WANT TO BUY A HOME?" : isRentHome ? "WANT TO RENT A HOME?" : "WANT TO BUY PLOTS/LAND?"}
//             </span>
            
//             <h2 className="font-serif text-5xl font-bold mb-4 text-white leading-tight">
//               {subtitle} <br />
//               <span className="text-[#78CADC]">Dream {propertyType}.</span>
//             </h2>
            
//             <p className="font-sans text-gray-300 mb-8 tracking-wide">
//               {isBuyHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
//                isRentHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
//                "EXPLORE RESIDENTIAL, AGRICULTURAL, INDUSTRIAL AND COMMERCIAL PLOTS/LAND."}
//             </p>
            
//             <div className={`flex ${imageRight ? "justify-start" : "justify-end"}`}>
//               <button 
//                 className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-xl hover:bg-[#8DD9E5] transition-colors shadow-lg"
//                 onClick={handleClick}
//               >
//                 {/* Arrow direction based on image position */}
//                 {!imageRight && <ChevronLeftIcon className="w-5 h-5" />}
//                 <span>{buttonText}</span>
//                 {imageRight && <ChevronRightIcon className="w-5 h-5" />}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ServiceBlock;

import React from "react";
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

  // Determine the section type based on title
  const isBuyHome = title === "BUY A HOME";
  const isRentHome = title === "RENT A HOME";
  const isPlots = title === "BUY PLOTS/LAND";

  return (
    <section className="py-16 bg-[#08171A]">
      {/* Divider line with consistent thickness */}
      <div className="flex justify-center">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={`h-0.5 bg-[#78CADC] mb-10 ${imageRight ? 'mr-auto' : 'ml-auto'}`} 
        />
      </div>
      
      <div className={`max-w-7xl mx-auto px-8 flex flex-col ${imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-20`}>
        <div className="lg:w-1/2">
          {/* Image with border effect similar to the reference image */}
          <div className="relative">
            {/* Background shadow/frame for depth effect */}
            <div className="absolute inset-0 bg-white rounded-3xl transform translate-x-4 translate-y-4"></div>
            
            {/* Image container with animation */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl overflow-hidden border-2 border-white relative z-10"
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
          {/* Text alignment based on image position */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={imageRight ? "text-left" : "text-right"}
          >
            <span className="text-gray-400 font-sans font-bold mb-2 block tracking-wide">
              {isBuyHome ? "WANT TO BUY A HOME?" : isRentHome ? "WANT TO RENT A HOME?" : "WANT TO BUY PLOTS/LAND?"}
            </span>
            
            <h2 className="font-serif text-5xl font-bold mb-4 text-white leading-tight">
              {subtitle} <br />
              <span className="text-[#78CADC]">Dream {propertyType}.</span>
            </h2>
            
            <p className="font-sans text-gray-300 mb-8 tracking-wide">
              {isBuyHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
               isRentHome ? "EXPLORE FROM APARTMENTS, ROW HOUSES, BUNGALOW AND MANY MORE." :
               "EXPLORE RESIDENTIAL, AGRICULTURAL, INDUSTRIAL AND COMMERCIAL PLOTS/LAND."}
            </p>
            
            <div className={`flex ${imageRight ? "justify-start" : "justify-end"}`}>
              <button 
                className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-xl hover:bg-[#8DD9E5] transition-colors shadow-lg"
                onClick={handleClick}
              >
                {/* Arrow direction based on image position */}
                {!imageRight && <ChevronLeftIcon className="w-5 h-5" />}
                <span>{buttonText}</span>
                {imageRight && <ChevronRightIcon className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServiceBlock;