import React, { useState, useRef, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  MapPinIcon,
  ChevronRightIcon,
  EyeIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  BellSlashIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Account Sidebar Component
const AccountSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('viewed');
  
  // Mock data for recently viewed properties
  const recentlyViewed = [
    {
      id: 1,
      image: "/building_1.jpg",
      price: "₹85.0 L",
      title: "3 BHK Apartment",
      location: "Hinjewadi, Pune",
      seller: "XYZ Realty"
    },
    {
      id: 2,
      image: "/building_5.jpg",
      price: "₹1.2 Cr",
      title: "4 BHK Villa",
      location: "Baner, Pune",
      seller: "ABC Builders"
    }
  ];

  const favouriteProperties = [
    {
      id: 1,
      image: "/building_1.jpg",
      price: "₹95.0 L",
      title: "2 BHK Apartment",
      location: "Wakad, Pune",
      seller: "Dream Homes"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white/10 backdrop-blur-lg border-l border-white/20 z-[9999] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white font-poppins">Account</h2>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-white hover:bg-white/20 rounded-md transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* User Info Section */}
            <div className="p-4 border-b border-white/20">
              {user ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#78cadc] flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-medium font-poppins">{user.name}</h3>
                  <p className="text-white text-sm">{user.email}</p>
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/profile');
                  }}
                  className="ml-auto bg-[#08171A]/70 text-white border border-[#78CADC] py-1 px-3 rounded-lg hover:bg-[#78CADC] hover:text-black transition-colors font-poppins text-sm"
                >
                  Profile
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="w-8 h-8 text-gray-600" />
                </div>
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  className="w-full bg-[#78cadc] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#5fb4c9] transition-colors font-poppins"
                >
                  Login / Sign Up
                </button>
              </div>
            )}
            </div>

            {/* My Activity Section */}
            <div className="p-4 border-b border-white/20">
              <h3 className="text-white font-medium mb-3 font-poppins">My Activity</h3>
              
              {/* Activity Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('viewed')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors font-poppins ${
                    activeTab === 'viewed'
                      ? 'bg-[#78cadc] text-black'
                      : 'bg-[#08171A]/70 text-white border border-[#78CADC]/90 hover:bg-[#78CADC] hover:text-black'
                  }`}
                >
                  <EyeIcon className="w-4 h-4" />
                  Recently Viewed
                </button>
                <button
                  onClick={() => setActiveTab('favourites')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors font-poppins ${
                    activeTab === 'favourites'
                      ? 'bg-[#78cadc] text-black'
                      : 'bg-[#08171A]/70 text-white border border-[#78CADC]/90 hover:bg-[#78CADC] hover:text-black'
                  }`}
                >
                  <HeartIcon className="w-4 h-4" />
                  Favourites
                </button>
              </div>

              {/* Property Cards */}
              <div className="space-y-3">
                {(activeTab === 'viewed' ? recentlyViewed : favouriteProperties).map((property) => (
                  <div key={property.id} className="bg-[#08171A]/70 border border-[#78CADC] rounded-lg p-3 hover:bg-gray-200/20 transition-colors">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={property.image} 
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[#78cadc] font-semibold text-sm">{property.price}</p>
                            <p className="text-white text-sm font-medium truncate">{property.title}</p>
                            <p className="text-white text-xs">{property.location}</p>
                            <p className="text-white text-xs">by {property.seller}</p>
                          </div>
                        </div>
                        <button className="mt-2 w-full bg-[#78cadc] text-black py-1 px-3 rounded text-xs font-medium transition-colors font-poppins">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 py-3 px-4 text-white hover:text-white hover:bg-gray-200/20 rounded-lg transition-colors text-left font-poppins">
                <BellSlashIcon className="w-5 h-5" />
                Unsubscribe Alerts
              </button>
              <button className="w-full flex items-center gap-3 py-3 px-4 text-white hover:text-white hover:bg-gray-200/20 rounded-lg transition-colors text-left font-poppins">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Report a Fraud
              </button>
              <button className="w-full flex items-center gap-3 py-3 px-4 text-white hover:text-white hover:bg-gray-200/20 rounded-lg transition-colors text-left font-poppins">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                Help Center
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
const HeroSection = () => {
  const [searchText, setSearchText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [localityStartIndex, setLocalityStartIndex] = useState(0);
  const [isAccountSidebarOpen, setIsAccountSidebarOpen] = useState(false);
  
  // Mock user data - set to null to show login state
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com"
  });
  
  const handleNavigate = (path) => {
    console.log('Navigate to:', path);
    // You can replace this with your actual navigation logic
  };
  const localitiesContainerRef = useRef(null);
  
  const navigation = [
    // { 
    //   name: 'BUY', 
    //   items: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Houston'] 
    // },
    // { 
    //   name: 'RENT', 
    //   items: ['Apartments', 'Villas', 'Condos', 'Townhouses', 'Commercial'] 
    // },
    // { 
    //   name: 'SELL', 
    //   items: ['Valuation', 'Property Management', 'Investment Consulting', 'Interior Design'] 
    // },
    // { 
    //   name: 'SERVICES', 
    //   items: ['Agents', 'Support', 'Careers', 'Feedback'] 
    // }
  ];

  // Dynamic city-based popular localities data
  const cityLocalitiesMap = {
    "Bengaluru": ["HSR Layout", "BTM Layout", "Whitefield", "Koramangala", "JP Nagar", "Indiranagar", "Electronic City", "Marathahalli", "Bannerghatta Road", "Sarjapur Road"],
    "Mumbai": ["Andheri", "Bandra", "Powai", "Thane", "Malad", "Borivali", "Vashi", "Panvel", "Goregaon", "Vikhroli"],
    "Delhi": ["Gurgaon", "Noida", "Dwarka", "Rohini", "Lajpat Nagar", "Karol Bagh", "Vasant Kunj", "Pitampura", "Janakpuri", "Mayur Vihar"],
    "Hyderabad": ["Gachibowli", "Hitech City", "Kondapur", "Madhapur", "Banjara Hills", "Jubilee Hills", "Kukatpally", "Miyapur", "Secunderabad", "Begumpet"],
    "Chennai": ["OMR", "Anna Nagar", "T Nagar", "Velachery", "Adyar", "Tambaram", "Porur", "Sholinganallur", "Perungudi", "Chromepet"],
    "Pune": ["Hinjewadi", "Baner", "Wakad", "Kharadi", "Hadapsar", "Magarpatta", "Koregaon Park", "Viman Nagar", "Aundh", "Pimpri"],
    "Kolkata": ["Salt Lake", "New Town", "Ballygunge", "Park Street", "Howrah", "Garia", "Rajarhat", "Behala", "Jadavpur", "Tollygunge"]
  };

  const cities = Object.keys(cityLocalitiesMap);
  const currentCityLocalities = cityLocalitiesMap[selectedCity] || [];
  
  // Calculate how many localities to show based on screen size
  const [visibleLocalitiesCount, setVisibleLocalitiesCount] = useState(5);
  const [selectedTab, setSelectedTab] = useState('COMMERCIAL');

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleLocalitiesCount(3); // Mobile
      } else if (window.innerWidth < 768) {
        setVisibleLocalitiesCount(4); // Small tablet
      } else if (window.innerWidth < 1024) {
        setVisibleLocalitiesCount(5); // Tablet
      } else {
        setVisibleLocalitiesCount(6); // Desktop
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  // Reset locality index when city changes
  useEffect(() => {
    setLocalityStartIndex(0);
  }, [selectedCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      handleNavigate(`/properties?search=${searchText.trim()}`);
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
  };

  const handleNextLocalities = () => {
    const maxStartIndex = Math.max(0, currentCityLocalities.length - visibleLocalitiesCount);
    if (localityStartIndex < maxStartIndex) {
      setLocalityStartIndex(prev => Math.min(prev + 1, maxStartIndex));
    } else {
      // Loop back to beginning
      setLocalityStartIndex(0);
    }
  };

  const visibleLocalities = currentCityLocalities.slice(localityStartIndex, localityStartIndex + visibleLocalitiesCount);

  return (
    <section className="h-[70vh] sm:h-screen relative flex items-center justify-center overflow-hidden z-0">
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
                
                <p className="text-gray-300 mb-2 sm:mb-4 max-w-xs sm:max-w-md md:max-w-lg mx-auto text-xs sm:text-lg md:text-base">
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
            className="fixed top-20 sm:top-24 left-4 right-4 z-40 bg-black/90 backdrop-blur-sm rounded-2xl border border-white/10 lg:hidden shadow-xl"
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
                onClick={() => setIsAccountSidebarOpen(true)} 
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
        <div className="w-full max-w-2xl">          
          <div className="flex items-center justify-center gap-2 sm:gap-2 text-white/80 mb-3 flex-wrap">
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Popular Localities:</span>
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

        {/* Main search container */}
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20 relative" style={{ zIndex: 200 }}>
          {/* Property type tabs */}
          <div className="flex gap-0 mb-2 rounded-xl p-1">
            {['BUY', 'RENT', 'COMMERCIAL', 'PG/CO-LIVING', 'PLOTS'].map((tab) => (
              <button
                key={tab}
                className={`relative flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden ${
                  selectedTab === tab 
                    ? 'text-white' 
                    : 'text-white/80 hover:text-white'
                }`}
                onClick={() => setSelectedTab(tab)}
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
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20">
              {/* City dropdown */}
              <div className="relative flex-shrink-0 border-r border-white/20" style={{ zIndex: 300 }}>
                <button
                  type="button"
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-3 text-white transition-colors min-w-[100px] sm:min-w-[120px]"
                >
                                    <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" />
                  <span className="text-xs sm:text-sm font-medium truncate">{selectedCity}</span>
                  <ChevronDownIcon className={`w-3 h-3 sm:w-4 sm:h-4 text-white/70 transition-transform flex-shrink-0 ${showCityDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showCityDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-1 w-48 sm:w-56 bg-white backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-[9999]"
                    >
                      <div className="p-2 border-b border-gray-200">
                        <div className="relative">
                          <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search city..."
                            className="w-full pl-8 pr-2 py-2 text-xs sm:text-sm border-none focus:outline-none focus:ring-0"
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {cities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className={`block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors ${selectedCity === city ? 'bg-[#78cadc]/10 text-[#78cadc] font-medium' : ''}`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Search input */}
              <div className="flex-1 flex items-center px-3 sm:px-4 py-3 min-w-0">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search for locality, landmark, project, or builder"
                  className="w-full bg-transparent text-xs sm:text-sm outline-none border-none focus:outline-none focus:border-none focus:ring-0 text-white placeholder:text-white/50"
                />
              </div>

              {/* Search button */}
              <button
                type="button"
                onClick={handleSearch}
                className="flex-shrink-0 hover:bg-white/20 text-white p-2 sm:p-3 transition-colors rounded-lg mr-1"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Sidebar */}
      <AccountSidebar 
        isOpen={isAccountSidebarOpen} 
        onClose={() => setIsAccountSidebarOpen(false)}
        user={user}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-transparent to-[#08171A] pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;