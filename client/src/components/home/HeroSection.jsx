import React, { useState, useRef, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useAuth} from '../../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import AccountSidebar from './AccountSidebar';
import { useProperties } from '../../context/PropertiesContext';
const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [localityStartIndex, setLocalityStartIndex] = useState(0);
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('ALL');
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const { user } = useAuth();
  const { properties, loading: propertiesLoading, getProperties } = useProperties();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const localitiesContainerRef = useRef(null);
  
  const navigation = [];
  const [visibleLocalitiesCount, setVisibleLocalitiesCount] = useState(5);

  useEffect(() => {
    getProperties();
  }, []);
  // Get unique cities from properties data
  const getAvailableCities = () => {
    if (!properties || properties.length === 0) return [];
    
    const citiesSet = new Set();
    properties.forEach(property => {
      if (property.address?.city) {
        citiesSet.add(property.address.city);
      }
    });
    
    return Array.from(citiesSet).sort();
  };

  const availableCities = getAvailableCities();

  // Filter cities based on search query
  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  // Get localities for the selected city from properties
  const getLocalitiesForCity = () => {
    if (!properties || properties.length === 0 || !selectedCity) return [];
    
    const localitiesSet = new Set();
    properties.forEach(property => {
      if (property.address?.city === selectedCity && property.address?.locality) {
        localitiesSet.add(property.address.locality);
      }
    });
    
    return Array.from(localitiesSet).sort();
  };

  const currentCityLocalities = getLocalitiesForCity();

  useEffect(() => {
    // Initialize from URL params if they exist
    const params = Object.fromEntries(searchParams.entries());
    if (params.search) setSearchText(params.search);
    if (params.city) {
      // Only set city if it exists in available cities
      if (availableCities.includes(params.city)) {
        setSelectedCity(params.city);
      }
    }
    if (params.propertyType) {
      setSelectedTab(params.propertyType === 'BUY' ? 'BUY' : params.propertyType === 'RENT' ? 'RENT' : 'ALL');
    }

    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleLocalitiesCount(3);
      } else if (window.innerWidth < 768) {
        setVisibleLocalitiesCount(4);
      } else if (window.innerWidth < 1024) {
        setVisibleLocalitiesCount(5);
      } else {
        setVisibleLocalitiesCount(6);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [searchParams, availableCities]);

  // Set default city if none selected but cities are available
  useEffect(() => {
    if (!selectedCity && availableCities.length > 0) {
      setSelectedCity(availableCities[0]);
    }
  }, [availableCities]);

  useEffect(() => {
    setLocalityStartIndex(0);
  }, [selectedCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim() || selectedCity) {
      const newSearchParams = new URLSearchParams();
      if (searchText.trim()) newSearchParams.set('search', searchText.trim());
      if (selectedCity) newSearchParams.set('city', selectedCity);
      if (selectedTab !== 'ALL') newSearchParams.set('propertyType', selectedTab);
      
      navigate(`/properties?${newSearchParams.toString()}`);
    }
  };

  const toggleDropdown = (item) => {
    setActiveDropdown(activeDropdown === item ? null : item);
  };

  const toggleMobileDropdown = (item) => {
    setMobileActiveDropdown(mobileActiveDropdown === item ? null : item);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
    setCitySearchQuery("");
    
    const newSearchParams = new URLSearchParams();
    if (searchText.trim()) newSearchParams.set('search', searchText.trim());
    newSearchParams.set('city', city);
    if (selectedTab !== 'ALL') newSearchParams.set('propertyType', selectedTab);
  };

  const handleNextLocalities = () => {
    const maxStartIndex = Math.max(0, currentCityLocalities.length - visibleLocalitiesCount);
    if (localityStartIndex < maxStartIndex) {
      setLocalityStartIndex(prev => Math.min(prev + 1, maxStartIndex));
    } else {
      setLocalityStartIndex(0);
    }
  };

  const visibleLocalities = currentCityLocalities.slice(localityStartIndex, localityStartIndex + visibleLocalitiesCount);

  return (
    <section className="h-[70vh] sm:h-screen relative flex items-center justify-center overflow-visible z-0">
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
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm overflow-hidden border border-white/30"></div>
        
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
                onClick={() => setIsAccountSidebarOpen(true)} 
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
                <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-bold mb-1 sm:mb-8 text-white">
                  Find Your <br />Perfect <span className="text-[#78cadc]">Spot.</span>
                </h1><br/>
                
                <p className="text-white mb-2 sm:mb-4 max-w-xs sm:max-w-md md:max-w-lg mx-auto text-xs sm:text-lg md:text-base">
                  Discover your dream property from our extensive collection of 
                  homes, apartments, and commercial spaces across the country.
                </p>
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
            className="fixed top-20 sm:top-24 left-4 right-4 z-[9997] bg-black/90 backdrop-blur-sm rounded-2xl border border-white/10 lg:hidden shadow-xl"
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
                onClick={() => {
                  setIsAccountSidebarOpen(true);
                  setIsMenuOpen(false);
                }} 
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
      <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center z-[100] px-4 sm:px-6 lg:px-10 gap-4 transform translate-y-1/2">
        {/* Popular localities with scrolling */}
        {selectedCity && currentCityLocalities.length > 0 && (
          <div className="w-full max-w-2xl">          
            <div className="flex items-center justify-center gap-2 sm:gap-2 text-white/80 mb-3 flex-wrap">
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Popular Localities in {selectedCity}:</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <div 
                  ref={localitiesContainerRef}
                  className="flex gap-2 transition-transform duration-500 ease-in-out"
                >
                  <AnimatePresence mode="wait">
                    {visibleLocalities.map((locality, index) => (
                      <motion.button
                        key={`${selectedCity}-${locality}-${localityStartIndex + index}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          ease: "easeOut"
                        }}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors whitespace-nowrap flex-shrink-0"
                        onClick={() => {
                          const newSearchParams = new URLSearchParams();
                          newSearchParams.set('city', selectedCity);
                          newSearchParams.set('search', locality);
                          if (selectedTab !== 'ALL') newSearchParams.set('propertyType', selectedTab);
                          navigate(`/properties?${newSearchParams.toString()}`);
                        }}
                      >
                        {locality}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
                {currentCityLocalities.length > visibleLocalitiesCount && (
                  <motion.button
                    onClick={handleNextLocalities}
                    className="p-1 sm:p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main search container */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20 relative" style={{ zIndex: 200 }}>
          {/* Property type tabs */}
          <div className="flex gap-0 mb-2 rounded-xl p-1">
            {['ALL', 'BUY', 'RENT', 'COMMERCIAL'].map((tab) => (
              <button
                key={tab}
                className={`relative flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden ${
                  selectedTab === tab 
                    ? 'text-white' 
                    : 'text-white/80 hover:text-white'
                }`}
                onClick={() => {
                  setSelectedTab(tab);
                  const newSearchParams = new URLSearchParams();
                  if (searchText.trim()) newSearchParams.set('search', searchText.trim());
                  if (selectedCity) newSearchParams.set('city', selectedCity);
                  if (tab !== 'ALL') newSearchParams.set('propertyType', tab);
                }}
              >
                <span className="relative z-10">{tab}</span>
                {selectedTab === tab && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#78cadc]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search input section */}
          <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl overflow-visible border border-white/20 maX-h-12">
              {/* City dropdown */}
              {availableCities.length > 0 && (
                <div className="relative flex-shrink-0 border-r border-white/20 overflow-visible max-h-12" style={{ zIndex: 9000 }}>
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 text-white transition-colors min-w-[100px] sm:min-w-[120px]"
                    disabled={propertiesLoading}
                  >
                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {propertiesLoading ? 'Loading...' : selectedCity || 'Select city'}
                    </span>
                    <ChevronDownIcon className={`w-3 h-3 sm:w-4 sm:h-4 text-white/70 transition-transform flex-shrink-0 ${showCityDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-1 w-48 sm:w-56 bg-white backdrop-blur-lg rounded-xl shadow-2xl overflow-visible border border-gray-200 z-[9999] max-h-60 overflow-y-auto"
                      >
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => handleCitySelect(city)}
                                className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors ${selectedCity === city ? 'bg-[#78cadc]/10 text-[#78cadc] font-medium' : ''}`}
                              >
                                {city}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-500 text-center">
                              No cities found
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Search input */}
              <div className="flex-1 flex items-center px-3 sm:px-4 py-3 min-w-0">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={selectedCity ? 
                    `Search in ${selectedCity}...` : 
                    "Search for properties..."}
                  className="w-full bg-transparent text-xs sm:text-sm outline-none border-none focus:outline-none focus:border-none focus:ring-0 text-white placeholder:text-white/50"
                  disabled={propertiesLoading}
                />
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="flex-shrink-0 hover:bg-white/20 text-white p-2 sm:p-3 transition-colors rounded-lg mr-1"
                disabled={propertiesLoading}
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Account Sidebar */}
      <AccountSidebar 
        isOpen={isAccountSidebarOpen} 
        onClose={() => setIsAccountSidebarOpen(false)}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-transparent to-[#08171A] pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;