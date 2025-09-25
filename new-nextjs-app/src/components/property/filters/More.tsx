import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './More.module.css';

const More = ({ onApply, currentFilters = {}, amenityOptions = [] }: {
  onApply?: (filters: any) => void;
  currentFilters?: any;
  amenityOptions?: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('amenities');
  const [selectedFilters, setSelectedFilters] = useState({
    amenities: [],
    city: '',
    state: '',
    minArea: '',
    maxArea: ''
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const handleAmenityToggle = useCallback((amenity: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter((a: string) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleApply = useCallback(() => {
    onApply?.(selectedFilters);
    setIsOpen(false);
  }, [selectedFilters, onApply]);

  const handleReset = useCallback(() => {
    setSelectedFilters({
      amenities: [],
      city: '',
      state: '',
      minArea: '',
      maxArea: ''
    });
  }, []);

  const hasActiveFilters = selectedFilters.amenities.length > 0 || 
    selectedFilters.city || selectedFilters.state || 
    selectedFilters.minArea || selectedFilters.maxArea;

  const sections = [
    { key: 'amenities', label: '🏠 Amenities', icon: '🏠' },
    { key: 'location', label: '📍 Location', icon: '📍' },
    { key: 'area', label: '📐 Area', icon: '📐' }
  ];

  return (
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`${styles.filterBtn} ${isOpen ? styles.activeDropdown : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`More filters${hasActiveFilters ? ' (active)' : ''}`}
      >
        More {isOpen ? '▲' : '▼'}
        {hasActiveFilters && (
          <span className={styles.activeIndicator}>•</span>
        )}
      </button>
      
      {isOpen && (
        <div className={styles.dropdownContent} role="dialog" aria-modal="true">
          <h3 className={styles.dropdownSubtitle}>
            ⚙️ Advanced Filters
          </h3>
          
          {/* Section Tabs */}
          <div className={styles.sectionTabs}>
            {sections.map(section => (
              <button
                key={section.key}
                className={`${styles.sectionTab} ${activeSection === section.key ? styles.activeTab : ''}`}
                onClick={() => handleSectionChange(section.key)}
              >
                <span className={styles.sectionIcon}>{section.icon}</span>
                <span className={styles.sectionLabel}>{section.label.split(' ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Amenities Section */}
          {activeSection === 'amenities' && (
            <div className={styles.amenitiesSection}>
              <div className={styles.sectionTitle}>
                🏠 Amenities & Features
                {selectedFilters.amenities.length > 0 && (
                  <span className={styles.selectionCount}>({selectedFilters.amenities.length})</span>
                )}
              </div>
              <div className={styles.amenitiesGrid}>
                {amenityOptions.map(amenity => (
                  <button
                    key={amenity}
                    className={`${styles.amenityBtn} ${selectedFilters.amenities.includes(amenity) ? styles.activeAmenity : ''}`}
                    onClick={() => handleAmenityToggle(amenity)}
                  >
                    <span className={styles.amenityIcon}>
                      {amenity === 'Pool' && '🏊'}
                      {amenity === 'Gym' && '💪'}
                      {amenity === 'Parking' && '🚗'}
                      {amenity === 'Garden' && '🌳'}
                      {amenity === 'Balcony' && '🏡'}
                      {amenity === 'Security' && '🔒'}
                      {amenity === 'Furnished' && '🪑'}
                      {amenity === 'Fireplace' && '🔥'}
                      {amenity === 'Elevator' && '🛗'}
                      {!['Pool', 'Gym', 'Parking', 'Garden', 'Balcony', 'Security', 'Furnished', 'Fireplace', 'Elevator'].includes(amenity) && '✨'}
                    </span>
                    <span className={styles.amenityText}>{amenity}</span>
                    {selectedFilters.amenities.includes(amenity) && (
                      <span className={styles.checkmark}>✓</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedFilters.amenities.length > 0 && (
                <div className={styles.selectedAmenities}>
                  <strong>Selected:</strong> {selectedFilters.amenities.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Location Section */}
          {activeSection === 'location' && (
            <div className={styles.locationSection}>
              <div className={styles.sectionTitle}>
                📍 Location Filters
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>City</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Enter city name"
                  value={selectedFilters.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>State</label>
                <input
                  type="text"
                  className={styles.textInput}
                  placeholder="Enter state name"
                  value={selectedFilters.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Area Section */}
          {activeSection === 'area' && (
            <div className={styles.areaSection}>
              <div className={styles.sectionTitle}>
                📐 Area Range (sq ft)
              </div>
              <div className={styles.rangeInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Min Area</label>
                  <input
                    type="number"
                    className={styles.numberInput}
                    placeholder="500"
                    value={selectedFilters.minArea}
                    onChange={(e) => handleInputChange('minArea', e.target.value)}
                  />
                </div>
                <div className={styles.rangeSeparator}>to</div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Max Area</label>
                  <input
                    type="number"
                    className={styles.numberInput}
                    placeholder="5000"
                    value={selectedFilters.maxArea}
                    onChange={(e) => handleInputChange('maxArea', e.target.value)}
                  />
                </div>
              </div>
              {(selectedFilters.minArea || selectedFilters.maxArea) && (
                <div className={styles.areaRange}>
                  Range: {selectedFilters.minArea || '0'} - {selectedFilters.maxArea || '∞'} sq ft
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className={styles.sliderActions}>
            <button 
              className={styles.resetBtn} 
              onClick={handleReset}
              aria-label="Reset all additional filters"
            >
              🔄 Reset All
            </button>
            <button 
              className={styles.applyBtn} 
              onClick={handleApply}
              aria-label="Apply additional filters"
            >
              ✨ Apply Filters
            </button>
          </div>

          {/* Footer info */}
          <div className={styles.dropdownFooter}>
            <div className={styles.footerTip}>
              💡 <span>Use tabs to navigate between different filter categories</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default More;