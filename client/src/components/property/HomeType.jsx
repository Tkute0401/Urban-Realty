import React, { useState, useEffect, useRef, useCallback } from 'react';
import './HomeType.css';
import './FilterDropdown.css';

const HomeType = ({ onApply, currentType = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(!currentType);
  const [selectedTypes, setSelectedTypes] = useState({
    houses: false,
    townhomes: false,
    multifamily: false,
    condos: false,
    lots: false,
    apartments: false,
    manufactured: false
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Home type options with icons and descriptions
  const homeTypeOptions = {
    houses: { 
      label: 'Houses', 
      icon: '🏠',
      description: 'Single-family homes'
    },
    townhomes: { 
      label: 'Townhomes', 
      icon: '🏘️',
      description: 'Connected homes'
    },
    multifamily: { 
      label: 'Multi-family', 
      icon: '🏢',
      description: '2+ unit properties'
    },
    condos: { 
      label: 'Condos/Co-ops', 
      icon: '🏬',
      description: 'Shared ownership'
    },
    lots: { 
      label: 'Lots/Land', 
      icon: '🌾',
      description: 'Vacant land'
    },
    apartments: { 
      label: 'Apartments', 
      icon: '🏨',
      description: 'Rental units'
    },
    manufactured: { 
      label: 'Manufactured', 
      icon: '🚐',
      description: 'Mobile homes'
    }
  };

  // Initialize selected types based on current filter
  useEffect(() => {
    if (!currentType) {
      setSelectAll(true);
      setSelectedTypes({
        houses: false,
        townhomes: false,
        multifamily: false,
        condos: false,
        lots: false,
        apartments: false,
        manufactured: false
      });
    } else {
      const typeKey = currentType.toLowerCase().replace(/[/ -]/g, '');
      const typeMap = {
        'house': 'houses',
        'townhouse': 'townhomes',
        'townhome': 'townhomes',
        'apartment': 'apartments',
        'condo': 'condos',
        'condos/coops': 'condos',
        'land': 'lots',
        'lots/land': 'lots',
        'manufactured': 'manufactured',
        'multifamily': 'multifamily'
      };
      
      const mappedKey = typeMap[typeKey] || typeKey;
      
      if (mappedKey in selectedTypes) {
        setSelectedTypes({
          houses: false,
          townhomes: false,
          multifamily: false,
          condos: false,
          lots: false,
          apartments: false,
          manufactured: false,
          [mappedKey]: true
        });
        setSelectAll(false);
      }
    }
  }, [currentType]);

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

  const handleSelectAll = useCallback(() => {
    const newState = !selectAll;
    setSelectAll(newState);
    setSelectedTypes({
      houses: false,
      townhomes: false,
      multifamily: false,
      condos: false,
      lots: false,
      apartments: false,
      manufactured: false
    });
    onApply('');
  }, [selectAll, onApply]);

  const handleTypeChange = useCallback((type) => {
    const updatedTypes = {
      ...selectedTypes,
      [type]: !selectedTypes[type]
    };
    
    setSelectedTypes(updatedTypes);
    setSelectAll(false);
    
    const displayType = homeTypeOptions[type]?.label || '';
    onApply(updatedTypes[type] ? displayType : '');
  }, [selectedTypes, onApply]);

  const hasActiveFilter = currentType && currentType !== '';
  const selectedCount = Object.values(selectedTypes).filter(Boolean).length;

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Home type filter${hasActiveFilter ? ` (${currentType} selected)` : ''}`}
      >
        Home Type {isOpen ? '▲' : '▼'}
        {hasActiveFilter && (
          <span className="ml-2 text-accent fs-12 fw-600">•</span>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-content fade-in" role="dialog" aria-modal="true">
          <h3 className="dropdown-subtitle">
            🏠 Select Home Type
          </h3>
          <div className="type-options" role="group" aria-label="Home type options">
            {/* Select All Option */}
            <div 
              className="type-option"
              onClick={handleSelectAll}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectAll();
                }
              }}
            >
              <input 
                type="checkbox" 
                id="selectAll" 
                checked={selectAll}
                onChange={handleSelectAll}
                aria-label="Select all home types"
              />
              <label htmlFor="selectAll">
                <span className="fw-700 mr-2">✨</span>
                All Home Types
              </label>
            </div>
            
            {/* Individual Home Type Options */}
            {Object.entries(homeTypeOptions).map(([key, option]) => (
              <div 
                key={key} 
                className="type-option"
                onClick={() => handleTypeChange(key)}
                role="option"
                tabIndex={0}
                aria-selected={selectedTypes[key]}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTypeChange(key);
                  }
                }}
              >
                <input 
                  type="checkbox" 
                  id={key} 
                  checked={selectedTypes[key] || false}
                  onChange={() => handleTypeChange(key)}
                  aria-label={`Select ${option.label}`}
                />
                <label htmlFor={key}>
                  <span className="mr-2 fs-16" style={{ filter: selectedTypes[key] ? 'brightness(1.2)' : 'brightness(0.8)' }}>
                    {option.icon}
                  </span>
                  <span className={selectedTypes[key] ? 'fw-600' : 'fw-500'}>
                    {option.label}
                  </span>
                  <span className={`fs-11 ml-1 italic ${selectedTypes[key] ? 'text-accent' : ''}`}>
                    • {option.description}
                  </span>
                </label>
              </div>
            ))}
          </div>
          
          {/* Summary footer */}
          {(selectedCount > 0 || selectAll) && (
            <div className="summary-banner">
              {selectAll 
                ? '🌟 Showing all property types' 
                : `📋 ${selectedCount} type${selectedCount !== 1 ? 's' : ''} selected`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeType;