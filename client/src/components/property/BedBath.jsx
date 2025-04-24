import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const BedBath = ({ onApply, currentBedrooms, currentBathrooms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bedrooms, setBedrooms] = useState(currentBedrooms || 'Any');
  const [bathrooms, setBathrooms] = useState(currentBathrooms || 'Any');
  const [exactMatch, setExactMatch] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (currentBedrooms) setBedrooms(currentBedrooms);
    if (currentBathrooms) setBathrooms(currentBathrooms);
  }, [currentBedrooms, currentBathrooms]);

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

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      if (dropdownContent) {
        const rect = dropdownContent.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        if (rect.right > viewportWidth) {
          dropdownContent.style.left = 'auto';
          dropdownContent.style.right = '0';
        }
      }
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    onApply(bedrooms, bathrooms);
    setIsOpen(false);
  };

  const hasActiveFilters = bedrooms !== 'Any' || bathrooms !== 'Any';

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
      >
        Beds & Baths {isOpen ? '▲' : '▼'}
        {hasActiveFilters && (
          <span style={{ marginLeft: '4px', color: '#78CADC' }}>•</span>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-content fade-in">
          <h3 className="dropdown-subtitle">Number of Bedrooms</h3>
          
          <div className="bedrooms-section">
            <div className="bedrooms-options">
              {['Any', '1+', '2+', '3+', '4+', '5+'].map(option => (
                <button 
                  key={`bed-${option}`}
                  className={`option-btn ${bedrooms === option ? 'active-option' : ''}`}
                  onClick={() => setBedrooms(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <div className="exact-match">
              <input 
                type="checkbox" 
                id="exactMatchBed" 
                checked={exactMatch}
                onChange={() => setExactMatch(!exactMatch)}
              />
              <label htmlFor="exactMatchBed">Use exact match</label>
            </div>
          </div>
          
          <h3 className="dropdown-subtitle">Number of Bathrooms</h3>
          
          <div className="bathrooms-options">
            {['Any', '1+', '1.5+', '2+', '3+', '4+'].map(option => (
              <button 
                key={`bath-${option}`}
                className={`option-btn ${bathrooms === option ? 'active-option' : ''}`}
                onClick={() => setBathrooms(option)}
              >
                {option}
              </button>
            ))}
          </div>
          
          <button className="apply-filter-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default BedBath;