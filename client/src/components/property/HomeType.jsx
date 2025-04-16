import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const HomeType = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(true);
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
  };

  const handleTypeChange = (type) => {
    const updatedTypes = {
      ...selectedTypes,
      [type]: !selectedTypes[type]
    };
    
    setSelectedTypes(updatedTypes);
    setSelectAll(Object.values(updatedTypes).every(value => !value));
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
        Home Type {isOpen ? '▲' : '▼'}
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
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="houses" 
                checked={selectedTypes.houses}
                onChange={() => handleTypeChange('houses')}
              />
              <label htmlFor="houses">Houses</label>
            </div>
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="townhomes" 
                checked={selectedTypes.townhomes}
                onChange={() => handleTypeChange('townhomes')}
              />
              <label htmlFor="townhomes">Townhomes</label>
            </div>
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="multifamily" 
                checked={selectedTypes.multifamily}
                onChange={() => handleTypeChange('multifamily')}
              />
              <label htmlFor="multifamily">Multi-family</label>
            </div>
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="condos" 
                checked={selectedTypes.condos}
                onChange={() => handleTypeChange('condos')}
              />
              <label htmlFor="condos">Condos/Co-ops</label>
            </div>
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="lots" 
                checked={selectedTypes.lots}
                onChange={() => handleTypeChange('lots')}
              />
              <label htmlFor="lots">Lots/Land</label>
            </div>
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="apartments" 
                checked={selectedTypes.apartments}
                onChange={() => handleTypeChange('apartments')}
              />
              <label htmlFor="apartments">Apartments</label>
            </div>
            
            <div className="type-option">
              <input 
                type="checkbox" 
                id="manufactured" 
                checked={selectedTypes.manufactured}
                onChange={() => handleTypeChange('manufactured')}
              />
              <label htmlFor="manufactured">Manufactured</label>
            </div>
          </div>
          
          <button className="apply-filter-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeType;