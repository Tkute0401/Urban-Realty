'use client';

import React, { useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Email, LocationOn } from '@mui/icons-material';
import PremiumPaper from './PremiumPaper';
import PropertyMap from './PropertyMap';
import PremiumButton from './PremiumButton';
import ContactModal from '../contact/ContactModal';
import { formatPrice } from '@/lib/utils/format';
import { pulse } from '@/lib/animations';

interface Property {
  _id: string;
  price: number;
  area: number;
  title?: string;
  buildingName?: string;
  projectDetails?: {
    launchDate?: string;
  };
  location?: {
    coordinates: [number, number];
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  agent?: {
    _id: string;
    name: string;
    company?: string;
    avatar?: string;
    email?: string;
    mobile?: string;
  };
}

interface PropertySidebarProps {
  property: Property;
  fullAddress: string;
  isSticky?: boolean;
  headerHeight?: number;
  handleContactOpen?: () => void;
}

const PropertySidebar: React.FC<PropertySidebarProps> = ({ 
  property, 
  fullAddress, 
  isSticky = false, 
  headerHeight = 0, 
  handleContactOpen 
}) => {
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <Box sx={{ 
      position: 'sticky', 
      top: isSticky ? `${headerHeight + 100}px` : '40px',
      transition: 'top 0.3s ease'
    }}>
      {/* Price and Status Card */}
      <PremiumPaper sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-primary)' }}>
          Price Details
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Price
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatPrice(property.price || 0)}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Price per sqft
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatPrice(property.price / property.area)}/sqft
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Possession Status
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
            {property.projectDetails?.launchDate ? 
              `Ready by ${new Date(property.projectDetails.launchDate).toLocaleDateString()}` : 
              'Ready to Move'}
          </Typography>
        </Box>
      </PremiumPaper>

      {/* Contact Agent Card */}
      <PremiumPaper sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: 'var(--color-secondary)' }}>
          Contact Agent
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          p: 3,
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
        }}>
          <Avatar 
            src={property.agent?.avatar}
            sx={{ 
              width: 64, 
              height: 64,
              mr: 3,
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)',
              border: '2px solid var(--color-border)'
            }}
          >
            {property.agent?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {property.agent?.name || 'N/A'}
            </Typography>
            {property.agent?.company && (
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                {property.agent.company}
              </Typography>
            )}
          </Box>
        </Box>
        
        <PremiumButton 
          fullWidth
          size="large"
          onClick={() => setContactModalOpen(true)}
          startIcon={<Email sx={{ fontSize: '1.4rem' }} />}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            '&:hover': {
              animation: `${pulse} 1.5s infinite`
            }
          }}
        >
          Contact Agent
        </PremiumButton>
      </PremiumPaper>

      {/* Location Map */}
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: 'var(--color-primary)' }}>
          Location
        </Typography>
        <Box sx={{ 
          height: 300,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          mb: 2
        }}>
          {(() => {
            console.log('PropertySidebar - Property location data:', {
              hasLocation: !!property.location,
              hasCoordinates: !!(property.location && property.location.coordinates),
              coordinatesLength: property.location?.coordinates?.length,
              coordinates: property.location?.coordinates,
              fullAddress
            });
            return property.location && property.location.coordinates && property.location.coordinates.length === 2;
          })() ? (
            <PropertyMap 
              latitude={property.location.coordinates[1]}
              longitude={property.location.coordinates[0]}
              address={fullAddress}
            />
          ) : (
            <Box sx={{
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px'
            }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Location coordinates not available
              </Typography>
            </Box>
          )}
        </Box>
        <Typography variant="body1" sx={{ 
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-text-primary)'
        }}>
          <LocationOn sx={{ color: 'var(--color-primary)', mr: 1.5 }} />
          {fullAddress}
        </Typography>
      </PremiumPaper>

      {/* Contact Modal */}
      {property.agent && (
        <ContactModal
          open={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          contactType="agent"
          contactInfo={{
            id: property.agent._id,
            name: property.agent.name,
            email: property.agent.email,
            phone: property.agent.mobile,
            avatar: property.agent.avatar,
            company: property.agent.company,
            role: 'Real Estate Agent'
          }}
          propertyInfo={{
            id: property._id,
            title: property.buildingName || property.title,
            price: property.price,
            address: fullAddress
          }}
        />
      )}
    </Box>
  );
};

export default PropertySidebar;
