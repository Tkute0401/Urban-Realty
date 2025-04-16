import { Box, Typography, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getImageUrl = (img) => {
    try {
      if (!img) return null;
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && img.url) return img.url;
      return null;
    } catch (error) {
      console.error('Error parsing image URL:', error);
      return null;
    }
  };

  const getPrimaryImage = () => {
    if (imageError) return '/default-property.jpg';
    
    if (!property?.images || !Array.isArray(property.images) || property.images.length === 0) {
      return '/default-property.jpg';
    }

    const primaryImg = property.images.find(img => img.isPrimary) || property.images[0];
    return getImageUrl(primaryImg) || '/default-property.jpg';
  };

  const primaryImage = getPrimaryImage();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    if (property?._id) {
      navigate(`/properties/${property._id}`);
    }
  };

  const getAddressComponent = (component) => {
    if (!property?.address) return '';
    if (typeof property.address === 'string') return property.address;
    return property.address[component] || '';
  };

  const city = getAddressComponent('city');
  const state = getAddressComponent('state');
  const locationText = city && state ? `${city}, ${state}` : city || state || 'Location not specified';

  return (
    <div
      className="property-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{
        backgroundColor: '#0B1011',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #333',
        transition: 'all 0.3s ease',
        height: 'auto',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 20px rgba(0, 0, 0, 0.3)' : 'none',
        borderColor: isHovered ? '#78CADC' : '#333'
      }}
    >
      <div className="property-image-container" style={{ 
        position: 'relative',
        height: isMobile ? '180px' : '200px',
        overflow: 'hidden'
      }}>
        <img 
          src={primaryImage} 
          alt={property?.title || 'Property image'} 
          className="property-image" 
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        <div className="property-image-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="property-image-actions" style={{ display: 'flex', gap: '10px' }}>
            <button className="image-action-btn" style={{
              backgroundColor: 'rgba(120, 202, 220, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#08171A',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
              opacity: isHovered ? 1 : 0
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 19c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"></path>
                <path d="m21 21-4.3-4.3"></path>
                <path d="M8 11h6"></path>
                <path d="M11 8v6"></path>
              </svg>
            </button>
            <button className="image-action-btn" style={{
              backgroundColor: 'rgba(120, 202, 220, 0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#08171A',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
              opacity: isHovered ? 1 : 0,
              transitionDelay: '0.1s'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="m21 15-5-5L5 21"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="property-details" style={{ padding: '1rem' }}>
        <div className="property-price" style={{ 
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#78CADC',
          marginBottom: '0.5rem'
        }}>
          {formatPrice(property?.price || 0)}
        </div>
        <div className="property-specs" style={{ 
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.75rem',
          color: '#ccc',
          fontSize: '0.9rem'
        }}>
          <div className="property-spec">
            {property?.area ? `${property.area.toLocaleString()} Sqft` : 'N/A'}
          </div>
          <div className="property-spec-divider" style={{ margin: '0 0.5rem', color: '#555' }}>|</div>
          <div className="property-spec">
            {property?.bedrooms || 'N/A'} Bed
          </div>
          <div className="property-spec-divider" style={{ margin: '0 0.5rem', color: '#555' }}>|</div>
          <div className="property-spec">
            {property?.bathrooms || 'N/A'} Bath
          </div>
        </div>
        <Tooltip title={locationText} arrow>
          <div className="property-location" style={{ 
            fontSize: '0.9rem',
            color: '#aaa',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {locationText}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default PropertyCard;