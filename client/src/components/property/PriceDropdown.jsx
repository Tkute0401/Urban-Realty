import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './PriceDropdown.css';
import './FilterDropdown.css';

const PriceDropdown = ({ activeBtn = 'BUY', onApply, currentMin = '', currentMax = '' }) => {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(currentMin || '');
  const [maxPrice, setMaxPrice] = useState(currentMax || '');
  const [tempValues, setTempValues] = useState({ 
    min: currentMin || '', 
    max: currentMax || '' 
  });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const minSliderRef = useRef(null);
  const maxSliderRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // Enhanced price ranges with better formatting
  const priceRanges = useMemo(() => {
    return activeBtn === 'BUY' ? {
      min: 0,
      max: 100000000, // 10 Crore
      step: 50000, // Better step for smoother interaction
      format: (value) => {
        if (value === 0) return '₹0';
        if (value < 1000) return `₹${value}`;
        if (value < 100000) {
          const thousands = value / 1000;
          return `₹${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}K`;
        }
        if (value < 10000000) {
          const lacs = value / 100000;
          return `₹${lacs.toFixed(lacs % 1 === 0 ? 0 : 1)}L`;
        }
        const crores = value / 10000000;
        return `₹${crores.toFixed(crores % 1 === 0 ? 0 : 1)}Cr`;
      }
    } : {
      min: 0,
      max: 150000,
      step: 1000,
      format: (value) => value === 0 ? '₹0' : `₹${value.toLocaleString()}`
    };
  }, [activeBtn]);

  // Initialize values from props
  useEffect(() => {
    setMinPrice(currentMin || '');
    setMaxPrice(currentMax || '');
    setTempValues({ min: currentMin || '', max: currentMax || '' });
  }, [currentMin, currentMax]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPriceOpen(false);
      }
    };

    if (isPriceOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isPriceOpen]);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isPriceOpen) {
        setIsPriceOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isPriceOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isPriceOpen]);

  // Reflect slider percentages as CSS variables (replacing inline style)
  useEffect(() => {
    const container = sliderContainerRef.current;
    if (!container) return;
    const minPercent = ((displayMinValue - priceRanges.min) / (priceRanges.max - priceRanges.min)) * 100;
    const maxPercent = ((displayMaxValue - priceRanges.min) / (priceRanges.max - priceRanges.min)) * 100;
    container.style.setProperty('--min-percent', `${minPercent}%`);
    container.style.setProperty('--max-percent', `${maxPercent}%`);
  }, [priceRanges.min, priceRanges.max, displayMinValue, displayMaxValue]);

  // Adjust dropdown position to prevent overflow
  useEffect(() => {
    if (isPriceOpen && dropdownRef.current) {
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
  }, [isPriceOpen]);

  // Update range slider fill effect
  useEffect(() => {
    if (isPriceOpen && dropdownRef.current) {
      const rangeSlider = dropdownRef.current.querySelector('.range-slider');
      if (rangeSlider) {
        const min = Number(tempValues.min) || priceRanges.min;
        const max = Number(tempValues.max) || priceRanges.max;
        const minPercent = ((min - priceRanges.min) / (priceRanges.max - priceRanges.min)) * 100;
        const maxPercent = ((max - priceRanges.min) / (priceRanges.max - priceRanges.min)) * 100;
        
        const afterElement = rangeSlider.querySelector('::after') || rangeSlider;
        if (rangeSlider.style) {
          rangeSlider.style.setProperty('--min-percent', `${minPercent}%`);
          rangeSlider.style.setProperty('--max-percent', `${maxPercent}%`);
        }
      }
    }
  }, [tempValues, priceRanges, isPriceOpen]);

  const togglePriceDropdown = useCallback(() => {
    setIsPriceOpen(prev => !prev);
  }, []);

  const handleSliderChange = useCallback((e, type) => {
    const value = Number(e.target.value);
    
    setTempValues(prev => {
      const newValues = { ...prev, [type]: value };
      
      // Ensure min doesn't exceed max and vice versa
      if (type === 'min' && newValues.max && value > Number(newValues.max)) {
        newValues.max = value;
      }
      if (type === 'max' && newValues.min && value < Number(newValues.min)) {
        newValues.min = value;
      }
      
      return newValues;
    });
  }, []);

  const handleApply = useCallback(() => {
    const finalMin = tempValues.min || '';
    const finalMax = tempValues.max || '';
    
    setMinPrice(finalMin);
    setMaxPrice(finalMax);
    onApply(finalMin, finalMax);
    setIsPriceOpen(false);
  }, [tempValues, onApply]);

  const handleReset = useCallback(() => {
    setTempValues({ min: '', max: '' });
  }, []);

  const hasActiveFilter = minPrice || maxPrice;
  const displayMinValue = Number(tempValues.min) || priceRanges.min;
  const displayMaxValue = Number(tempValues.max) || priceRanges.max;

  // Calculate price range summary
  const priceRangeSummary = useMemo(() => {
    if (!tempValues.min && !tempValues.max) {
      return `Any Price Range`;
    }
    const minText = tempValues.min ? priceRanges.format(Number(tempValues.min)) : 'No Min';
    const maxText = tempValues.max ? priceRanges.format(Number(tempValues.max)) : 'No Max';
    return `${minText} - ${maxText}`;
  }, [tempValues, priceRanges]);

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`filter-btn ${isPriceOpen ? 'active-dropdown' : ''}`}
        onClick={togglePriceDropdown}
        aria-expanded={isPriceOpen}
        aria-haspopup="true"
        aria-label={`Price filter${hasActiveFilter ? ` (${priceRangeSummary})` : ''}`}
      >
        Price {isPriceOpen ? '▲' : '▼'}
        {hasActiveFilter && (
          <span className="ml-2 text-accent fs-12 fw-600">•</span>
        )}
      </button>
      
      {isPriceOpen && (
        <div className="dropdown-content fade-in" role="dialog" aria-modal="true">
          <h3 className="dropdown-subtitle">
            💰 Price Range
          </h3>
          
          {activeBtn === 'BUY' && (
            <div className="tab-controls">
              <button 
                className="tab-btn active-tab"
                aria-label="List price filter"
              >
                📋 {activeBtn === 'BUY' ? 'List Price' : 'Monthly Payment'}
              </button>
            </div>
          )}
          
          <div className="price-slider-container">
            <div className="slider-values">
              <span>
                {tempValues.min ? priceRanges.format(displayMinValue) : '₹0'}
              </span>
              <span>to</span>
              <span>
                {tempValues.max ? priceRanges.format(displayMaxValue) : `₹${activeBtn === 'BUY' ? '10Cr' : '1.5L'}`}
              </span>
            </div>
            
            <div 
              ref={sliderContainerRef}
              className="range-slider"
            >
              <input
                ref={minSliderRef}
                type="range"
                min={priceRanges.min}
                max={priceRanges.max}
                step={priceRanges.step}
                value={displayMinValue}
                onChange={(e) => handleSliderChange(e, 'min')}
                className={`slider min-slider ${displayMinValue > (priceRanges.max * 0.8) ? 'z-5' : 'z-3'}`}
                aria-label="Minimum price"
              />
              <input
                ref={maxSliderRef}
                type="range"
                min={priceRanges.min}
                max={priceRanges.max}
                step={priceRanges.step}
                value={displayMaxValue}
                onChange={(e) => handleSliderChange(e, 'max')}
                className={`slider max-slider ${displayMaxValue < (priceRanges.max * 0.2) ? 'z-5' : 'z-4'}`}
                aria-label="Maximum price"
              />
            </div>
            
            <div className="price-range-indicator">
              🏷️ {priceRangeSummary}
            </div>
            
            <div className="slider-actions">
              <button 
                className="reset-btn" 
                onClick={handleReset}
                aria-label="Reset price filters"
              >
                🔄 Reset
              </button>
              <button 
                className="apply-filter-btn-pd" 
                onClick={handleApply}
                aria-label="Apply price filters"
              >
                ✨ Apply Filters
              </button>
            </div>
          </div>
          
          {/* Quick preset buttons */}
          <div className="price-presets">
            <div className="presets-label">🎯 Quick Presets</div>
            <div className="presets-grid">
              {activeBtn === 'BUY' ? (
                <>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 0, max: 5000000 })}
                  >
                    Under ₹50L
                  </button>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 5000000, max: 10000000 })}
                  >
                    ₹50L - ₹1Cr
                  </button>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 10000000, max: 25000000 })}
                  >
                    ₹1Cr - ₹2.5Cr
                  </button>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 25000000, max: '' })}
                  >
                    Above ₹2.5Cr
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 0, max: 25000 })}
                  >
                    Under ₹25K
                  </button>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 25000, max: 50000 })}
                  >
                    ₹25K - ₹50K
                  </button>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 50000, max: 100000 })}
                  >
                    ₹50K - ₹1L
                  </button>
                  <button 
                    className="preset-btn"
                    onClick={() => setTempValues({ min: 100000, max: '' })}
                  >
                    Above ₹1L
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Footer info */}
          <div className="dropdown-footer">
            <div className="footer-tip">
              💡 <span>Drag sliders or use presets for quick selection</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDropdown;