import { React, useState, useEffect } from 'react';
import './MainPage.css';
import PriceDropdown from './PriceDropdown';
import BedBath from './BedBath';
import HomeType from './HomeType';
import More from './More';
import axios from '../../services/axios';

// Add these new icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PropertyCard = ({ property }) => {
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 19c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
                <path d="m21 21-4.3-4.3"></path>
                <path d="M8 11h6"></path>
                <path d="M11 8v6"></path>
              </svg>
            </button>
            <button className="image-action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="m21 15-5-5L5 21"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="property-details">
        <div className="property-price">{property.price}</div>
        <div className="property-specs">
          <div className="property-spec">{property.sqft}</div>
          <div className="property-spec-divider">|</div>
          <div className="property-spec">{property.beds} Bed</div>
          <div className="property-spec-divider">|</div>
          <div className="property-spec">{property.baths} Bath</div>
        </div>
        <div className="property-location">{property.location}</div>
      </div>
    </div>
  );
};

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
        const response = await axios.get('/api/properties');
        setProperties(response.data.data);
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
            <SearchIcon />
          </button>
        </div>
        
        {isMobile ? (
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <MenuIcon />
            <span>Filters</span>
          </button>
        ) : (
          <div className="NavbarBtn slide-in-right">
            <div className="BuyRentToggle">
              <button 
                id="BuyBtn" 
                className={`${activeBtn === 'BUY' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`} 
                onClick={() => setActiveBtn('BUY')}
              >
                BUY
              </button>
              <button 
                id="RentBtn" 
                className={`${activeBtn === 'RENT' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`}
                onClick={() => setActiveBtn('RENT')}
              >
                RENT
              </button>
            </div>
            <div className="OtherNavbarBtn">
              <HomeType />
              <PriceDropdown activeBtn={activeBtn} />
              <BedBath />
              <More />
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
                className={`${activeBtn === 'BUY' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`} 
                onClick={() => {
                  setActiveBtn('BUY');
                  setShowMobileMenu(false);
                }}
              >
                BUY
              </button>
              <button 
                id="RentBtn" 
                className={`${activeBtn === 'RENT' ? 'bg-[#78cadc] text-black' : 'bg-black-400 text-white'}`}
                onClick={() => {
                  setActiveBtn('RENT');
                  setShowMobileMenu(false);
                }}
              >
                RENT
              </button>
            </div>
            <div className="mobile-menu-filters">
              <HomeType />
              <PriceDropdown activeBtn={activeBtn} />
              <BedBath />
              <More />
              <button id="SaveBtn" className="btn-animate">SAVE SEARCH</button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the content remains the same */}
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
            <span className="filter-label">{key.toUpperCase()}: {value}</span>
            <button onClick={() => removeFilter(key)}>
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>

      <div className="property-listings fade-in-delay-4">
        <div className="property-grid">
          {loading ? (
            <div className="map-placeholder">
              <span>Loading properties...</span>
            </div>
          ) : (
            properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))
          )}
        </div>
        <div className="map-container">
          <div className="map-placeholder">
            <span>View larger map</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;