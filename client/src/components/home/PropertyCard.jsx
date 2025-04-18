// import { useState } from "react";
// import { motion } from "framer-motion";
// import { HeartIcon, HomeIcon, MapPinIcon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
// import propImg from "../../../../images/building_2.jpg"

// const PropertyCard = ({ index }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, delay: index * 0.2 }}
//       className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800"
//     >
//       <div className="relative aspect-video">
//         <img src={propImg} alt="Property" className="w-full h-full object-cover" />
//         <button className="absolute top-4 right-4 p-2 bg-gray-900/50 rounded-full">
//           <HeartIcon className="w-5 h-5 text-white hover:text-red-500 transition-colors" />
//         </button>
//         <div className="absolute bottom-4 right-4 bg-gray-900/70 rounded-full p-1">
//           <UserIcon className="w-5 h-5 text-white" />
//         </div>
//       </div>

//       <div className="p-5">
//         <div className="flex mb-2">
//           {[...Array(5)].map((_, i) => (
//             <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
//           ))}
//           <span className="text-sm text-gray-400 ml-1">5.0 (??)</span>
//         </div>
        
//         <h3 className="font-sans text-xl font-bold text-white mb-2">Building/Apt. Name</h3>
        
//         <div className="flex items-center gap-2 text-red-500 mb-3">
//           <MapPinIcon className="w-4 h-4" />
//           <span className="font-sans text-sm">LOCATION ADDRESS</span>
//         </div>
        
//         <p className="text-gray-400 text-sm mb-4">A short description of the property.</p>
        
//         <div className="flex gap-6 mb-4">
//           <div className="flex items-center gap-2">
//             <HomeIcon className="w-4 h-4 text-white" />
//             <span className="text-gray-300 text-sm">1080 sqft</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-gray-300 text-sm">4 Bed</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-gray-300 text-sm">2 Bath</span>
//           </div>
//         </div>
        
//         <div className="flex justify-between items-center pt-2 border-t border-gray-800">
//           <p className="text-2xl font-bold text-white">69,00,000/- ₹</p>
//           <button className="bg-transparent border border-sky-400 text-white px-4 py-2 rounded-lg hover:bg-sky-400/20 transition-all">
//             <span className="font-sans text-sm">Details</span>
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default PropertyCard;

import { useState } from "react";
import { motion } from "framer-motion";
import { HeartIcon, MapPinIcon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
import LocalHotelOutlinedIcon from '@mui/icons-material/LocalHotelOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import propImg from "../../../../images/building_2.jpg"

const PropertyCard = ({ index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.2 }}
      className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800"
    >
      <div className="relative aspect-video">
        <img src={propImg} alt="Property" className="w-full h-full object-cover" />
        <button className="absolute top-4 right-4 p-2 bg-gray-900/50 rounded-full">
          <HeartIcon className="w-5 h-5 text-white hover:text-red-500 transition-colors" />
        </button>
        <div className="absolute bottom-0 right-4 translate-y-1/2 bg-gray-900 border-2 border-gray-800 rounded-full p-2">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
          ))}
          <span className="text-sm text-gray-400 ml-1">5.0 (??)</span>
        </div>
        
        <h3 className="font-sans text-xl font-bold text-white mb-2">Building/Apt. Name</h3>
        
        <div className="flex items-center gap-2 text-red-500 mb-3">
          <MapPinIcon className="w-4 h-4" />
          <span className="font-sans text-sm">LOCATION ADDRESS</span>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">A short description of the property.</p>
        
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <HomeOutlinedIcon />
            <span className="text-gray-300 text-sm">1080 sqft</span>
          </div>
          <div className="flex items-center gap-2">
            <LocalHotelOutlinedIcon />
            <span className="text-gray-300 text-sm">4 Bed</span>
          </div>
          <div className="flex items-center gap-2">
            <BathtubOutlinedIcon />
            <span className="text-gray-300 text-sm">2 Bath</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-800">
          <p className="text-2xl font-bold text-white mb-3">₹ 69,00,000/-</p>
          <button className="w-full bg-transparent border border-sky-400 text-white px-4 py-2 rounded-lg hover:bg-sky-400/20 transition-all">
            <span className="font-sans text-sm">Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;