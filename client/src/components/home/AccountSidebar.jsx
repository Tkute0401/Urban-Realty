import React, { useState } from "react";
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
          {/* Backdrop with z-index below sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />
          
          {/* Sidebar with highest z-index */}
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
                      <div className="w-16 h-16 rounded-lg overflow-visible flex-shrink-0">
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

export default AccountSidebar;