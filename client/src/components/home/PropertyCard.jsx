import { useState } from "react";
import { motion } from "framer-motion";
import { HeartIcon, HomeIcon, MapPinIcon, StarIcon, UserIcon } from "@heroicons/react/24/outline";
const PropertyCard = ({ index }) => {
  const [ref, inView] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.2 }}
      className="bg-gray-900 rounded-3xl overflow-hidden border border-gray-800"
    >
      <div className="relative aspect-video">
        <img src="/api/placeholder/400/250" alt="Property" className="w-full h-full object-cover" />
        <button className="absolute top-4 right-4 p-2 bg-gray-900/50 rounded-full">
          <HeartIcon className="w-5 h-5 text-white hover:text-red-500 transition-colors" />
        </button>
        <div className="absolute bottom-4 right-4 bg-gray-900/70 rounded-full p-1">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="p-5">
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
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
            <HomeIcon className="w-4 h-4 text-white" />
            <span className="text-gray-300 text-sm">1080 sqft</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">4 Bed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm">2 Bath</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
          <p className="text-2xl font-bold text-white">69,00,000/- ₹</p>
          <button className="bg-transparent border border-sky-400 text-white px-4 py-2 rounded-lg hover:bg-sky-400/20 transition-all">
            <span className="font-sans text-sm">Details</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;