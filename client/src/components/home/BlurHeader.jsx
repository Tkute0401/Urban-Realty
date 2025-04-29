import { useState } from 'react';
import { UserIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// BlurHeader Component
const BlurHeader = () => {
  const navigation = ['CITY', 'PROPERTY', 'SERVICES', 'CONTACT US'];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div className="max-w-7xl mx-auto bg-black/70 backdrop-blur-md rounded-3xl border border-white/10">
        <div className="px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-Poppins text-2xl font-bold text-white">UR 360</span>
          </div>

          <nav className="hidden lg:flex gap-10">
            {navigation.map((item) => (
              <a
                key={item}
                className="font-poppins text-lg font-medium text-white hover:text-sky-400 transition-colors duration-200 cursor-pointer"
              >
                {item}
              </a>
            ))}
          </nav>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors">
            <UserIcon className="w-5 h-5 text-white" />
            <span className="font-poppins font-semibold">ACCOUNT</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlurHeader;