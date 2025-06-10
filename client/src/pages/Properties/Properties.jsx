import { React, useState, useEffect } from 'react';
import './MainPage.css';
import PriceDropdown from './PriceDropdown';
import BedBath from './BedBath';
import HomeType from './HomeType';
import More from './More';
import axios from '../../services/axios';
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
            <SearchIcon style={{ color: 'white' }} /> {/* Removed blue background */}
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
              <CloseIcon fontSize="small" />
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