import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, TextField, RadioGroup, FormControlLabel, Radio, FormControl, Typography } from '@mui/material';
import { Phone, WhatsApp, Email } from '@mui/icons-material';
import PremiumButton from './PremiumButton';
import { CircularProgress } from '@mui/material';

const ContactDialog = ({
  open,
  onClose,
  contactMethod,
  setContactMethod,
  message,
  setMessage,
  contactLoading,
  contactSuccess,
  handleContactSubmit
}) => {
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
        {!contactSuccess && (
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