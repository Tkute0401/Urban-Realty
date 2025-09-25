'use client'

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Avatar, 
  Divider, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { 
  Phone, 
  Email, 
  WhatsApp, 
  Person,
  Schedule,
  LocationOn
} from '@mui/icons-material';

interface PropertySidebarProps {
  property: any;
}

const PropertySidebar: React.FC<PropertySidebarProps> = ({ property }) => {
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [message, setMessage] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const agent = property.agent || property.listedBy;
  const agentName = agent?.name || 'Property Agent';
  const agentEmail = agent?.email || 'agent@urbanrealty.com';
  const agentPhone = agent?.phone || agent?.mobile || '+91-XXXXXXXXXX';

  const handleContactSubmit = async () => {
    try {
      setContactLoading(true);
      
      // Mock contact submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({
        open: true,
        message: 'Message sent successfully! The agent will contact you soon.',
        severity: 'success'
      });
      
      setContactDialogOpen(false);
      setMessage('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    } finally {
      setContactLoading(false);
    }
  };

  const handlePhoneCall = () => {
    window.open(`tel:${agentPhone}`, '_self');
  };

  const handleWhatsApp = () => {
    const whatsappMessage = encodeURIComponent(
      `Hi, I'm interested in the property: ${property.title || 'Property'}. Price: ${property.price}. Can we discuss more details?`
    );
    window.open(`https://wa.me/${agentPhone.replace(/[^\d]/g, '')}?text=${whatsappMessage}`, '_blank');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`Inquiry about ${property.title || 'Property'}`);
    const body = encodeURIComponent(
      `Hi,\n\nI'm interested in the property:\n${property.title || 'Property'}\nPrice: ${property.price}\n\nPlease provide more details.\n\nThank you.`
    );
    window.open(`mailto:${agentEmail}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <>
      <Paper
        sx={{
          position: 'sticky',
          top: 20,
          p: 3,
          bgcolor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 2
        }}
      >
        {/* Agent Information */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'var(--color-primary)', 
              fontWeight: 600,
              mb: 2
            }}
          >
            Contact Agent
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={agent?.avatar || agent?.profileImage}
              sx={{ 
                width: 50, 
                height: 50,
                border: '2px solid var(--color-primary)'
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'var(--color-text)',
                  fontWeight: 600
                }}
              >
                {agentName}
              </Typography>
              {agent?.role && (
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text-muted)' }}
                >
                  {agent.role}
                </Typography>
              )}
              {agent?.verified && (
                <Chip 
                  label="Verified"
                  size="small"
                  sx={{ 
                    backgroundColor: 'var(--color-success)',
                    color: 'white',
                    mt: 0.5
                  }} 
                />
              )}
            </Box>
          </Box>

          {/* Contact Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="contained"
              startIcon={<Phone />}
              onClick={handlePhoneCall}
              fullWidth
              sx={{
                backgroundColor: 'var(--color-success)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--color-success-hover)'
                }
              }}
            >
              Call Now
            </Button>

            <Button
              variant="contained"
              startIcon={<WhatsApp />}
              onClick={handleWhatsApp}
              fullWidth
              sx={{
                backgroundColor: '#25D366',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#128C7E'
                }
              }}
            >
              WhatsApp
            </Button>

            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleEmailContact}
              fullWidth
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                '&:hover': {
                  borderColor: 'var(--color-primary-hover)',
                  backgroundColor: 'rgba(247, 107, 28, 0.05)'
                }
              }}
            >
              Send Email
            </Button>

            <Button
              variant="outlined"
              onClick={() => setContactDialogOpen(true)}
              fullWidth
              sx={{
                borderColor: 'var(--color-secondary)',
                color: 'var(--color-secondary)',
                '&:hover': {
                  borderColor: 'var(--color-secondary)',
                  backgroundColor: 'rgba(26, 43, 255, 0.05)'
                }
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'var(--color-border)', my: 2 }} />

        {/* Property Quick Info */}
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'var(--color-primary)', 
              fontWeight: 600,
              mb: 2
            }}
          >
            Quick Info
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Property ID:
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                {property._id?.slice(-6) || 'N/A'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Type:
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                {property.type}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Status:
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                {property.status}
              </Typography>
            </Box>

            {property.possessionDate && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                  Possession:
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                  {new Date(property.possessionDate).toLocaleDateString()}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Listed:
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'Recently'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Contact Dialog */}
      <Dialog 
        open={contactDialogOpen} 
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'var(--color-primary)' }}>
          Contact Agent
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', mb: 1 }}>
                Preferred Contact Method:
              </Typography>
              <RadioGroup
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                row
              >
                <FormControlLabel 
                  value="email" 
                  control={<Radio />} 
                  label="Email" 
                />
                <FormControlLabel 
                  value="phone" 
                  control={<Radio />} 
                  label="Phone" 
                />
                <FormControlLabel 
                  value="whatsapp" 
                  control={<Radio />} 
                  label="WhatsApp" 
                />
              </RadioGroup>
            </FormControl>

            <TextField
              multiline
              rows={4}
              fullWidth
              label="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi, I'm interested in ${property.title || 'this property'}. Please provide more details.`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setContactDialogOpen(false)}
            sx={{ color: 'var(--color-text-muted)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleContactSubmit}
            variant="contained"
            disabled={contactLoading}
            sx={{
              backgroundColor: 'var(--color-primary)',
              '&:hover': {
                backgroundColor: 'var(--color-primary-hover)'
              }
            }}
          >
            {contactLoading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PropertySidebar;