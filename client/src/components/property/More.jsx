import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const More = ({ onApply, currentFilters = {}, amenityOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('amenities');
  const [selectedFilters, setSelectedFilters] = useState({
    amenities: currentFilters.amenities || [],
    city: currentFilters.city || '',
    state: currentFilters.state || '',
    minArea: currentFilters.minArea || '',
    maxArea: currentFilters.maxArea || ''
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleAmenity = (amenity) => {
    setSelectedFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleInputChange = (field, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply({
      amenities: selectedFilters.amenities,
      city: selectedFilters.city,
      state: selectedFilters.state,
      minArea: selectedFilters.minArea,
      maxArea: selectedFilters.maxArea
    });
    setIsOpen(false);
  };

  const hasSelectedFilters = selectedFilters.amenities.length > 0 || 
    selectedFilters.city || 
    selectedFilters.state ||
    selectedFilters.minArea ||
    selectedFilters.maxArea;

  return (
    <div className="filter-dropdown more-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
      >
        More {isOpen ? '▲' : '▼'}
        {hasSelectedFilters && (
          <span style={{ marginLeft: '4px', color: '#78CADC' }}>•</span>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-content more-content fade-in">
          <div className="more-sidebar">
            {[
              { id: 'amenities', label: 'Amenities' },
              { id: 'location', label: 'Location' },
              { id: 'area', label: 'Area' }
            ].map(({ id, label }) => (
              <div 
                key={id}
                className={`sidebar-item ${activeSection === id ? 'active-sidebar' : ''}`}
                onClick={() => setActiveSection(id)}
              >
                {label}
              </div>
            ))}
          </div>
          
          <div className="more-content-area">
            {activeSection === 'amenities' && (
              <div className="filter-section">
                <h3 className="section-title">Amenities</h3>
                <div className="tag-options">
                  {amenityOptions.map(amenity => (
                    <button 
                      key={amenity}
                      className={`tag-option ${selectedFilters.amenities.includes(amenity) ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      + {amenity}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {activeSection === 'location' && (
              <div className="filter-section">
                <h3 className="section-title">Location</h3>
                <div className="input-field">
                  <label>City</label>
                  <input
                    type="text"
                    value={selectedFilters.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div className="input-field">
                  <label>State</label>
                  <input
                    type="text"
                    value={selectedFilters.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>
            )}
            
            {activeSection === 'area' && (
              <div className="filter-section">
                <h3 className="section-title">Area (sqft)</h3>
                <div className="range-inputs">
                  <div className="input-field">
                    <label>Min Area</label>
                    <input
                      type="number"
                      value={selectedFilters.minArea}
                      onChange={(e) => handleInputChange('minArea', e.target.value)}
                      placeholder="Min"
                    />
                  </div>
                  <div className="input-field">
                    <label>Max Area</label>
                    <input
                      type="number"
                      value={selectedFilters.maxArea}
                      onChange={(e) => handleInputChange('maxArea', e.target.value)}
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="apply-filter-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default More;