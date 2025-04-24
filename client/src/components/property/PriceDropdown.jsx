import React, { useState, useEffect, useRef } from 'react';
import './PriceDropdown.css';

const PriceDropdown = ({ activeBtn = 'BUY', onApply, currentMin, currentMax }) => {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(activeBtn === 'BUY' ? 'List Price' : 'Monthly Payment');
  const [minPrice, setMinPrice] = useState(currentMin || '');
  const [maxPrice, setMaxPrice] = useState(currentMax || '');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setActiveTab(activeBtn === 'BUY' ? 'List Price' : 'Monthly Payment');
  }, [activeBtn]);

  useEffect(() => {
    if (currentMin) setMinPrice(currentMin);
    if (currentMax) setMaxPrice(currentMax);
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

  const handleApply = () => {
    onApply(minPrice, maxPrice);
    setIsPriceOpen(false);
  };

  const hasActiveFilter = minPrice || maxPrice;

  const priceOptions = activeBtn === 'BUY' ? {
    min: [
      { value: '', label: 'No Min' },
      { value: '1000000', label: '₹10 Lac' },
      { value: '2000000', label: '₹20 Lac' },
      { value: '3000000', label: '₹30 Lac' },
      { value: '4000000', label: '₹40 Lac' },
      { value: '5000000', label: '₹50 Lac' }
    ],
    max: [
      { value: '', label: 'No Max' },
      { value: '5000000', label: '₹50 Lac' },
      { value: '7500000', label: '₹75 Lac' },
      { value: '10000000', label: '₹1 Cr' },
      { value: '15000000', label: '₹1.5 Cr' },
      { value: '20000000', label: '₹2 Cr' }
    ]
  } : {
    min: [
      { value: '', label: 'No Min' },
      { value: '5000', label: '₹5,000' },
      { value: '10000', label: '₹10,000' },
      { value: '15000', label: '₹15,000' },
      { value: '20000', label: '₹20,000' },
      { value: '25000', label: '₹25,000' }
    ],
    max: [
      { value: '', label: 'No Max' },
      { value: '30000', label: '₹30,000' },
      { value: '50000', label: '₹50,000' },
      { value: '75000', label: '₹75,000' },
      { value: '100000', label: '₹1,00,000' },
      { value: '150000', label: '₹1,50,000' }
    ]
  };

  return (
    <div className="price-filter-dropdown" ref={dropdownRef}>
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
          <h3 className="dropdown-title">Price Range</h3>
          
          {activeBtn === 'BUY' && (
            <div className="tab-controls">
              <button 
                className={`tab-btn ${activeTab === 'List Price' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('List Price')}
              >
                List Price
              </button>
              <button 
                className={`tab-btn ${activeTab === 'Monthly Payment' ? 'active-tab' : ''}`}
                onClick={() => setActiveTab('Monthly Payment')}
              >
                Monthly Payment
              </button>
            </div>
          )}
          
          <div className="price-range-inputs">
            <div className="price-field">
              <label>Minimum</label>
              <div className="select-wrapper">
                <select 
                  className="price-select"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                >
                  {priceOptions.min.map(option => (
                    <option key={`min-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="range-separator">–</div>
            
            <div className="price-field">
              <label>Maximum</label>
              <div className="select-wrapper">
                <select 
                  className="price-select"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                >
                  {priceOptions.max.map(option => (
                    <option key={`max-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
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

export default PriceDropdown;