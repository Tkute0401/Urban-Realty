import React, { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import backgroundImage from "../../../dist/assets/images/building_5.jpg";
import mapImg from "../../../../images/building_2.jpg"
import { UserIcon } from "@heroicons/react/24/outline";

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const navigation = ['CITY', 'PROPERTY', 'SERVICES', 'CONTACT US'];
  
  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <img 
          src={backgroundImage}
          alt="City skyline at night" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blurred container with margins */}
      <div className="absolute inset-x-8 top-4 bottom-16 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-white/20 backdrop-blur-md"></div>
        
        {/* Header */}
        <div className="relative w-full max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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

            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors">
              <UserIcon className="w-5 h-5 text-white" />
              <span className="font-sans font-semibold">ACCOUNT</span>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="relative h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="font-serif text-6xl leading-tight font-bold mb-2 text-white">
                Find Your <br />Perfect <span className="text-sky-400">Spot.</span>
              </h1>
              
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Ut elit tellus, luctus nec ullamcorper mattis, pulvinar
                dapibus leo.
              </p>
            </motion.div>

            {/* Side-by-side layout for map, text and rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              {/* Left: Round Map */}
              <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-700/50">
                <img 
                  src={mapImg} 
                  alt="Map view" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Center: Text */}
              <div className="text-white text-sm text-center px-4 max-w-lg">
                <p className="mb-1">EXPERIENCE THE PERFECT BLEND OF COMFORT AND</p>
                <p>NATURE, CRAFTED FOR YOUR ULTIMATE ESCAPE.</p>
              </div>
              
              {/* Right: Rating Box */}
              <div className="bg-white/0 p-4 rounded-xl">
                <div className="flex gap-1 mb-1 items-center">
                  <span className="text-yellow-400 text-3xl">★</span>
                  <span className="text-white text-5xl font-bold">4.9</span>
                </div>
                <span className="text-sm font-sans text-gray-300">FROM 6,900+ CUSTOMERS</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Search input positioned at the bottom border of blurry section */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center" style={{ transform: "translateY(50%)" }}>
        <div className="max-w-2xl w-full mx-8">
          <div className="relative flex items-center px-6 py-4 rounded-full bg-white/20 backdrop-blur-md border-0">
            <MagnifyingGlassIcon className="w-6 h-6 text-white mr-3" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Didn't find what you're looking for? Try searching here..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;