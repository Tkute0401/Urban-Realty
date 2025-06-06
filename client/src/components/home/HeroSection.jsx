import React, { useState } from "react";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  const navigation = [
    { 
      name: 'CITY', 
      items: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'] 
    },
    { 
      name: 'PROPERTY', 
      items: ['Apartments', 'Villas', 'Condos', 'Townhouses', 'Commercial'] 
    },
    { 
      name: 'SERVICES', 
      items: ['Valuation', 'Property Management', 'Investment Consulting', 'Interior Design'] 
    },
    { 
      name: 'CONTACT US', 
      items: ['Agents', 'Support', 'Careers', 'Feedback'] 
    }
  ];

  const filters = [
    { name: "Home Type", options: ["All", "House", "Apartment", "Condo"] },
    { name: "Price", options: ["Any", "$0-$500k", "$500k-$1M", "$1M+"] },
    { name: "Bed & Bath", options: ["Any", "1+", "2+", "3+"] },
    { name: "More", options: ["Pool", "Garage", "Pet Friendly"] }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`/properties?search=${searchText.trim()}`);
    }
  };

  const toggleDropdown = (item) => {
    setActiveDropdown(activeDropdown === item ? null : item);
  };

  const toggleMobileDropdown = (item) => {
    setMobileActiveDropdown(mobileActiveDropdown === item ? null : item);
  };

  return (
    <section className="h-[70vh] sm:h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="/building_5.jpg"
          alt="City skyline at night" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Main content container */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-16 rounded-3xl sm:mx-4 md:mx-8 lg:mx-16 xl:mx-32 2xl:mx-40 overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg"></div>
        
        <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col">
          {/* Navbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/vite.png" 
                alt="Logo" 
                className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 hover:scale-105 transition-transform duration-300" 
              />
            </div>

            <nav className="hidden lg:flex gap-4 xl:gap-6 2xl:gap-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 font-poppins text-sm sm:text-base xl:text-lg font-medium text-white hover:text-[#78cadc] transition-colors duration-300"
                  >
                    {item.name}
                    {activeDropdown === item.name ? (
                      <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-40 sm:w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {item.items.map((subItem) => (
                          <a
                            key={subItem}
                            href="#"
                            className="block px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-800 hover:bg-[#78cadc]/10 hover:text-[#08171A] transition-colors duration-200 border-b border-white/10 last:border-0"
                          >
                            {subItem}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => navigate('/profile')} 
                className="hidden lg:flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors duration-300 text-sm sm:text-base"
              >
                <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-poppins font-semibold">ACCOUNT</span>
              </button>

              <button 
                className="lg:hidden p-1 sm:p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-2 sm:mb-4 md:mb-6">
                <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold mb-1 sm:mb-2 text-white">
                  Find Your <br />Perfect <span className="text-[#78cadc]">Spot.</span>
                </h1>
                
                <p className="text-gray-300 mb-2 sm:mb-4 max-w-xs sm:max-w-md md:max-w-lg mx-auto text-xs sm:text-sm md:text-base">
                  Discover your dream property from our extensive collection of 
                  homes, apartments, and commercial spaces across the country.
                </p>
              </div>

              <div className="text-white text-xs sm:text-sm text-center px-2 sm:px-4 max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                <p className="mb-1">EXPERIENCE THE PERFECT BLEND OF COMFORT AND</p>
                <p>NATURE, CRAFTED FOR YOUR ULTIMATE ESCAPE.</p>
              </div>

              <div className="flex items-center justify-between mb-8 sm:mt-20 md:mb-16 lg:mb-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full overflow-hidden border border-gray-700/50 hover:border-[#78cadc] transition-colors duration-300">
                  <img 
                    src="/building_1.jpg" 
                    alt="Map view" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <div className="bg-white/0 p-1 sm:p-2 rounded-xl">
                  <div className="flex flex-col items-end">
                    <div className="flex gap-1 items-center">
                      <span className="text-yellow-400 text-lg sm:text-xl md:text-2xl lg:text-3xl">★</span>
                      <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">4.9</span>
                    </div>
                    <span className="text-[0.5rem] sm:text-xs font-poppins text-gray-300 text-right mt-0.5">
                      FROM 6,900+ CUSTOMERS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 sm:top-24 left-4 right-4 z-40 bg-black/90 backdrop-blur-lg rounded-2xl border border-white/10 lg:hidden shadow-xl"
          >
            <div className="flex flex-col p-3 sm:p-4">
              {navigation.map((item) => (
                <div key={item.name} className="mb-1 sm:mb-2 last:mb-0">
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    <span className="font-poppins font-medium">{item.name}</span>
                    {mobileActiveDropdown === item.name ? (
                      <ChevronUpIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {mobileActiveDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 sm:pl-4 py-1 sm:py-2">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem}
                              href="#"
                              className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
                            >
                              {subItem}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <button 
                onClick={() => navigate('/profile')} 
                className="lg:hidden flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 mt-1 sm:mt-2 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-poppins font-semibold">ACCOUNT</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search and filter bar */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10 px-4 sm:px-8 gap-3">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/20 backdrop-blur-sm border-0 hover:bg-white/30 transition-colors duration-300">
            <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2 sm:mr-3" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search properties..."
              className="w-full bg-transparent text-xs sm:text-sm outline-none text-white placeholder:text-gray-400 border-0"
            />
          </div>
        </form>

        {/* Filters - shown inline on large screens */}
        <div className="hidden lg:flex items-center justify-center gap-4 w-full max-w-2xl">
          {filters.map((filter) => (
            <div key={filter.name} className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm hover:bg-white/20 transition-colors">
                {filter.name}
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              <div className="absolute left-0 mt-2 w-40 bg-white/90 backdrop-blur-md rounded-lg shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {filter.options.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-[#78cadc]/10 hover:text-[#08171A] transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="px-3 py-1.5 rounded-full bg-[#78cadc] text-[#08171A] text-xs sm:text-sm font-medium hover:bg-[#8DD9E5] transition-colors">
            Save Search
          </button>
        </div>

        {/* Filter button for mobile/small screens */}
        <div className="lg:hidden flex items-center justify-center gap-3 w-full max-w-2xl">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs sm:text-sm hover:bg-white/30 transition-colors"
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
          <button className="px-4 py-2 rounded-full bg-[#78cadc] text-[#08171A] text-xs sm:text-sm font-medium hover:bg-[#8DD9E5] transition-colors">
            Save Search
          </button>
        </div>

        {/* Mobile filters dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden"
            >
              <div className="p-4 grid grid-cols-2 gap-3">
                {filters.map((filter) => (
                  <div key={filter.name} className="col-span-1">
                    <h3 className="text-white text-xs font-medium mb-1">{filter.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {filter.options.map((option) => (
                        <button
                          key={option}
                          className="px-2 py-1 text-xs rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-transparent to-[#08171A] pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;