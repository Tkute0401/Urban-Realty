import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './BedBath.module.css';

const BedBath = ({ onApply, currentBedrooms = '', currentBathrooms = '' }: {
  onApply?: (bedrooms: string, bathrooms: string) => void;
  currentBedrooms?: string;
  currentBathrooms?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bedrooms, setBedrooms] = useState(currentBedrooms || 'Any');
  const [bathrooms, setBathrooms] = useState(currentBathrooms || 'Any');
  const [tempValues, setTempValues] = useState({
    bedrooms: currentBedrooms || 'Any',
    bathrooms: currentBathrooms || 'Any'
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleBedroomSelect = useCallback((option: string) => {
    setTempValues(prev => ({ ...prev, bedrooms: option }));
  }, []);

  const handleBathroomSelect = useCallback((option: string) => {
    setTempValues(prev => ({ ...prev, bathrooms: option }));
  }, []);

  const handleApply = useCallback(() => {
    setBedrooms(tempValues.bedrooms);
    setBathrooms(tempValues.bathrooms);
    onApply?.(
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
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`${styles.filterBtn} ${isOpen ? styles.activeDropdown : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Beds and Baths filter${hasActiveFilters ? ` (${filterSummary})` : ''}`}
      >
        Beds & Baths {isOpen ? '▲' : '▼'}
        {hasActiveFilters && (
          <span className={styles.activeIndicator}>•</span>
        )}
      </button>
      
      {isOpen && (
        <div className={styles.dropdownContent} role="dialog" aria-modal="true">
          <h3 className={styles.dropdownSubtitle}>
            🛏️ Bedrooms & Bathrooms
          </h3>
          
          {/* Current Selection Summary */}
          <div className={styles.selectionSummary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Bedrooms:</span>
              <span className={styles.summaryValue}>{tempValues.bedrooms}</span>
            </div>
            <div className={styles.summaryDivider}>•</div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Bathrooms:</span>
              <span className={styles.summaryValue}>{tempValues.bathrooms}</span>
            </div>
          </div>

          {/* Bedrooms Section */}
          <div className={styles.bedroomsSection}>
            <div className={styles.sectionTitle}>
              🛏️ <span>Bedrooms</span>
              <div className={styles.sectionIndicator}>
                {tempValues.bedrooms !== 'Any' && (
                  <span className={styles.activeIndicator}>{tempValues.bedrooms}</span>
                )}
              </div>
            </div>
            <div className={styles.optionsGrid}>
              {bedroomOptions.map(option => (
                <button 
                  key={`bed-${option}`}
                  className={`${styles.optionBtn} ${tempValues.bedrooms === option ? styles.activeOption : ''}`}
                  onClick={() => handleBedroomSelect(option)}
                  aria-label={`${option} bedrooms`}
                >
                  <span className={styles.optionText}>{option}</span>
                  {option !== 'Any' && <span className={styles.optionSuffix}>bed{option.includes('+') && option !== '1+' ? 's' : ''}</span>}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bathrooms Section */}
          <div className={styles.bathroomsSection}>
            <div className={styles.sectionTitle}>
              🚿 <span>Bathrooms</span>
              <div className={styles.sectionIndicator}>
                {tempValues.bathrooms !== 'Any' && (
                  <span className={styles.activeIndicator}>{tempValues.bathrooms}</span>
                )}
              </div>
            </div>
            <div className={styles.optionsGrid}>
              {bathroomOptions.map(option => (
                <button 
                  key={`bath-${option}`}
                  className={`${styles.optionBtn} ${tempValues.bathrooms === option ? styles.activeOption : ''}`}
                  onClick={() => handleBathroomSelect(option)}
                  aria-label={`${option} bathrooms`}
                >
                  <span className={styles.optionText}>{option}</span>
                  {option !== 'Any' && <span className={styles.optionSuffix}>bath{option.includes('+') && option !== '1+' && option !== '1.5+' ? 's' : ''}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Preset Combinations */}
          <div className={styles.presetCombinations}>
            <div className={styles.presetsLabel}>🎯 Popular Combinations</div>
            <div className={styles.combinationsGrid}>
              <button 
                className={styles.comboBtn}
                onClick={() => setTempValues({ bedrooms: '1+', bathrooms: '1+' })}
              >
                1 Bed, 1 Bath
              </button>
              <button 
                className={styles.comboBtn}
                onClick={() => setTempValues({ bedrooms: '2+', bathrooms: '2+' })}
              >
                2 Bed, 2 Bath
              </button>
              <button 
                className={styles.comboBtn}
                onClick={() => setTempValues({ bedrooms: '3+', bathrooms: '2+' })}
              >
                3 Bed, 2 Bath
              </button>
              <button 
                className={styles.comboBtn}
                onClick={() => setTempValues({ bedrooms: '4+', bathrooms: '3+' })}
              >
                4+ Bed, 3+ Bath
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={styles.sliderActions}>
            <button 
              className={styles.resetBtn} 
              onClick={handleReset}
              aria-label="Reset beds and baths filters"
            >
              🔄 Reset
            </button>
            <button 
              className={styles.applyBtn} 
              onClick={handleApply}
              aria-label="Apply beds and baths filters"
            >
              ✨ Apply Filters
            </button>
          </div>

          {/* Footer info */}
          <div className={styles.dropdownFooter}>
            <div className={styles.footerTip}>
              💡 <span>Select individual options or use popular combinations</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedBath;