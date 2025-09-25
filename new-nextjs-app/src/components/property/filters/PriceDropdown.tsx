import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './PriceDropdown.module.css';

const PriceDropdown = ({ activeBtn = 'BUY', onApply, currentMin = '', currentMax = '' }: {
  activeBtn?: string;
  onApply?: (min: string, max: string) => void;
  currentMin?: string;
  currentMax?: string;
}) => {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(currentMin || '');
  const [maxPrice, setMaxPrice] = useState(currentMax || '');
  const [tempValues, setTempValues] = useState({ 
    min: currentMin || '', 
    max: currentMax || '' 
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Enhanced price ranges with better formatting
  const priceRanges = useMemo(() => {
    return activeBtn === 'BUY' ? {
      min: 0,
      max: 100000000, // 10 Crore
      step: 50000, // Better step for smoother interaction
      format: (value: number) => {
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
      format: (value: number) => value === 0 ? '₹0' : `₹${value.toLocaleString()}`
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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const togglePriceDropdown = useCallback(() => {
    setIsPriceOpen(prev => !prev);
  }, []);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    
    setTempValues(prev => {
      const newValues = { ...prev, [type]: value.toString() };
      
      // Ensure min doesn't exceed max and vice versa
      if (type === 'min' && newValues.max && value > Number(newValues.max)) {
        newValues.max = value.toString();
      }
      if (type === 'max' && newValues.min && value < Number(newValues.min)) {
        newValues.min = value.toString();
      }
      
      return newValues;
    });
  }, []);

  const handleApply = useCallback(() => {
    const finalMin = tempValues.min || '';
    const finalMax = tempValues.max || '';
    
    setMinPrice(finalMin);
    setMaxPrice(finalMax);
    onApply?.(finalMin, finalMax);
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
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button 
        ref={buttonRef}
        className={`${styles.filterBtn} ${isPriceOpen ? styles.activeDropdown : ''}`}
        onClick={togglePriceDropdown}
        aria-expanded={isPriceOpen}
        aria-haspopup="true"
        aria-label={`Price filter${hasActiveFilter ? ` (${priceRangeSummary})` : ''}`}
      >
        Price {isPriceOpen ? '▲' : '▼'}
        {hasActiveFilter && (
          <span className={styles.activeIndicator}>•</span>
        )}
      </button>
      
      {isPriceOpen && (
        <div className={styles.dropdownContent} role="dialog" aria-modal="true">
          <h3 className={styles.dropdownSubtitle}>
            💰 Price Range
          </h3>
          
          <div className={styles.priceSliderContainer}>
            <div className={styles.sliderValues}>
              <span>
                {tempValues.min ? priceRanges.format(displayMinValue) : '₹0'}
              </span>
              <span>to</span>
              <span>
                {tempValues.max ? priceRanges.format(displayMaxValue) : `₹${activeBtn === 'BUY' ? '10Cr' : '1.5L'}`}
              </span>
            </div>
            
            <div className={styles.rangeSlider}>
              <input
                type="range"
                min={priceRanges.min}
                max={priceRanges.max}
                step={priceRanges.step}
                value={displayMinValue}
                onChange={(e) => handleSliderChange(e, 'min')}
                className={`${styles.slider} ${styles.minSlider}`}
                aria-label="Minimum price"
              />
              <input
                type="range"
                min={priceRanges.min}
                max={priceRanges.max}
                step={priceRanges.step}
                value={displayMaxValue}
                onChange={(e) => handleSliderChange(e, 'max')}
                className={`${styles.slider} ${styles.maxSlider}`}
                aria-label="Maximum price"
              />
            </div>
            
            <div className={styles.priceRangeIndicator}>
              🏷️ {priceRangeSummary}
            </div>
            
            <div className={styles.sliderActions}>
              <button 
                className={styles.resetBtn} 
                onClick={handleReset}
                aria-label="Reset price filters"
              >
                🔄 Reset
              </button>
              <button 
                className={styles.applyBtn} 
                onClick={handleApply}
                aria-label="Apply price filters"
              >
                ✨ Apply Filters
              </button>
            </div>
          </div>
          
          {/* Quick preset buttons */}
          <div className={styles.pricePresets}>
            <div className={styles.presetsLabel}>🎯 Quick Presets</div>
            <div className={styles.presetsGrid}>
              {activeBtn === 'BUY' ? (
                <>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '0', max: '5000000' })}
                  >
                    Under ₹50L
                  </button>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '5000000', max: '10000000' })}
                  >
                    ₹50L - ₹1Cr
                  </button>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '10000000', max: '25000000' })}
                  >
                    ₹1Cr - ₹2.5Cr
                  </button>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '25000000', max: '' })}
                  >
                    Above ₹2.5Cr
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '0', max: '25000' })}
                  >
                    Under ₹25K
                  </button>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '25000', max: '50000' })}
                  >
                    ₹25K - ₹50K
                  </button>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '50000', max: '100000' })}
                  >
                    ₹50K - ₹1L
                  </button>
                  <button 
                    className={styles.presetBtn}
                    onClick={() => setTempValues({ min: '100000', max: '' })}
                  >
                    Above ₹1L
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Footer info */}
          <div className={styles.dropdownFooter}>
            <div className={styles.footerTip}>
              💡 <span>Drag sliders or use presets for quick selection</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDropdown;