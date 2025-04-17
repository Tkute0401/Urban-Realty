import { useState } from 'react';
import { BuildingOfficeIcon, UserIcon, MagnifyingGlassIcon, HeartIcon, HomeIcon, MapPinIcon, StarIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion, useInView } from "framer-motion";

// BlurHeader Component
const BlurHeader = () => {
  const navigation = ['CITY', 'PROPERTY', 'SERVICES', 'CONTACT US'];
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 w-full h-20 bg-black/80 backdrop-blur-md z-50"
    >
      <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BuildingOfficeIcon className="w-8 h-8 text-sky-400" />
          <span className="font-serif text-2xl font-bold text-white">UR 360</span>
        </div>

        <nav className="hidden lg:flex gap-10">
          {navigation.map((item) => (
            <a
              key={item}
              className="font-sans text-lg font-medium text-white hover:text-sky-400 transition-colors duration-200 cursor-pointer"
            >
              {item}
            </a>
          ))}
        </nav>

        <button className="flex items-center gap-2 px-4 py-2.5 border border-sky-400 rounded-lg text-white hover:bg-sky-400/20 transition-colors">
          <UserIcon className="w-5 h-5 text-white" />
          <span className="font-sans font-semibold">ACCOUNT</span>
        </button>
      </div>
    </motion.header>
  );
};

export default BlurHeader;