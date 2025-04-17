import React, { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
// import StarIcon from "@heroicons/react/12/outline";
const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  
  return (
    <section className="pt-40 pb-32 bg-gray-900 relative">
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="max-w-7xl mx-auto px-8 relative">
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="relative flex items-center px-6 py-4 rounded-full bg-gray-800/80 backdrop-blur border border-gray-700">
              <MagnifyingGlassIcon className="w-6 h-6 text-sky-400 mr-3" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Didn't find what you're looking for? Try searching here..."
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="relative h-80 bg-gray-800 rounded-3xl overflow-hidden"
        >
          {/* Map implementation */}
          <div className="absolute inset-0 bg-gray-700" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-7 right-7 bg-black/70 backdrop-blur p-4 rounded-xl"
          >
            <div className="flex gap-1 mb-1">
              {/* <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" /> */}
              <span className="text-white text-2xl font-bold">4.9</span>
            </div>
            <span className="text-sm font-sans text-gray-300">FROM 6,900+ CUSTOMERS</span>
          </motion.div>
          
          <div className="absolute bottom-7 left-7 text-white text-sm">
            <p className="mb-1">EXPERIENCE THE PERFECT BLEND OF COMFORT AND</p>
            <p>NATURE, CRAFTED FOR YOUR ULTIMATE ESCAPE.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;