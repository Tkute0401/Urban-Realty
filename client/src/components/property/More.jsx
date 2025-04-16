import React, { useState, useEffect, useRef } from 'react';
import './BedBath.css';

const More = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('type');
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

  // Add viewport edge detection
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      if (dropdownContent) {
        const rect = dropdownContent.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Check if dropdown goes off right edge
        if (rect.right > viewportWidth) {
          dropdownContent.style.left = 'auto';
          dropdownContent.style.right = '0';
        }
      }
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleApply = () => {
    // Here you would handle applying the filter
    setIsOpen(false);
  };

  return (
    <div className="filter-dropdown more-dropdown" ref={dropdownRef}>
      <button 
        className={`filter-btn ${isOpen ? 'active-dropdown' : ''}`}
        onClick={toggleDropdown}
      >
        More {isOpen ? '▲' : '▼'}
      </button>
      
      {isOpen && (
        <div className="dropdown-content more-content fade-in">
          <div className="more-sidebar">
            <div 
              className={`sidebar-item ${activeSection === 'type' ? 'active-sidebar' : ''}`}
              onClick={() => setActiveSection('type')}
            >
              Type of property
            </div>
            <div 
              className={`sidebar-item ${activeSection === 'construction' ? 'active-sidebar' : ''}`}
              onClick={() => setActiveSection('construction')}
            >
              Construction Status
            </div>
            <div 
              className={`sidebar-item ${activeSection === 'posted' ? 'active-sidebar' : ''}`}
              onClick={() => setActiveSection('posted')}
            >
              Posted by
            </div>
            <div 
              className={`sidebar-item ${activeSection === 'amenities' ? 'active-sidebar' : ''}`}
              onClick={() => setActiveSection('amenities')}
            >
              Amenities
            </div>
            <div 
              className={`sidebar-item ${activeSection === 'furnishing' ? 'active-sidebar' : ''}`}
              onClick={() => setActiveSection('furnishing')}
            >
              Furnishing status
            </div>
          </div>
          
          <div className="more-content-area">
            {activeSection === 'type' && (
              <div className="filter-section">
                <h3 className="section-title">Type of property</h3>
                <div className="tag-options">
                  <button className="tag-option">+ Residential Apartment</button>
                  <button className="tag-option">+ Residential Land</button>
                  <button className="tag-option">+ Independent House/Villa</button>
                  <button className="tag-option">+ Independent/Builder Floor</button>
                  <button className="tag-option">+ Farm House</button>
                  <button className="tag-option">+ 1 RK/ Studio Apartment</button>
                </div>
              </div>
            )}
            
            {activeSection === 'construction' && (
              <div className="filter-section">
                <h3 className="section-title">Construction Status</h3>
                <div className="tag-options">
                  <button className="tag-option">+ New Launch</button>
                  <button className="tag-option">+ Under Construction</button>
                  <button className="tag-option">+ Ready to move</button>
                </div>
              </div>
            )}
            
            {activeSection === 'posted' && (
              <div className="filter-section">
                <h3 className="section-title">Posted by</h3>
                <div className="tag-options">
                  <button className="tag-option">+ Owner</button>
                  <button className="tag-option">+ Builder</button>
                  <button className="tag-option">+ Dealer</button>
                  <button className="tag-option">+ Feature Dealer</button>
                </div>
              </div>
            )}
            
            {activeSection === 'amenities' && (
              <div className="filter-section">
                <h3 className="section-title">Amenities</h3>
                <div className="tag-options">
                  <button className="tag-option">+ Parking</button>
                  <button className="tag-option">+ Park</button>
                  <button className="tag-option">+ Power Backup</button>
                  <button className="tag-option">+ Vaastu Compliant</button>
                  <button className="tag-option">+ Gymnasium</button>
                  <button className="tag-option">+ Club house</button>
                  <button className="tag-option">+ Lift</button>
                  <button className="tag-option">+ Swimming Pool</button>
                  <button className="tag-option">+ Gas Pipeline</button>
                  <button className="tag-option">+ Security Personnel</button>
                </div>
              </div>
            )}
            
            {activeSection === 'furnishing' && (
              <div className="filter-section">
                <h3 className="section-title">Furnishing status</h3>
                <div className="tag-options">
                  <button className="tag-option">+ Semifurnished</button>
                  <button className="tag-option">+ Unfurnished</button>
                  <button className="tag-option">+ Furnished</button>
                </div>
              </div>
            )}
          </div>
          
          <button className="apply-filter-btn" onClick={handleApply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default More;