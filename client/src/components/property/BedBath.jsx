import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const BedBath = ({ onApply, currentBedrooms = '', currentBathrooms = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bedrooms, setBedrooms] = useState(currentBedrooms || 'Any');
  const [bathrooms, setBathrooms] = useState(currentBathrooms || 'Any');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setBedrooms(currentBedrooms || 'Any');
    setBathrooms(currentBathrooms || 'Any');
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    onApply(bedrooms === 'Any' ? '' : bedrooms, bathrooms === 'Any' ? '' : bathrooms);
    setIsOpen(false);
  };

  const hasActiveFilters = (bedrooms && bedrooms !== 'Any') || (bathrooms && bathrooms !== 'Any');

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