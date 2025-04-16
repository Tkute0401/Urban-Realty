import React, { useState, useEffect, useRef } from 'react';
import './PriceDropdown.css';

const PriceDropdown = ({ activeBtn = 'BUY' }) => {
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('List Price');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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

  // Reset tab when switching between Buy and Rent
  useEffect(() => {
    setActiveTab(activeBtn === 'BUY' ? 'List Price' : 'Monthly Payment');
  }, [activeBtn]);

  return (
    <div className="price-filter-dropdown" ref={dropdownRef}>
      <button 
        id="PriceBtn" 
        className={`btn-animate ${isPriceOpen ? 'active-dropdown' : ''}`}
        onClick={togglePriceDropdown}
        style={{
          padding: '10px 15px',
          backgroundColor: '#0B1011',
          color: 'white',
          border: '1px solid #78CADC',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        PRICE {isPriceOpen ? '▲' : '▼'}
      </button>
      
      {isPriceOpen && (
        <div className="price-dropdown-content fade-in">
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
                <select className="price-select">
                  <option>No Min</option>
                  {activeBtn === 'BUY' ? (
                    <>
                      <option>₹10 Lac</option>
                      <option>₹20 Lac</option>
                      <option>₹30 Lac</option>
                      <option>₹40 Lac</option>
                      <option>₹50 Lac</option>
                    </>
                  ) : (
                    <>
                      <option>₹5,000</option>
                      <option>₹10,000</option>
                      <option>₹15,000</option>
                      <option>₹20,000</option>
                      <option>₹25,000</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            
            <div className="range-separator">–</div>
            
            <div className="price-field">
              <label>Maximum</label>
              <div className="select-wrapper">
                <select className="price-select">
                  <option>No Max</option>
                  {activeBtn === 'BUY' ? (
                    <>
                      <option>₹50 Lac</option>
                      <option>₹75 Lac</option>
                      <option>₹1 Cr</option>
                      <option>₹1.5 Cr</option>
                      <option>₹2 Cr</option>
                    </>
                  ) : (
                    <>
                      <option>₹30,000</option>
                      <option>₹50,000</option>
                      <option>₹75,000</option>
                      <option>₹1,00,000</option>
                      <option>₹1,50,000</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
          
          <button className="apply-btn">Apply</button>
        </div>
      )}
    </div>
  );
};

export default PriceDropdown;