import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, TextField, RadioGroup, FormControlLabel, Radio, FormControl, Typography } from '@mui/material';
import { Phone, WhatsApp, Email } from '@mui/icons-material';
import PremiumButton from './PremiumButton';
import { CircularProgress } from '@mui/material';
import axios from '../../services/axios';
import { toast } from 'react-toastify';

const ContactDialog = ({
  open,
  onClose,
  contactMethod,
  setContactMethod,
  message,
  setMessage,
  contactLoading,
  setContactLoading,
  contactSuccess,
  setContactSuccess,
  property,
  user
}) => {
  const handleContactSubmit = async () => {
    if (!property || !property._id) {
      toast.error('Property information is missing');
      return;
    }

    if ((contactMethod === 'email' || contactMethod === 'whatsapp') && !message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setContactLoading(true);
      const response = await axios.post(`/properties/${property._id}/contact`, {
        contactMethod,
        message
      });

      
      
      // Handle different contact methods
      if (contactMethod === 'whatsapp') {
        // Open WhatsApp with the message
        const phoneNumber = property.agent?.mobile || property.agent?.phone;
        if (phoneNumber) {
          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
          console.log('WhatsApp URL:', whatsappUrl);
          window.open(whatsappUrl, '_blank');
        }
      } else if (contactMethod === 'phone') {
        // Initiate phone call
        const phoneNumber = property.agent?.mobile || property.agent?.phone;
        if (phoneNumber) {
          window.open(`tel:${phoneNumber}`);
        }
      }
      setContactSuccess(true);
      
      toast.success('Contact request sent successfully!');
    } catch (err) {
      console.error('Error sending contact request:', err);
      toast.error(err.response?.data?.message || 'Failed to send contact request');
    } finally {
      setContactLoading(false);
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
          backgroundColor: '#0B1011',
          color: '#fff',
          borderRadius: '16px',
          border: '2px solid #78CADC',
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#78CADC', 
        fontFamily: '"Poppins", sans-serif',
        fontWeight: 700,
        fontSize: '1.4rem',
        borderBottom: '1px solid rgba(120, 202, 220, 0.3)',
        py: 3
      }}>
        Contact Agent
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        {contactSuccess ? (
          <Alert severity="success" sx={{ 
            mb: 3,
            backgroundColor: 'rgba(46, 125, 50, 0.2)',
            border: '1px solid rgba(46, 125, 50, 0.5)'
          }}>
            Your contact request has been sent successfully!
          </Alert>
        ) : !user ? (
          <Alert severity="warning" sx={{ 
            mb: 3,
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            border: '1px solid rgba(255, 152, 0, 0.5)'
          }}>
            Please login to contact the agent.
          </Alert>
        ) : (
          <>
            <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
              <RadioGroup
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                row
                sx={{ justifyContent: 'space-between', gap: 2 }}
              >
                <FormControlLabel 
                  value="email" 
                  control={<Radio sx={{ 
                    color: '#78CADC',
                    '&.Mui-checked': {
                      color: '#78CADC'
                    }
                  }} />} 
                  label={<Typography sx={{ 
                    color: '#fff', 
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500
                  }}>Email</Typography>} 
                />
                <FormControlLabel 
                  value="whatsapp" 
                  control={<Radio sx={{ 
                    color: '#78CADC',
                    '&.Mui-checked': {
                      color: '#78CADC'
                    }
                  }} />} 
                  label={<Typography sx={{ 
                    color: '#fff', 
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500
                  }}>WhatsApp</Typography>} 
                />
                <FormControlLabel 
                  value="phone" 
                  control={<Radio sx={{ 
                    color: '#78CADC',
                    '&.Mui-checked': {
                      color: '#78CADC'
                    }
                  }} />} 
                  label={<Typography sx={{ 
                    color: '#fff', 
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500
                  }}>Phone Call</Typography>} 
                />
              </RadioGroup>
            </FormControl>

            {(contactMethod === 'email' || contactMethod === 'whatsapp') && (
              <TextField
                fullWidth
                multiline
                rows={8}
                label={contactMethod === 'whatsapp' ? 'WhatsApp Message' : 'Email Content'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  style: {
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: '#fff',
                    fontFamily: '"Poppins", sans-serif',
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    borderRadius: '8px',
                    padding: '12px'
                  }
                }}
                InputLabelProps={{
                  style: {
                    color: '#78CADC',
                    fontFamily: '"Poppins", sans-serif',
                    fontWeight: 500,
                    fontSize: '1rem'
                  }
                }}
              />
            )}

            {contactMethod === 'phone' && (
              <Alert severity="info" sx={{ 
                mb: 3,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                Clicking "Send Request" will initiate a phone call to the agent and create a contact record.
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: '1px solid rgba(120, 202, 220, 0.3)'
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#78CADC', 
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(120, 202, 220, 0.1)'
            }
          }}
        >
          {contactSuccess ? 'Close' : 'Cancel'}
        </Button>
        {!contactSuccess && user && (
          <PremiumButton 
            onClick={handleContactSubmit} 
            disabled={contactLoading || ((contactMethod === 'email' || contactMethod === 'whatsapp') && !message.trim())}
            startIcon={contactLoading ? <CircularProgress size={20} sx={{ color: '#0B1011' }} /> : null}
            sx={{
              minWidth: '180px'
            }}
          >
            {contactMethod === 'phone' ? 'Call Agent' : 
            contactMethod === 'whatsapp' ? 'Open WhatsApp' : 
            contactMethod === 'email' ? 'Send Email' : 'Send Message'}
          </PremiumButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ContactDialog;