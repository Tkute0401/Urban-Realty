'use client'

import { useState, useEffect } from 'react';
import './MainPage.css';
import PriceDropdown from '@/components/property/PriceDropdown';
import BedBath from '@/components/property/BedBath';
import HomeType from '@/components/property/HomeType';
import More from '@/components/property/More';
import LocationSearch from '@/components/property/LocationSearch';
import PropertiesMap from '@/components/property/PropertiesMap';
import apiService from '@/lib/services/apiService';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Add,
  Image as ImageIcon,
  FavoriteBorder,
  FilterAlt as FilterIcon
} from '@mui/icons-material';
import PropertyCard from '@/components/home/PropertyCard';

// const PropertyCard = ({ property }) => {

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="property-card"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="property-image-container">
//         <img src={(Array.isArray(property.images) ? (typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url) : '') || '/placeholder-property.jpg'} alt={property.title} className="property-image" />
//         <div className="property-image-overlay">
//           <div className="property-image-actions">
//             <button className="image-action-btn">
//               <Add fontSize="small" />
//             </button>
//             <button className="image-action-btn">
//               <FavoriteBorder fontSize="small" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="property-details">
//         <div className="property-price">${property.price?.toLocaleString?.() || (typeof property.price === 'number' ? property.price.toLocaleString() : '')}</div>
//         <div className="property-specs">
//           <div className="property-spec">{property.area || property.features?.sqft || 'N/A'} sqft</div>
//           <div className="property-spec-divider">|</div>
//           <div className="property-spec">{property.bedrooms || property.features?.bedrooms || 0} Bed</div>
//           <div className="property-spec-divider">|</div>
//           <div className="property-spec">{property.bathrooms || property.features?.bathrooms || 0} Bath</div>
//         </div>
//         <div className="property-location">
//           {property.address ? `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`.replace(/^,\s*|,\s*$/g, '') : (typeof property.location === 'object'
//             ? `${property.location.address || ''}, ${property.location.city || ''}, ${property.location.state || ''}`.replace(/^,\s*|,\s*$/g, '')
//             : property.location)}
//         </div>
//       </div>
//     </div>
//   );
// };

const Properties = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeBtn, setActiveBtn] = useState('BUY');
  const [filters, setFilters] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(5000);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const amenityOptions = [
    'Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 
    'Security', 'Furnished', 'Fireplace', 'Elevator'
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await apiService.getProperties() as { data: any; status: number };
        // Real API returns envelope { success, data: [...] }
        const list = Array.isArray(response.data?.data) ? response.data.data : (Array.isArray(response.data) ? response.data : []);
        setProperties(list);
        setLoading(false);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const removeFilter = (filterKey) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey];
    setFilters(updatedFilters);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleMoreFiltersApply = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Filter properties by location if needed
    if (location) {
      // This would typically filter properties by location
      console.log('Searching properties near:', location.name);
    }
  };

  const handleRadiusChange = (radius) => {
    setSearchRadius(radius);
  };

  const handleMarkerClick = (property) => {
    setSelectedProperty(property);
    // Scroll to property card or highlight it
    const element = document.getElementById(`property-${property.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`main-container ${isLoaded ? 'fade-in' : ''}`}>
      {/* NavBar */}
      <div className="Navbar">
        <div className="search-container slide-in-left">
          <input 
            type="searchbar" 
            placeholder="SEARCH BY LOCATION (STATE OR CITY)" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <SearchIcon className="text-white" />
          </button>
        </div>
        
        {isMobile ? (
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <FilterIcon fontSize="small" />
            <span>Filters</span>
          </button>
        ) : (
          <div className="NavbarBtn slide-in-right">
            <div className="BuyRentToggle">
              <button 
                id="BuyBtn" 
                className={`${activeBtn === 'BUY' ? 'bg-[var(--color-primary)] text-[var(--color-bg-dark)]' : 'bg-black-400 text-white'}`} 
                onClick={() => setActiveBtn('BUY')}
              >
                BUY
              </button>
              <button 
                id="RentBtn" 
                className={`${activeBtn === 'RENT' ? 'bg-[var(--color-primary)] text-[var(--color-bg-dark)]' : 'bg-black-400 text-white'}`}
                onClick={() => setActiveBtn('RENT')}
              >
                RENT
              </button>
            </div>
            <div className="OtherNavbarBtn">
              <HomeType onApply={() => {}} />
              <PriceDropdown activeBtn={activeBtn} onApply={() => {}} />
              <BedBath onApply={() => {}} />
              <More
                onApply={handleMoreFiltersApply} 
                amenityOptions={amenityOptions}
                currentFilters={filters}
              />
              <button id="SaveBtn" className="btn-animate">SAVE SEARCH</button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && showMobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="BuyRentToggle">
              <button 
                id="BuyBtn" 
                className={`${activeBtn === 'BUY' ? 'bg-[var(--color-primary)] text-[var(--color-bg-dark)]' : 'bg-black-400 text-white'}`} 
                onClick={() => {
                  setActiveBtn('BUY');
                  setShowMobileMenu(false);
                }}
              >
                BUY
              </button>
              <button 
                id="RentBtn" 
                className={`${activeBtn === 'RENT' ? 'bg-[var(--color-primary)] text-[var(--color-bg-dark)]' : 'bg-black-400 text-white'}`}
                onClick={() => {
                  setActiveBtn('RENT');
                  setShowMobileMenu(false);
                }}
              >
                RENT
              </button>
            </div>
            <div className="mobile-menu-filters">
              <HomeType onApply={() => {}} />
              <PriceDropdown activeBtn={activeBtn} onApply={() => {}} />
              <BedBath onApply={() => {}} />
              <More onApply={() => {}} />
              <button id="SaveBtn" className="btn-animate">SAVE SEARCH</button>
            </div>
          </div>
        </div>
      )}

      <div className="breadcrumb fade-in-delay-1">
        <a href="#">HOME</a>
        <span className="separator">&gt;</span>
        <a href="#">{activeBtn}</a>
        <span className="separator">&gt;</span>
        <a href="#">PROPERTIES</a>
      </div>

      <div className="page-title fade-in-delay-2">
        <h1>Available Properties <span>Listings</span></h1>
        <div className="listings-count">{properties.length} LISTINGS</div>
      </div>

      <div className="filter-tags fade-in-delay-3">
        {Object.entries(filters).map(([key, value]) => (
          <div key={key} className="filter-tag">
            <span className="filter-label">{key.toUpperCase()}: {String(value)}</span>
            <button onClick={() => removeFilter(key)}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>

      {/* Location Search Component */}
      <div className="location-search-container fade-in-delay-3" style={{ margin: '20px 0' }}>
        <LocationSearch 
          onLocationSelect={handleLocationSelect}
          onRadiusChange={handleRadiusChange}
          initialLocation={selectedLocation}
          initialRadius={searchRadius}
        />
      </div>

      <div className="property-listings fade-in-delay-4">
        <div className="property-grid">
          {loading ? (
            <div className="map-placeholder">
              <span>Loading properties...</span>
            </div>
          ) : (
            properties.map(property => (
              <div 
                key={property._id || property.id}
                id={`property-${property._id || property.id}`}
                className={(selectedProperty?._id || selectedProperty?.id) === (property._id || property.id) ? 'property-highlighted' : ''}
              >
                <PropertyCard property={property} index={undefined} />
              </div>
            ))
          )}
        </div>
        <div className="map-container">
          <PropertiesMap 
            properties={properties}
            selectedProperty={selectedProperty}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Properties;