'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
  contactType: 'agent' | 'developer' | 'general';
  contactInfo: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
    company?: string;
    role?: string;
  };
  propertyInfo?: {
    id: string;
    title: string;
    price: number;
    address?: string;
  };
  projectInfo?: {
    id: string;
    name: string;
    developer: string;
  };
}

const ContactModal: React.FC<ContactModalProps> = ({
  open,
  onClose,
  onSuccess,
  contactType,
  contactInfo,
  propertyInfo,
  projectInfo
}) => {

  const handleDirectContact = (method: 'phone' | 'email' | 'whatsapp') => {
    if (!contactInfo) return;

    const message = propertyInfo 
      ? `Hi, I'm interested in your property: ${propertyInfo.title}`
      : projectInfo
      ? `Hi, I'm interested in your project: ${projectInfo.name}`
      : 'Hi, I would like to get in touch with you.';

    switch (method) {
      case 'phone':
        if (contactInfo.phone) {
          window.open(`tel:${contactInfo.phone}`);
        } else {
          toast.error('Phone number not available');
        }
        break;
      case 'email':
        if (contactInfo.email) {
          window.open(`mailto:${contactInfo.email}?subject=Inquiry&body=${encodeURIComponent(message)}`);
        } else {
          toast.error('Email not available');
        }
        break;
      case 'whatsapp':
        const phoneNumber = contactInfo.phone?.replace(/\D/g, '');
        if (phoneNumber) {
          window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        } else {
          toast.error('Phone number not available for WhatsApp');
        }
        break;
    }
  };

  const getContactTypeLabel = () => {
    switch (contactType) {
      case 'agent': return 'Real Estate Agent';
      case 'developer': return 'Property Developer';
      default: return 'Contact';
    }
  };

  const getContactTypeIcon = () => {
    switch (contactType) {
      case 'agent': return <PersonIcon />;
      case 'developer': return <BusinessIcon />;
      default: return <MessageIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(30, 30, 45, 0.98)' 
              : 'rgba(255, 255, 255, 0.98)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getContactTypeIcon()}
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            Contact {getContactTypeLabel()}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Contact Info Card */}
        <Card sx={{ mb: 3, bgcolor: 'var(--color-bg-primary)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar 
                src={contactInfo.avatar}
                sx={{ 
                  width: 56, 
                  height: 56,
                  bgcolor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)'
                }}
              >
                {contactInfo.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {contactInfo.name}
                </Typography>
                {contactInfo.company && (
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    {contactInfo.company}
                  </Typography>
                )}
                {contactInfo.role && (
                  <Chip 
                    label={contactInfo.role} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>
            </Box>

            {(propertyInfo || projectInfo) && (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'var(--color-bg-secondary)', 
                borderRadius: '8px',
                border: '1px solid var(--color-border)'
              }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {propertyInfo ? 'Property Details' : 'Project Details'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                  {propertyInfo ? propertyInfo.title : projectInfo?.name}
                </Typography>
                {propertyInfo?.price && (
                  <Typography variant="body2" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    ₹{propertyInfo.price.toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
            Direct Contact Options
          </Typography>
          
          <Grid container spacing={2}>
            {contactInfo.phone && (
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  onClick={() => handleDirectContact('phone')}
                  sx={{
                    py: 2,
                    backgroundColor: 'var(--color-success)',
                    '&:hover': {
                      backgroundColor: 'var(--color-success-hover)'
                    }
                  }}
                >
                  Call Now
                </Button>
              </Grid>
            )}
            
            {contactInfo.email && (
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={() => handleDirectContact('email')}
                  sx={{
                    py: 2,
                    backgroundColor: 'var(--color-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-hover)'
                    }
                  }}
                >
                  Send Email
                </Button>
              </Grid>
            )}
            
            {contactInfo.phone && (
              <Grid item xs={12} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={() => handleDirectContact('whatsapp')}
                  sx={{
                    py: 2,
                    backgroundColor: 'var(--color-whatsapp)',
                    '&:hover': {
                      backgroundColor: 'var(--color-whatsapp-hover)'
                    }
                  }}
                >
                  WhatsApp
                </Button>
              </Grid>
            )}
          </Grid>

          {(!contactInfo.phone && !contactInfo.email) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Contact information not available for direct contact.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogContent sx={{ pt: 0, pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            onClick={onClose}
            sx={{ color: 'var(--color-text-secondary)' }}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
