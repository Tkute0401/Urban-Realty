import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './BedBath.css';
import './FilterDropdown.css';

const BedBath = ({ onApply, currentBedrooms = '', currentBathrooms = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bedrooms, setBedrooms] = useState(currentBedrooms || 'Any');
  const [bathrooms, setBathrooms] = useState(currentBathrooms || 'Any');
  const [tempValues, setTempValues] = useState({
    bedrooms: currentBedrooms || 'Any',
    bathrooms: currentBathrooms || 'Any'
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Initialize values from props
  useEffect(() => {
    setBedrooms(currentBedrooms || 'Any');
    setBathrooms(currentBathrooms || 'Any');
    setTempValues({
      bedrooms: currentBedrooms || 'Any',
      bathrooms: currentBathrooms || 'Any'
    });
  }, [currentBedrooms, currentBathrooms]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen]);

  // Adjust dropdown position to prevent overflow
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current.querySelector('.dropdown-content');
      const rect = dropdown.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Reset positioning
      dropdown.style.left = '0';
      dropdown.style.right = 'auto';
      dropdown.style.transform = 'none';
      
      // Check if dropdown overflows on the right
      if (rect.right > viewportWidth - 16) {
        dropdown.style.left = 'auto';
        dropdown.style.right = '0';
      }
      
      // Check if dropdown overflows on the left
      if (rect.left < 16) {
        dropdown.style.left = '16px';
        dropdown.style.right = 'auto';
      }
    }
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleBedroomSelect = useCallback((option) => {
    setTempValues(prev => ({ ...prev, bedrooms: option }));
  }, []);

  const handleBathroomSelect = useCallback((option) => {
    setTempValues(prev => ({ ...prev, bathrooms: option }));
  }, []);

  const handleApply = useCallback(() => {
    setBedrooms(tempValues.bedrooms);
    setBathrooms(tempValues.bathrooms);
    onApply(
      tempValues.bedrooms === 'Any' ? '' : tempValues.bedrooms, 
      tempValues.bathrooms === 'Any' ? '' : tempValues.bathrooms
    );
    setIsOpen(false);
  }, [tempValues, onApply]);

  const handleReset = useCallback(() => {
    setTempValues({ bedrooms: 'Any', bathrooms: 'Any' });
  }, []);

  const hasActiveFilters = (bedrooms && bedrooms !== 'Any') || (bathrooms && bathrooms !== 'Any');

  // Calculate summary for accessibility
  const filterSummary = useMemo(() => {
    const parts = [];
    if (bedrooms && bedrooms !== 'Any') parts.push(`${bedrooms} bed`);
    if (bathrooms && bathrooms !== 'Any') parts.push(`${bathrooms} bath`);
    return parts.length > 0 ? parts.join(', ') : 'Any configuration';
  }, [bedrooms, bathrooms]);

  const bedroomOptions = ['Any', '1+', '2+', '3+', '4+', '5+'];
  const bathroomOptions = ['Any', '1+', '1.5+', '2+', '3+', '4+'];

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Beds and Baths filter${hasActiveFilters ? ` (${filterSummary})` : ''}`}
      >
        Beds & Baths {isOpen ? '▲' : '▼'}
        {hasActiveFilters && (
          <span style={{ 
            marginLeft: '6px', 
            color: '#78CADC',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            •
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-content fade-in bedbath-dropdown-content" role="dialog" aria-modal="true">
          <h3 className="dropdown-subtitle">
            🛏️ Bedrooms & Bathrooms
          </h3>
          
          {/* Current Selection Summary */}
          <div className="selection-summary">
            <div className="summary-item">
              <span className="summary-label">Bedrooms:</span>
              <span className="summary-value">{tempValues.bedrooms}</span>
            </div>
            <div className="summary-divider">•</div>
            <div className="summary-item">
              <span className="summary-label">Bathrooms:</span>
              <span className="summary-value">{tempValues.bathrooms}</span>
            </div>
          </div>

          {/* Bedrooms Section */}
          <div className="bedrooms-section">
            <div className="section-title">
              🛏️ <span>Bedrooms</span>
              <div className="section-indicator">
                {tempValues.bedrooms !== 'Any' && (
                  <span className="active-indicator">{tempValues.bedrooms}</span>
                )}
              </div>
            </div>
            <div className="options-grid">
              {bedroomOptions.map(option => (
                <button 
                  key={`bed-${option}`}
                  className={`option-btn ${tempValues.bedrooms === option ? 'active-option' : ''}`}
                  onClick={() => handleBedroomSelect(option)}
                  aria-label={`${option} bedrooms`}
                >
                  <span className="option-text">{option}</span>
                  {option !== 'Any' && <span className="option-suffix">bed{option.includes('+') && option !== '1+' ? 's' : ''}</span>}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bathrooms Section */}
          <div className="bathrooms-section">
            <div className="section-title">
              🚿 <span>Bathrooms</span>
              <div className="section-indicator">
                {tempValues.bathrooms !== 'Any' && (
                  <span className="active-indicator">{tempValues.bathrooms}</span>
                )}
              </div>
            </div>
            <div className="options-grid">
              {bathroomOptions.map(option => (
                <button 
                  key={`bath-${option}`}
                  className={`option-btn ${tempValues.bathrooms === option ? 'active-option' : ''}`}
                  onClick={() => handleBathroomSelect(option)}
                  aria-label={`${option} bathrooms`}
                >
                  <span className="option-text">{option}</span>
                  {option !== 'Any' && <span className="option-suffix">bath{option.includes('+') && option !== '1+' && option !== '1.5+' ? 's' : ''}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Combinations */}
          <div className="preset-combinations">
            <div className="presets-label">🎯 Popular Combinations</div>
            <div className="combinations-grid">
              <button 
                className="combo-btn"
                onClick={() => setTempValues({ bedrooms: '1+', bathrooms: '1+' })}
              >
                1 Bed, 1 Bath
              </button>
              <button 
                className="combo-btn"
                onClick={() => setTempValues({ bedrooms: '2+', bathrooms: '2+' })}
              >
                2 Bed, 2 Bath
              </button>
              <button 
                className="combo-btn"
                onClick={() => setTempValues({ bedrooms: '3+', bathrooms: '2+' })}
              >
                3 Bed, 2 Bath
              </button>
              <button 
                className="combo-btn"
                onClick={() => setTempValues({ bedrooms: '4+', bathrooms: '3+' })}
              >
                4+ Bed, 3+ Bath
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="slider-actions">
            <button 
              className="reset-btn" 
              onClick={handleReset}
              aria-label="Reset beds and baths filters"
            >
              🔄 Reset
            </button>
            <button 
              className="apply-filter-btn-pd" 
              onClick={handleApply}
              aria-label="Apply beds and baths filters"
            >
              ✨ Apply Filters
            </button>
          </div>

          {/* Footer info */}
          <div className="dropdown-footer">
            <div className="footer-tip">
              💡 <span>Select individual options or use popular combinations</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedBath;