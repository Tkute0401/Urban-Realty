'use client'

import React, { useState, useRef, useEffect, useContext } from "react";
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
import { useAuth} from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import AccountSidebar from './AccountSidebar';
import { useProperties } from '@/contexts/PropertiesContext';
import { ThemeContext } from '@/contexts/ThemeProvider';
import '@/style-constants/z-index.css';

// Theme toggle icons
const SunIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 HeroSection rendering...');
  }
  
  React.useEffect(() => {
    setMounted(true);
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 HeroSection mounted on client side!');
    }
  }, []);
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
  const { theme, toggle: toggleTheme } = useContext(ThemeContext);
  const { properties, loading: propertiesLoading, getProperties } = useProperties();
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const localitiesContainerRef = useRef(null);
  
  const navigation = [];
  const [visibleLocalitiesCount, setVisibleLocalitiesCount] = useState(5);

  useEffect(() => {
    // Only fetch if we don't have properties yet
    if (properties.length === 0) {
      getProperties();
    }
  }, []); // Remove getProperties from dependency array

  const getAvailableCities = () => {
    if (!properties || !Array.isArray(properties) || properties.length === 0) return [];
    
    const citiesSet = new Set();
    properties.forEach(property => {
      if (property && property.address && property.address.city) {
        citiesSet.add(property.address.city);
      }
    });
    
    return Array.from(citiesSet).sort();
  };

  const availableCities = getAvailableCities();

  const filteredCities = availableCities.filter(city =>
    String(city).toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const getLocalitiesForCity = () => {
    if (!properties || !Array.isArray(properties) || properties.length === 0 || !selectedCity) return [];
    
    const localitiesSet = new Set();
    properties.forEach(property => {
      if (property && property.address && property.address.city === selectedCity && property.address.street) {
        localitiesSet.add(property.address.street);
      }
    });
    
    return Array.from(localitiesSet).sort();
  };

  const currentCityLocalities = getLocalitiesForCity();

  useEffect(() => {
    if (searchParams) {
      const params = Object.fromEntries(searchParams.entries());
      if (params.search) setSearchText(params.search);
      if (params.city && Array.isArray(availableCities)) {
        if (availableCities.includes(params.city)) {
          setSelectedCity(params.city);
        }
      }
      if (params.propertyType) {
        setSelectedTab(params.propertyType === 'BUY' ? 'BUY' : params.propertyType === 'RENT' ? 'RENT' : 'ALL');
      }
    }
  }, [searchParams, availableCities]);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setVisibleLocalitiesCount(3);
        } else if (window.innerWidth < 768) {
          setVisibleLocalitiesCount(4);
        } else if (window.innerWidth < 1024) {
          setVisibleLocalitiesCount(5);
        } else {
          setVisibleLocalitiesCount(6);
        }
      }
    };

    updateVisibleCount();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateVisibleCount);
      return () => window.removeEventListener('resize', updateVisibleCount);
    }
  }, []);

  useEffect(() => {
    if (!selectedCity && Array.isArray(availableCities) && availableCities.length > 0) {
      setSelectedCity(String(availableCities[0]));
    }
  }, [availableCities, selectedCity]);

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
      
      router.push(`/properties?${newSearchParams.toString()}`);
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
    if (!Array.isArray(currentCityLocalities)) return;
    
    const maxStartIndex = Math.max(0, currentCityLocalities.length - visibleLocalitiesCount);
    if (localityStartIndex < maxStartIndex) {
      setLocalityStartIndex(prev => Math.min(prev + 1, maxStartIndex));
    } else {
      setLocalityStartIndex(0);
    }
  };

  const visibleLocalities = Array.isArray(currentCityLocalities) 
    ? currentCityLocalities.slice(localityStartIndex, localityStartIndex + visibleLocalitiesCount)
    : [];

  // Show loading state until mounted
  if (!mounted) {
    return (
      <section className="relative h-[70vh] sm:h-screen flex items-center justify-center overflow-visible z-0">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        <div className="relative z-10 text-center">
          <div className="h-8 bg-gray-300 rounded mb-4 w-64 mx-auto"></div>
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] sm:h-screen flex items-center justify-center overflow-visible z-0">
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
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-16 rounded-3xl sm:mx-4 md:mx-8 lg:mx-8 xl:mx-16 2xl:mx-20 overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm overflow-hidden border border-white/30"></div>
        
        <div className="relative w-full h-full max-w-7xl mx-auto px-4 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col">
          {/* Navbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <img 
                src="/vite.png" 
                alt="Logo" 
                className="h-8 w-auto sm:h-10 md:h-12 lg:h-12 xl:h-14 2xl:h-16 hover:scale-105 transition-transform duration-300 object-contain" 
              />
            </div>

            <nav className="hidden lg:flex gap-2 xl:gap-4 2xl:gap-6">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 font-poppins text-sm sm:text-sm md:text-base xl:text-lg font-medium text-white hover:text-[var(--color-primary)] transition-colors duration-300"
                  >
                    {item.name}
                    {activeDropdown === item.name ? (
                      <ChevronUpIcon className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                    ) : (
                      <ChevronDownIcon className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-36 sm:w-40 md:w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        {item.items.map((subItem) => (
                          <a
                            key={subItem}
                            href="#"
                            className="block px-3 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 text-xs sm:text-sm md:text-base text-gray-800 hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-bg-dark)] transition-colors duration-200 border-b border-white/10 last:border-0"
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

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="hidden sm:flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-white/50 rounded-full bg-transparent text-white hover:bg-white/10 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all duration-300" 
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <MoonIcon className="w-4 h-4 md:w-5 md:h-5" /> : <SunIcon className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
              
              <button 
                onClick={() => setIsAccountSidebarOpen(true)} 
                className="hidden lg:flex items-center gap-1 sm:gap-1 md:gap-2 px-2 sm:px-2 md:px-3 py-1 sm:py-1 md:py-1.5 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors duration-300 text-xs sm:text-sm md:text-base"
              >
                <UserIcon className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                <span className="font-poppins font-semibold">ACCOUNT</span>
              </button>

              <button 
                className="lg:hidden p-2 sm:p-2.5 text-white hover:bg-white/20 rounded-lg transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Bars3Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
              <div className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                <h1 className="font-poppins text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-bold mb-1 sm:mb-2 md:mb-4 lg:mb-6 text-white">
                  Find Your <br />Perfect <span className="text-[var(--color-primary)]">Spot.</span>
                </h1>
                <br/>
                
                <p className="text-white mb-2 sm:mb-3 md:mb-4 max-w-xs sm:max-w-md md:max-w-lg mx-auto text-xs sm:text-sm md:text-base">
                  Discover your dream property from our extensive collection of 
                  homes, apartments, and commercial spaces across the country.
                </p>
              </div>
              
              {/* Popular localities section moved to center */}
              {selectedCity && currentCityLocalities.length > 0 && (
                <div className="w-full max-w-2xl mx-auto mt-4 sm:mt-6 md:mt-8">          
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 text-white/80 mb-1 sm:mb-2 md:mb-3 flex-wrap">
                    <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                      Popular Localities in {selectedCity}:
                    </span>
                    <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden">
                      <div 
                        ref={localitiesContainerRef}
                        className="flex gap-1 sm:gap-1.5 transition-transform duration-500 ease-in-out"
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
                              className="px-2 py-1 text-xs sm:text-sm rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors whitespace-nowrap flex-shrink-0"
                              onClick={() => {
                                const newSearchParams = new URLSearchParams();
                                newSearchParams.set('city', selectedCity);
                                newSearchParams.set('search', String(locality));
                                if (selectedTab !== 'ALL') newSearchParams.set('propertyType', selectedTab);
                                router.push(`/properties?${newSearchParams.toString()}`);
                              }}
                            >
                              {String(locality)}
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </div>
                      {currentCityLocalities.length > visibleLocalitiesCount && (
                        <motion.button
                          onClick={handleNextLocalities}
                          className="p-1 sm:p-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 flex-shrink-0"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ChevronRightIcon className="w-3 h-3 sm:w-3 sm:h-3" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map and Rating positioned at bottom corners */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Map thumbnail on left */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors duration-300">
              <img 
                src="/building_1.jpg" 
                alt="Map view" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            {/* Rating on right */}
            <div className="bg-transparent p-1 sm:p-1.5 rounded-xl">
              <div className="flex flex-col items-end">
                <div className="flex gap-1 items-center">
                  <span className="text-yellow-400 text-base sm:text-lg md:text-xl lg:text-2xl">★</span>
                  <span className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">4.9</span>
                </div>
                <span className="text-[0.5rem] sm:text-xs font-poppins text-white/80 text-right mt-0.5">
                  FROM 6,900+ CUSTOMERS
                </span>
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
            className="fixed top-16 sm:top-20 left-4 right-4 bg-black/90 backdrop-blur-sm rounded-2xl border border-white/10 lg:hidden shadow-xl"
            style={{ zIndex: 'var(--z-mobile-menu)' }}
          >
            <div className="flex flex-col p-2 sm:p-3 md:p-4">
              {navigation.map((item) => (
                <div key={item.name} className="mb-1 sm:mb-1.5 last:mb-0">
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3 text-white hover:bg-white/10 rounded-lg transition-colors duration-200 text-sm sm:text-base min-h-[44px]"
                  >
                    <span className="font-poppins font-medium">{item.name}</span>
                    {mobileActiveDropdown === item.name ? (
                      <ChevronUpIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
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
                        <div className="pl-2 sm:pl-3 py-1 sm:py-1.5">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem}
                              href="#"
                              className="block px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200 min-h-[44px] flex items-center"
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
              
              {/* Theme Toggle for Mobile */}
              <button 
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }} 
                className="flex items-center justify-center gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-3 mt-2 sm:mt-2 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors text-sm sm:text-base min-h-[44px]"
              >
                {theme === 'light' ? <MoonIcon className="w-3 h-3 sm:w-4 sm:h-4" /> : <SunIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
                <span className="font-poppins font-semibold">
                  {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
                </span>
              </button>
              
              <button 
                onClick={() => {
                  setIsAccountSidebarOpen(true);
                  setIsMenuOpen(false);
                }} 
                className="lg:hidden flex items-center justify-center gap-2 sm:gap-2 px-3 sm:px-4 py-3 sm:py-3 mt-2 sm:mt-2 rounded-lg text-white bg-transparent border border-white hover:bg-white/10 transition-colors text-sm sm:text-base min-h-[44px]"
              >
                <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-poppins font-semibold">ACCOUNT</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Search and filter bar */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 flex flex-col items-center px-2 sm:px-4 md:px-6 lg:px-8 gap-2 sm:gap-3 md:gap-4 transform translate-y-1/2"
           style={{ zIndex: 'var(--z-sticky)' }}>
        {/* Main search container */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 border border-white/20 relative"
             style={{ zIndex: 'var(--z-elevated)' }}>
          {/* Property type tabs */}
          <div className="flex gap-0 mb-1 sm:mb-1.5 rounded-lg sm:rounded-xl p-1">
            {['ALL', 'BUY', 'RENT', 'COMMERCIAL'].map((tab) => (
              <button
                key={tab}
                className={`relative flex-1 px-1 sm:px-2 py-1 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg transition-all duration-300 overflow-hidden ${
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
                    className="absolute bottom-0 left-0 h-0.5 bg-[var(--color-primary)]"
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
            <form onSubmit={handleSearch} className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-visible border border-white/20 max-h-8 sm:max-h-10 md:max-h-12">
              {/* City dropdown */}
              {availableCities.length > 0 && (
                <div className="relative flex-shrink-0 border-r border-white/20 overflow-visible max-h-8 sm:max-h-10 md:max-h-12"
                     style={{ zIndex: 'var(--z-dropdown)' }}>
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="flex items-center gap-1 px-1 sm:px-2 py-1 text-white transition-colors min-w-[80px] sm:min-w-[100px] md:min-w-[120px]"
                    disabled={propertiesLoading}
                  >
                    <MapPinIcon className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white/70" />
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {propertiesLoading ? 'Loading...' : selectedCity || 'Select city'}
                    </span>
                    <ChevronDownIcon className={`w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white/70 transition-transform flex-shrink-0 ${showCityDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showCityDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-1 w-full sm:w-48 md:w-56 bg-white/40 backdrop-blur-3xl rounded-lg shadow-lg overflow-hidden border border-white/20 max-h-48 md:max-h-60 overflow-y-auto"
                        style={{ zIndex: 'var(--z-popover)' }}
                      >
                        <div className="max-h-[200px] overflow-y-auto">
                          {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                              <button
                                key={String(city)}
                                type="button"
                                onClick={() => handleCitySelect(String(city))}
                                className={`block w-full text-left px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm text-white hover:bg-white/25 transition-colors ${selectedCity === city ? 'bg-[var(--color-primary)]/65' : ''}`}
                              >
                                {String(city)}
                              </button>
                            ))
                          ) : (
                            <div className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-500 text-center">
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
              <div className="flex-1 flex items-center px-1 sm:px-2 py-1 min-w-0">
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
                className="flex-shrink-0 hover:bg-white/20 text-white p-1 sm:p-1.5 transition-colors rounded-lg mr-0.5 sm:mr-1"
                disabled={propertiesLoading}
              >
                <MagnifyingGlassIcon className="w-3 h-3 sm:w-4 sm:h-4" />
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
      <div className="absolute bottom-0 left-0 w-full h-8 sm:h-10 bg-gradient-to-b from-transparent to-[var(--color-bg-dark)] pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;