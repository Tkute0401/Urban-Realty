'use client'

import { useState, useEffect } from 'react';
import '../properties/MainPage.css';
import PriceDropdown from '@/components/property/PriceDropdown';
import BedBath from '@/components/property/BedBath';
import HomeType from '@/components/property/HomeType';
import More from '@/components/property/More';
import axios from '@/lib/services/axios';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add,
  Image as ImageIcon,
  FavoriteBorder,
  FilterAlt as FilterIcon
} from '@mui/icons-material';

const PropertyCard = ({ property }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="property-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="property-image-container">
        <img src={property.image} alt={property.location} className="property-image" />
        <div className="property-image-overlay">
          <div className="property-image-actions">
            <button className="image-action-btn">
              <Add fontSize="small" />
            </button>
            <button className="image-action-btn">
              <FavoriteBorder fontSize="small" />
            </button>
          </div>
        </div>
      </div>

      <div className="property-details">
        <div className="property-price">{property.price}</div>
        <div className="property-specs">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} sq ft</span>
        </div>
        <div className="property-location">{property.location}</div>
        <div className="property-description">{property.description}</div>
      </div>
    </div>
  );
};

export default function PgPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    price: '',
    bedrooms: '',
    bathrooms: '',
    homeType: '',
    more: ''
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/properties');
      setProperties(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching with filters:', filters);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0d0e] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#78CADC] mx-auto"></div>
          <p className="mt-4 text-lg">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0c0d0e] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={fetchProperties}
            className="mt-4 px-6 py-2 bg-[#78CADC] text-black rounded-lg hover:bg-[#78CADC]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#08171A] p-4 flex items-center justify-between">
        <button
          onClick={toggleMobileMenu}
          className="text-white p-2"
        >
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold">Properties</h1>
        <button
          onClick={toggleFilter}
          className="text-white p-2"
        >
          <FilterIcon />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-[#08171A] w-64 h-full p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="text-white p-2"
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="space-y-4">
              <a href="#" className="block text-white hover:text-[#78CADC]">HOME</a>
              <a href="#" className="block text-white hover:text-[#78CADC]">BUY</a>
              <a href="#" className="block text-white hover:text-[#78CADC]">BUNGALOW</a>
              <a href="#" className="block text-white hover:text-[#78CADC]">PROPERTIES</a>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Filter */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-[#08171A] w-full h-full p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={toggleFilter}
                className="text-white p-2"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              <PriceDropdown 
                value={filters.price} 
                onChange={(value) => handleFilterChange('price', value)} 
              />
              <BedBath 
                bedrooms={filters.bedrooms}
                bathrooms={filters.bathrooms}
                onBedroomsChange={(value) => handleFilterChange('bedrooms', value)}
                onBathroomsChange={(value) => handleFilterChange('bathrooms', value)}
              />
              <HomeType 
                value={filters.homeType} 
                onChange={(value) => handleFilterChange('homeType', value)} 
              />
              <More 
                value={filters.more} 
                onChange={(value) => handleFilterChange('more', value)} 
              />
              <button
                onClick={handleSearch}
                className="w-full py-3 bg-[#78CADC] text-black rounded-lg font-semibold hover:bg-[#78CADC]/80 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Breadcrumbs */}
        <div className="bg-[#08171A] py-4 px-8">
          <div className="flex items-center space-x-2 text-sm">
            <a href="#" className="text-[#78CADC] hover:text-white">HOME</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="text-[#78CADC] hover:text-white">BUY</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="text-[#78CADC] hover:text-white">BUNGALOW</a>
            <span className="text-gray-400">/</span>
            <a href="#" className="text-white">PROPERTIES</a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#08171A] py-8 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, property type, or keyword..."
                  className="w-full pl-10 pr-4 py-3 bg-[#0c0d0e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#78CADC]"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-[#78CADC] text-black rounded-lg font-semibold hover:bg-[#78CADC]/80 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <PriceDropdown 
                value={filters.price} 
                onChange={(value) => handleFilterChange('price', value)} 
              />
              <BedBath 
                bedrooms={filters.bedrooms}
                bathrooms={filters.bathrooms}
                onBedroomsChange={(value) => handleFilterChange('bedrooms', value)}
                onBathroomsChange={(value) => handleFilterChange('bathrooms', value)}
              />
              <HomeType 
                value={filters.homeType} 
                onChange={(value) => handleFilterChange('homeType', value)} 
              />
              <More 
                value={filters.more} 
                onChange={(value) => handleFilterChange('more', value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="py-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Properties ({properties.length})</h2>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
                <FilterIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No properties found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}