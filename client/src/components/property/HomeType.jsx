import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const HomeType = ({ onApply, currentType }) => {
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

  useEffect(() => {
    if (currentType) {
      const typeKey = currentType.toLowerCase().replace(/ /g, '');
      if (typeKey in selectedTypes) {
        setSelectedTypes({
          ...selectedTypes,
          [typeKey]: true
        });
        setSelectAll(false);
      }
    }
  }, [currentType]);

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

  const handleSelectAll = () => {
    const newState = !selectAll;
    setSelectAll(newState);
    
    const updatedTypes = {};
    Object.keys(selectedTypes).forEach(key => {
      updatedTypes[key] = false;
    });
    
    setSelectedTypes(updatedTypes);
    if (newState) {
      onApply('');
    }
  };

  const handleTypeChange = (type) => {
    const updatedTypes = {
      ...selectedTypes,
      [type]: !selectedTypes[type]
    };
    
    setSelectedTypes(updatedTypes);
    setSelectAll(Object.values(updatedTypes).every(value => !value));
    
    // Convert the type to a display format
    const displayType = type === 'condos' ? 'Condos/Co-ops' : 
                       type === 'townhomes' ? 'Townhomes' :
                       type === 'multifamily' ? 'Multi-family' :
                       type === 'manufactured' ? 'Manufactured' :
                       type.charAt(0).toUpperCase() + type.slice(1);
    
    if (updatedTypes[type]) {
      onApply(displayType);
    } else {
      onApply('');
    }
  };

  const hasActiveFilter = currentType && currentType !== '';

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
      >
        Home Type {isOpen ? '▲' : '▼'}
        {hasActiveFilter && (
          <span style={{ marginLeft: '4px', color: '#78CADC' }}>•</span>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-content fade-in">
          <h3 className="dropdown-subtitle">Home Type</h3>
          
          <div className="type-options">
            <div className="type-option">
              <input 
                type="checkbox" 
                id="selectAll" 
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label htmlFor="selectAll">Select All</label>
            </div>
            
            {Object.entries({
              houses: 'Houses',
              townhomes: 'Townhomes',
              multifamily: 'Multi-family',
              condos: 'Condos/Co-ops',
              lots: 'Lots/Land',
              apartments: 'Apartments',
              manufactured: 'Manufactured'
            }).map(([key, label]) => (
              <div key={key} className="type-option">
                <input 
                  type="checkbox" 
                  id={key} 
                  checked={selectedTypes[key]}
                  onChange={() => handleTypeChange(key)}
                />
                <label htmlFor={key}>{label}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeType;