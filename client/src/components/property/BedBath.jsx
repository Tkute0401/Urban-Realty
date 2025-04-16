import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const BedBath = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bedrooms, setBedrooms] = useState('Any');
  const [bathrooms, setBathrooms] = useState('Any');
  const [exactMatch, setExactMatch] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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

  // Add viewport edge detection
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      if (dropdownContent) {
        const rect = dropdownContent.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Check if dropdown goes off right edge
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
    // Here you would handle applying the filter
    setIsOpen(false);
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
      >
        Beds & Baths {isOpen ? '▲' : '▼'}
      </button>
      
      {isOpen && (
        <div className="dropdown-content fade-in">
          <h3 className="dropdown-subtitle">Number of Bedrooms</h3>
          
          <div className="bedrooms-section">
            <div className="bedrooms-options">
              <button 
                className={`option-btn ${bedrooms === 'Any' ? 'active-option' : ''}`}
                onClick={() => setBedrooms('Any')}
              >
                Any
              </button>
              <button 
                className={`option-btn ${bedrooms === '1+' ? 'active-option' : ''}`}
                onClick={() => setBedrooms('1+')}
              >
                1+
              </button>
              <button 
                className={`option-btn ${bedrooms === '2+' ? 'active-option' : ''}`}
                onClick={() => setBedrooms('2+')}
              >
                2+
              </button>
              <button 
                className={`option-btn ${bedrooms === '3+' ? 'active-option' : ''}`}
                onClick={() => setBedrooms('3+')}
              >
                3+
              </button>
              <button 
                className={`option-btn ${bedrooms === '4+' ? 'active-option' : ''}`}
                onClick={() => setBedrooms('4+')}
              >
                4+
              </button>
              <button 
                className={`option-btn ${bedrooms === '5+' ? 'active-option' : ''}`}
                onClick={() => setBedrooms('5+')}
              >
                5+
              </button>
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
            <button 
              className={`option-btn ${bathrooms === 'Any' ? 'active-option' : ''}`}
              onClick={() => setBathrooms('Any')}
            >
              Any
            </button>
            <button 
              className={`option-btn ${bathrooms === '1+' ? 'active-option' : ''}`}
              onClick={() => setBathrooms('1+')}
            >
              1+
            </button>
            <button 
              className={`option-btn ${bathrooms === '1.5+' ? 'active-option' : ''}`}
              onClick={() => setBathrooms('1.5+')}
            >
              1.5+
            </button>
            <button 
              className={`option-btn ${bathrooms === '2+' ? 'active-option' : ''}`}
              onClick={() => setBathrooms('2+')}
            >
              2+
            </button>
            <button 
              className={`option-btn ${bathrooms === '3+' ? 'active-option' : ''}`}
              onClick={() => setBathrooms('3+')}
            >
              3+
            </button>
            <button 
              className={`option-btn ${bathrooms === '4+' ? 'active-option' : ''}`}
              onClick={() => setBathrooms('4+')}
            >
              4+
            </button>
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