import React, { useState, useEffect } from "react";
import { 
  UserIcon, 
  XMarkIcon,
  EyeIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  BellSlashIcon
} from "@heroicons/react/24/outline";
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertiesContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const AccountSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { getProperty } = useProperties();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('viewed');
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Format address whether it's a string or object
  const formatAddress = (address) => {
    if (!address) return 'Address not available';
    
    if (typeof address === 'string') {
      return address;
    }
    
    // Handle address object
    const parts = [
      address.line1,
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  // Fetch favorite properties when user changes or sidebar opens
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user?.favorites?.length > 0) {
        setLoadingFavorites(true);
        try {
          const favoritesData = await Promise.all(
            user.favorites.map(id => getProperty(id))
          );
          setFavoriteProperties(favoritesData.filter(Boolean));
        } catch (error) {
          console.error("Error fetching favorites:", error);
        } finally {
          setLoadingFavorites(false);
        }
      } else {
        setFavoriteProperties([]);
      }
    };

    if (isOpen && user) {
      fetchFavorites();
    }
  }, [user.favorites, isOpen, getProperty]);

  // Mock data for recently viewed properties
  const recentlyViewed = [
    {
      id: 1,
      image: "/building_1.jpg",
      price: "8500000",
      title: "3 BHK Apartment",
      address: {
        line1: "Flat 301",
        street: "Skyline Tower",
        city: "Hinjewadi",
        state: "Maharashtra",
        zipCode: "411057"
      },
      seller: "XYZ Realty"
    },
    {
      id: 2,
      image: "/building_5.jpg",
      price: "12000000",
      title: "4 BHK Villa",
      address: "Baner Road, Pune, Maharashtra 411045",
      seller: "ABC Builders"
    }
  ];

  // Format price with Indian Rupee symbol
  const formatPrice = (price) => {
    if (!price) return 'Price not available';
    if (typeof price === 'string') {
      // If already formatted
      if (price.startsWith('₹')) return price;
      return `₹${price}`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handlePropertyClick = (property) => {
    navigate(`/properties/${property._id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 sm:w-96 bg-white/10 backdrop-blur-lg border-l border-white/20 z-[9999] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white font-poppins">Account</h2>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-white hover:bg-white/20 rounded-md transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

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

            <div className="p-4 border-b border-white/20">
              <h3 className="text-white font-medium mb-3 font-poppins">My Activity</h3>
              
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

              <div className="space-y-3">
                {loadingFavorites && activeTab === 'favourites' ? (
                  <div className="text-white text-center py-4">Loading favorites...</div>
                ) : (
                  (activeTab === 'viewed' ? recentlyViewed : favoriteProperties).map((property) => (
                    console.log(property),
                    <div key={property._id || property.id} onClick={() => handlePropertyClick(property)} className="bg-[#08171A]/70 border border-[#78CADC] rounded-lg p-3 hover:bg-gray-200/20 transition-colors overflow-hidden">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-full border-2 border-[#78CADC] overflow-hidden  mt-7">
                          {property.images ? (
                            <img 
                              src={property.images[0].url} 
                              //alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-[#78cadc] font-semibold text-sm">
                                {formatPrice(property.price)}
                              </p>
                              <p className="text-white text-sm font-medium truncate mt-1">
                                {property.title || 'Untitled Property'}
                              </p>
                              <p className="text-white text-xs mt-1">
                                {formatAddress(property.address)}
                              </p>
                              <p className="text-white text-xs mt-1">
                                by {property.agent?.name || property.agent || 'Unknown Seller'}
                              </p>
                            </div>
                          </div>
                          <button className="mt-2 w-full bg-[#78cadc] text-black py-1 px-3 rounded text-xs font-medium transition-colors font-poppins">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

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

export default AccountSidebar;