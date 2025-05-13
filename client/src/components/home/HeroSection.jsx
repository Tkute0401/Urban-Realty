import React, { useState } from "react";
import { MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const navigation = ['CITY', 'PROPERTY', 'SERVICES', 'CONTACT US'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/properties?search=${searchText.trim()}`);
    }
  };

  return (
    <section className="h-[70vh] sm:h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="/building_5.jpg"
          alt="City skyline at night" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-16 rounded-3xl sm:mx-4 md:mx-8 lg:mx-40 overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur"></div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/vite.png" alt="Logo" className="sm:ml-10 w-20 h-20 sm:w-20 sm:h-20" />
            </div>

            <nav className="hidden lg:flex gap-6 xl:gap-10">
              {navigation.map((item) => (
                <a
                  key={item}
                  className="font-poppins text-base xl:text-lg font-medium text-white hover:text-[#78cadc] transition-colors duration-200 cursor-pointer"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => navigate('/profile')} 
                className="hidden sm:flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors"
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="font-poppins text-sm sm:text-base font-semibold">ACCOUNT</span>
              </button>

              <button 
                className="lg:hidden p-2 text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-full flex flex-col justify-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
            {/* Main text at the top */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="font-poppins text-4xl sm:text-5xl md:text-6xl leading-tight font-bold mb-2 text-white">
                Find Your <br />Perfect <span className="text-[#78cadc]">Spot.</span>
              </h1>
              
              <p className="text-gray-300 mb-4 sm:mb-6 max-w-md sm:max-w-xl mx-auto text-sm sm:text-base">
                Discover your dream property from our extensive collection of 
                homes, apartments, and commercial spaces across the country.
              </p>
            </div>

            {/* Center text in its own row */}
            <div className="text-white text-xs sm:text-sm text-center px-2 sm:px-4 max-w-xs sm:max-w-lg mx-auto mb-6 sm:mb-8">
              <p className="mb-1">EXPERIENCE THE PERFECT BLEND OF COMFORT AND</p>
              <p>NATURE, CRAFTED FOR YOUR ULTIMATE ESCAPE.</p>
            </div>

            {/* Bottom row with circular image and rating */}
            <div className="flex items-center justify-between mb-16 sm:mb-0"> {/* Added mb-16 for mobile */}
              {/* Circular image on the left */}
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-gray-700/50">
                <img 
                  src="/building_1.jpg" 
                  alt="Map view" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating on the right */}
              <div className="bg-white/0 p-2 sm:p-4 rounded-xl">
                <div className="flex flex-col items-end">
                  <div className="flex gap-1 mb-1 items-center">
                    <span className="text-yellow-400 text-2xl sm:text-3xl">★</span>
                    <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">4.9</span>
                  </div>
                  <span className="text-xs sm:text-sm font-poppins text-gray-300 text-right">FROM 6,900+ CUSTOMERS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 left-4 right-4 z-40 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 lg:hidden"
        >
          <div className="flex flex-col p-4">
            {navigation.map((item) => (
              <a
                key={item}
                className="font-poppins text-lg font-medium text-white py-3 px-4 hover:bg-white/10 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => navigate('/profile')} 
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 mt-2 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors"
            >
              <UserIcon className="w-5 h-5 text-white" />
              <span className="font-poppins font-semibold">ACCOUNT</span>
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Search bar - moved outside the main container and adjusted positioning */}
      <form onSubmit={handleSearch} className="absolute bottom-8 left-4 right-4 sm:left-10 sm:right-10 flex justify-center z-10">
        <div className="max-w-2xl w-full mx-4 sm:mx-8">
          <div className="relative flex items-center px-4 sm:px-6 py-3 sm:py-4 rounded-full bg-white/20 backdrop-blur-sm border-0">
            <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white mr-2 sm:mr-3" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Didn't find what you're looking for? Try searching here..."
              className="w-full bg-transparent outline-none text-white placeholder:text-gray-400 border-0 text-sm sm:text-base"
            />
          </div>
        </div>
      </form>
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-transparent to-[#08171A] pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;