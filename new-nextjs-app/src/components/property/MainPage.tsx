// MainPage.jsx (updated)
import React, { useState, useEffect } from 'react';
import { PropertyCard } from '@/components/ui';
import './MainPage.css';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ZoomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 19c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
    <path d="m21 21-4.3-4.3"></path>
    <path d="M8 11h6"></path>
    <path d="M11 8v6"></path>
  </svg>
);

const GalleryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <path d="m21 15-5-5L5 21"></path>
  </svg>
);

const MainPagePropertyCard = ({ property }) => {
  // Convert legacy property format to modern format
  const modernProperty = {
    _id: property.id,
    title: property.location,
    price: parseFloat(property.price.replace(/[^0-9]/g, '')),
    area: parseFloat(property.sqft.replace(/[^0-9]/g, '')),
    bedrooms: property.beds,
    bathrooms: property.baths,
    images: [{ url: property.image }],
    address: {
      city: 'Nashik',
      state: 'Maharashtra'
    },
    type: 'apartment' as const,
    status: 'For Sale' as const
  };

  return (
    <PropertyCard 
      property={modernProperty}
      showFavorite={true}
      showStatus={true}
      showRating={false}
      showFeatures={true}
      variant="default"
    />
  );
};

const MainPage = () => {
  const [filters, setFilters] = useState({
    city: 'NASHIK',
    state: 'MAHARASHTRA',
    price: '40 LAC ₹ - 69 LAC ₹'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add animation class after component mounts
    setIsLoaded(true);
  }, []);

  const removeFilter = (filterKey) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey];
    setFilters(updatedFilters);
  };

  // Sample property data
  const properties = [
    {
      id: 1,
      image: "/api/placeholder/400/300",
      price: "69,00,000/- ₹",
      sqft: "1080 Sqft",
      beds: 4,
      baths: 2,
      location: "Nashik, Maharashtra"
    },
    {
      id: 2,
      image: "/api/placeholder/400/300",
      price: "69,00,000/- ₹",
      sqft: "1080 Sqft",
      beds: 4,
      baths: 2,
      location: "Nashik, Maharashtra"
    },
    {
      id: 3,
      image: "/api/placeholder/400/300",
      price: "69,00,000/- ₹",
      sqft: "1080 Sqft",
      beds: 4,
      baths: 2,
      location: "Nashik, Maharashtra"
    },
    {
      id: 4,
      image: "/api/placeholder/400/300",
      price: "69,00,000/- ₹",
      sqft: "1080 Sqft",
      beds: 4,
      baths: 2,
      location: "Nashik, Maharashtra"
    }
  ];

  return (
    <div className={`main-container ${isLoaded ? 'fade-in' : ''}`}>
      {/* Navbar is now rendered from Header component */}
      
      {/* Breadcrumb */}
      <div className="breadcrumb fade-in-delay-1">
        <a href="#">HOME</a>
        <span className="separator">&gt;</span>
        <a href="#">BUY</a>
        <span className="separator">&gt;</span>
        <a href="#">BUNGALOW</a>
      </div>

      {/* Page Title */}
      <div className="page-title fade-in-delay-2">
        <h1>Luxury Bungalow for <span>Sales</span></h1>
        <div className="listings-count">69 LISTING</div>
      </div>

      {/* Filter Tags */}
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

      {/* Property Listings */}
      <div className="property-listings fade-in-delay-4">
        <div className="property-grid">
          {properties.map(property => (
            <MainPagePropertyCard key={property.id} property={property} />
          ))}
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

export default MainPage;