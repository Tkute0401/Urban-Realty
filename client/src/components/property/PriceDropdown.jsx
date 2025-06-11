import React, { useState, useEffect, useRef } from 'react';
import './PriceDropdown.css';
import './FilterDropdown.css';

const PriceDropdown = ({ activeBtn = 'BUY', onApply, currentMin = '', currentMax = '' }) => {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(currentMin || '');
  const [maxPrice, setMaxPrice] = useState(currentMax || '');
  const [tempValues, setTempValues] = useState({ min: currentMin || '', max: currentMax || '' });
  const dropdownRef = useRef(null);

  const priceRanges = activeBtn === 'BUY' ? {
  min: 0,
  max: 100000000, // 10 Crore
  step: 5000, // Smaller step for better granularity
  format: (value) => {
    if (value === 0) return '₹0';
    if (value < 1000) return `₹${value}`;
    if (value < 100000) return `₹${(value/1000).toFixed(value%1000 === 0 ? 0 : 1)} Thousand`;
    if (value < 10000000) return `₹${(value/100000).toFixed(value%100000 === 0 ? 0 : 1)} Lac`;
    return `₹${(value/10000000).toFixed(value%10000000 === 0 ? 0 : 1)} Cr`;
  }
} : {
  min: 0,
  max: 150000,
  step: 1000,
  format: (value) => value === 0 ? '₹0' : `₹${value.toLocaleString()}`
};

  useEffect(() => {
    setMinPrice(currentMin || '');
    setMaxPrice(currentMax || '');
    setTempValues({ min: currentMin || '', max: currentMax || '' });
  }, [currentMin, currentMax]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPriceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePriceDropdown = () => {
    setIsPriceOpen(!isPriceOpen);
  };

  const handleSliderChange = (e, type) => {
    const value = e.target.value;
    setTempValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleApply = () => {
    setMinPrice(tempValues.min);
    setMaxPrice(tempValues.max);
    onApply(tempValues.min, tempValues.max);
    setIsPriceOpen(false);
  };

  const handleReset = () => {
    setTempValues({ min: '', max: '' });
  };

  const hasActiveFilter = minPrice || maxPrice;

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${isPriceOpen ? 'active-dropdown' : ''}`}
        onClick={togglePriceDropdown}
      >
        Price {isPriceOpen ? '▲' : '▼'}
        {hasActiveFilter && (
          <span style={{ marginLeft: '4px', color: '#78CADC' }}>•</span>
        )}
      </button>
      
      {isPriceOpen && (
        <div className="dropdown-content fade-in">
          <h3 className="dropdown-subtitle">Price Range</h3>
          
          {activeBtn === 'BUY' && (
            <div className="tab-controls" style={{ justifyContent: 'center' }}>
              <button className="tab-btn active-tab">
                {activeBtn === 'BUY' ? 'List Price' : 'Monthly Payment'}
              </button>
            </div>
          )}
          
          <div className="price-slider-container">
            <div className="slider-values">
  <span>{tempValues.min ? priceRanges.format(Number(tempValues.min)) : '₹0'}</span>
  <span>&nbsp;to&nbsp;</span>
  <span>{tempValues.max ? priceRanges.format(Number(tempValues.max)) : '₹10 Cr'}</span>
</div>
            
            <div className="range-slider">
              <input
                type="range"
                min={priceRanges.min}
                max={priceRanges.max}
                step={priceRanges.step}
                value={tempValues.min || priceRanges.min}
                onChange={(e) => handleSliderChange(e, 'min')}
                className="slider"
              />
              <input
                type="range"
                min={priceRanges.min}
                max={priceRanges.max}
                step={priceRanges.step}
                value={tempValues.max || priceRanges.max}
                onChange={(e) => handleSliderChange(e, 'max')}
                className="slider"
              />
            </div>
          </div>
          
          <div className="slider-actions">
            <button className="reset-btn" onClick={handleReset}>
              Reset
            </button>
            <button className="apply-filter-btn" onClick={handleApply}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceDropdown;