import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './HomeType.module.css';

const HomeType = ({ onApply, currentType = '' }: {
  onApply?: (types: string[]) => void;
  currentType?: string;
}) => {
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
      icon: '🏭',
      description: 'Mobile & manufactured'
    }
  };

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

  const handleTypeToggle = useCallback((typeKey: string) => {
    setSelectedTypes(prev => {
      const newTypes = { ...prev, [typeKey]: !prev[typeKey as keyof typeof prev] };
      
      // Check if all are now false, if so, set selectAll to true
      const hasSelected = Object.values(newTypes).some(val => val);
      if (!hasSelected) {
        setSelectAll(true);
      } else {
        setSelectAll(false);
      }
      
      return newTypes;
    });
  }, []);

  const handleSelectAllToggle = useCallback(() => {
    if (selectAll) {
      // If currently "All" is selected, do nothing (keep it selected)
      return;
    } else {
      // If currently specific types are selected, clear all and set to "All"
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
    }
  }, [selectAll]);

  const handleApply = useCallback(() => {
    if (selectAll) {
      onApply?.([]);
    } else {
      const activeTypes = Object.entries(selectedTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([type, _]) => homeTypeOptions[type as keyof typeof homeTypeOptions].label);
      onApply?.(activeTypes);
    }
    setIsOpen(false);
  }, [selectAll, selectedTypes, onApply]);

  const handleReset = useCallback(() => {
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
  }, []);

  const hasActiveFilters = !selectAll && Object.values(selectedTypes).some(val => val);
  const selectedCount = Object.values(selectedTypes).filter(val => val).length;

  return (
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`${styles.filterBtn} ${isOpen ? styles.activeDropdown : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Home Type filter${hasActiveFilters ? ` (${selectedCount} selected)` : ''}`}
      >
        Home Type {isOpen ? '▲' : '▼'}
        {hasActiveFilters && (
          <span className={styles.activeIndicator}>•</span>
        )}
      </button>
      
      {isOpen && (
        <div className={styles.dropdownContent} role="dialog" aria-modal="true">
          <h3 className={styles.dropdownSubtitle}>
            🏠 Property Types
          </h3>
          
          {/* Select All Option */}
          <div className={styles.selectAllSection}>
            <button 
              className={`${styles.selectAllBtn} ${selectAll ? styles.activeSelectAll : ''}`}
              onClick={handleSelectAllToggle}
            >
              <span className={styles.selectAllIcon}>🏡</span>
              <div className={styles.selectAllContent}>
                <span className={styles.selectAllLabel}>All Property Types</span>
                <span className={styles.selectAllDescription}>Show all available properties</span>
              </div>
              {selectAll && <span className={styles.checkmark}>✓</span>}
            </button>
          </div>

          {/* Individual Type Options */}
          <div className={styles.typeOptionsGrid}>
            {Object.entries(homeTypeOptions).map(([key, option]) => (
              <button 
                key={key}
                className={`${styles.typeOptionBtn} ${selectedTypes[key as keyof typeof selectedTypes] ? styles.activeType : ''}`}
                onClick={() => handleTypeToggle(key)}
                disabled={selectAll}
              >
                <span className={styles.typeIcon}>{option.icon}</span>
                <div className={styles.typeContent}>
                  <span className={styles.typeLabel}>{option.label}</span>
                  <span className={styles.typeDescription}>{option.description}</span>
                </div>
                {selectedTypes[key as keyof typeof selectedTypes] && (
                  <span className={styles.checkmark}>✓</span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Preset Categories */}
          <div className={styles.presetCategories}>
            <div className={styles.presetsLabel}>🎯 Quick Categories</div>
            <div className={styles.presetsGrid}>
              <button 
                className={styles.presetBtn}
                onClick={() => {
                  setSelectAll(false);
                  setSelectedTypes({
                    houses: true,
                    townhomes: true,
                    multifamily: false,
                    condos: false,
                    lots: false,
                    apartments: false,
                    manufactured: false
                  });
                }}
              >
                🏘️ Residential
              </button>
              <button 
                className={styles.presetBtn}
                onClick={() => {
                  setSelectAll(false);
                  setSelectedTypes({
                    houses: false,
                    townhomes: false,
                    multifamily: true,
                    condos: true,
                    lots: false,
                    apartments: true,
                    manufactured: false
                  });
                }}
              >
                🏢 Multi-Unit
              </button>
              <button 
                className={styles.presetBtn}
                onClick={() => {
                  setSelectAll(false);
                  setSelectedTypes({
                    houses: false,
                    townhomes: false,
                    multifamily: false,
                    condos: false,
                    lots: true,
                    apartments: false,
                    manufactured: false
                  });
                }}
              >
                🌾 Investment
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={styles.sliderActions}>
            <button 
              className={styles.resetBtn} 
              onClick={handleReset}
              aria-label="Reset home type filters"
            >
              🔄 Reset
            </button>
            <button 
              className={styles.applyBtn} 
              onClick={handleApply}
              aria-label="Apply home type filters"
            >
              ✨ Apply Filters
            </button>
          </div>

          {/* Footer info */}
          <div className={styles.dropdownFooter}>
            <div className={styles.footerTip}>
              💡 <span>Select specific types or use &quot;All&quot; for maximum results</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeType;