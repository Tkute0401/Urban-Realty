'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon
} from '@mui/icons-material';
import ContactButton from '../contact/ContactButton';

interface DeveloperContactCardProps {
  developer: {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    logo?: string;
    description?: string;
    establishedYear?: number;
    projectsCompleted?: number;
    specialties?: string[];
  };
  projectInfo?: {
    id: string;
    name: string;
    developer: string;
  };
}

const DeveloperContactCard: React.FC<DeveloperContactCardProps> = ({
  developer,
  projectInfo
}) => {
  const handleDirectContact = (method: 'phone' | 'email' | 'whatsapp') => {
    const message = projectInfo 
      ? `Hi, I'm interested in your project: ${projectInfo.name}`
      : `Hi, I'm interested in your development services.`;

    switch (method) {
      case 'phone':
        if (developer.phone) {
          window.open(`tel:${developer.phone}`);
        }
        break;
      case 'email':
        if (developer.email) {
          window.open(`mailto:${developer.email}?subject=Inquiry&body=${encodeURIComponent(message)}`);
        }
        break;
      case 'whatsapp':
        const phoneNumber = developer.phone?.replace(/\D/g, '');
        if (phoneNumber) {
          window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        }
        break;
    }
  };

  return (
    <Card sx={{ 
      height: '100%',
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Developer Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Avatar
            src={developer.logo}
            sx={{ 
              width: 64, 
              height: 64,
              bgcolor: 'var(--color-primary)',
              color: 'var(--color-text-inverse)'
            }}
          >
            <BusinessIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {developer.name}
            </Typography>
            {developer.establishedYear && (
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Established {developer.establishedYear}
              </Typography>
            )}
            {developer.projectsCompleted && (
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                {developer.projectsCompleted} projects completed
              </Typography>
            )}
          </Box>
        </Box>

        {/* Description */}
        {developer.description && (
          <Typography variant="body2" sx={{ mb: 3, color: 'var(--color-text-secondary)' }}>
            {developer.description}
          </Typography>
        )}

        {/* Specialties */}
        {developer.specialties && developer.specialties.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Specialties
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {developer.specialties.map((specialty, index) => (
                <Chip
                  key={index}
                  label={specialty}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Contact Information */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Contact Information
          </Typography>
          
          <Grid container spacing={2}>
            {developer.email && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <Typography variant="body2">{developer.email}</Typography>
                </Box>
              </Grid>
            )}
            
            {developer.phone && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ color: 'var(--color-success)', fontSize: 20 }} />
                  <Typography variant="body2">{developer.phone}</Typography>
                </Box>
              </Grid>
            )}
            
            {developer.website && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WebsiteIcon sx={{ color: 'var(--color-info)', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => window.open(developer.website, '_blank')}
                  >
                    Visit Website
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {developer.address && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                  <LocationIcon sx={{ color: 'var(--color-text-muted)', fontSize: 20, mt: 0.5 }} />
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    {developer.address}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Contact Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <ContactButton
            contactType="developer"
            contactInfo={{
              id: developer._id,
              name: developer.name,
              email: developer.email,
              phone: developer.phone,
              avatar: developer.logo,
              company: developer.name,
              role: 'Property Developer'
            }}
            projectInfo={projectInfo}
            fullWidth
            size="large"
          />
          
          {/* Direct Contact Options */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {developer.phone && (
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                onClick={() => handleDirectContact('phone')}
                sx={{ 
                  flex: 1,
                  borderColor: 'var(--color-success)',
                  color: 'var(--color-success)',
                  '&:hover': {
                    borderColor: 'var(--color-success-hover)',
                    backgroundColor: 'var(--color-success-hover)20'
                  }
                }}
              >
                Call
              </Button>
            )}
            
            {developer.email && (
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={() => handleDirectContact('email')}
                sx={{ 
                  flex: 1,
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'var(--color-primary-hover)20'
                  }
                }}
              >
                Email
              </Button>
            )}
            
            {developer.phone && (
              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                onClick={() => handleDirectContact('whatsapp')}
                sx={{ 
                  flex: 1,
                  borderColor: 'var(--color-whatsapp)',
                  color: 'var(--color-whatsapp)',
                  '&:hover': {
                    borderColor: 'var(--color-whatsapp-hover)',
                    backgroundColor: 'var(--color-whatsapp-hover)20'
                  }
                }}
              >
                WhatsApp
              </Button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeveloperContactCard;
