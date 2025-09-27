import React, { useState, useEffect, useRef, useCallback } from 'react';
import './More.css';

const More = ({ onApply, currentFilters = {} as any, amenityOptions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('amenities');
  const [selectedFilters, setSelectedFilters] = useState({
    amenities: [],
    city: '',
    state: '',
    minArea: '',
    maxArea: ''
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Initialize filters from props
  useEffect(() => {
    setSelectedFilters({
      amenities: currentFilters.amenities || [],
      city: currentFilters.city || '',
      state: currentFilters.state || '',
      minArea: currentFilters.minArea || '',
      maxArea: currentFilters.maxArea || ''
    });
  }, [currentFilters]);

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
      const dropdown = dropdownRef.current.querySelector('.more-content');
      const button = buttonRef.current;
      const dropdownRect = dropdown.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Reset any previous adjustments
      dropdown.style.right = '0';
      dropdown.style.left = 'auto';
      dropdown.style.transform = 'none';
      
      // Check if dropdown overflows on the right
      if (dropdownRect.right > viewportWidth - 16) {
        // Align dropdown right edge with button right edge
        dropdown.style.right = '0';
      }
      
      // Check if dropdown overflows on the left
      if (dropdownRect.left < 16) {
        // Align dropdown left edge with viewport edge (with padding)
        dropdown.style.left = '16px';
        dropdown.style.right = 'auto';
      }
    }
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const toggleAmenity = useCallback((amenity) => {
    setSelectedFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleApply = useCallback(() => {
    onApply({
      amenities: selectedFilters.amenities,
      city: selectedFilters.city.trim(),
      state: selectedFilters.state.trim(),
      minArea: selectedFilters.minArea ? Number(selectedFilters.minArea) : '',
      maxArea: selectedFilters.maxArea ? Number(selectedFilters.maxArea) : ''
    });
    setIsOpen(false);
  }, [selectedFilters, onApply]);

  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
  }, []);

  // Check if any filters are applied
  const hasSelectedFilters = selectedFilters.amenities.length > 0 || 
    selectedFilters.city.trim() || 
    selectedFilters.state.trim() ||
    selectedFilters.minArea ||
    selectedFilters.maxArea;

  // Count applied filters for display
  const filterCount = [
    selectedFilters.amenities.length > 0,
    selectedFilters.city.trim(),
    selectedFilters.state.trim(),
    selectedFilters.minArea,
    selectedFilters.maxArea
  ].filter(Boolean).length;

  const sections = [
    { id: 'amenities', label: 'Amenities', icon: '🏠' },
    { id: 'location', label: 'Location', icon: '📍' },
    { id: 'area', label: 'Area', icon: '📐' }
  ];

  return (
    <div className="filter-dropdown more-dropdown" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`More filters${filterCount > 0 ? ` (${filterCount} applied)` : ''}`}
      >
        More {isOpen ? '▲' : '▼'}
        {hasSelectedFilters && (
          <span className="ml-2 text-accent fs-12 fw-600">
            {filterCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="dropdown-content more-content" role="dialog" aria-modal="true">
          <div className="more-sidebar" role="tablist">
            {sections.map(({ id, label, icon }) => (
              <div 
                key={id}
                className={`sidebar-item ${activeSection === id ? 'active-sidebar' : ''}`}
                onClick={() => handleSectionChange(id)}
                role="tab"
                tabIndex={0}
                aria-selected={activeSection === id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSectionChange(id);
                  }
                }}
              >
                <span className="mr-2">{icon}</span>
                {label}
              </div>
            ))}
          </div>
          
          <div className="more-content-area" role="tabpanel">
            {activeSection === 'amenities' && (
              <div className="filter-section">
                <h3 className="section-title">Select Amenities</h3>
                <div className="tag-options" role="group" aria-label="Amenity options">
                  {amenityOptions.map(amenity => (
                    <button 
                      key={amenity}
                      className={`tag-option ${selectedFilters.amenities.includes(amenity) ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                      aria-pressed={selectedFilters.amenities.includes(amenity)}
                      aria-label={`${selectedFilters.amenities.includes(amenity) ? 'Remove' : 'Add'} ${amenity} amenity`}
                    >
                      {selectedFilters.amenities.includes(amenity) ? '✓' : '+'} {amenity}
                    </button>
                  ))}
                </div>
                {amenityOptions.length === 0 && (
                  <p className="text-muted italic text-center p-20">
                    No amenities available
                  </p>
                )}
              </div>
            )}
            
            {activeSection === 'location' && (
              <div className="filter-section">
                <h3 className="section-title">Filter by Location</h3>
                <div className="input-field">
                  <label htmlFor="city-input">City</label>
                  <input
                    id="city-input"
                    type="text"
                    value={selectedFilters.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city name"
                    maxLength={100}
                  />
                </div>
                <div className="input-field">
                  <label htmlFor="state-input">State</label>
                  <input
                    id="state-input"
                    type="text"
                    value={selectedFilters.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state name"
                    maxLength={50}
                  />
                </div>
              </div>
            )}
            
            {activeSection === 'area' && (
              <div className="filter-section">
                <h3 className="section-title">Property Area (sq ft)</h3>
                <div className="range-inputs">
                  <div className="input-field">
                    <label htmlFor="min-area-input">Minimum Area</label>
                    <input
                      id="min-area-input"
                      type="number"
                      value={selectedFilters.minArea}
                      onChange={(e) => handleInputChange('minArea', e.target.value)}
                      placeholder="Min sq ft"
                      min="0"
                      max="999999"
                    />
                  </div>
                  <div className="input-field">
                    <label htmlFor="max-area-input">Maximum Area</label>
                    <input
                      id="max-area-input"
                      type="number"
                      value={selectedFilters.maxArea}
                      onChange={(e) => handleInputChange('maxArea', e.target.value)}
                      placeholder="Max sq ft"
                      min="0"
                      max="999999"
                    />
                  </div>
                </div>
                {selectedFilters.minArea && selectedFilters.maxArea && 
                 Number(selectedFilters.minArea) > Number(selectedFilters.maxArea) && (
                  <p className="text-error fs-12 mt-2 italic">
                    ⚠️ Minimum area should be less than maximum area
                  </p>
                )}
              </div>
            )}
          </div>
          
          <button 
            className="apply-filter-btn" 
            onClick={handleApply}
            aria-label={`Apply filters${filterCount > 0 ? ` (${filterCount} selected)` : ''}`}
          >
            Apply Filters{filterCount > 0 && ` (${filterCount})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default More;