'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tabs,
  Tab,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Message as MessageIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  contactMethod: z.enum(['email', 'phone', 'whatsapp'], {
    required_error: 'Please select a preferred contact method'
  }),
  reason: z.enum(['inquiry', 'viewing', 'price', 'general', 'other'], {
    required_error: 'Please select a reason for contact'
  }),
  preferredTime: z.string().optional(),
  urgency: z.enum(['low', 'medium', 'high']).default('medium')
});

type ContactFormData = z.infer<typeof contactSchema>;

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
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [sendCopy, setSendCopy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contactMethod: 'email',
      reason: 'inquiry',
      urgency: 'medium'
    }
  });

  const watchedContactMethod = watch('contactMethod');

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      const contactPayload = {
        ...data,
        contactType,
        contactInfo,
        propertyInfo,
        projectInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'web_contact_modal'
      };

      // Send contact request to backend
      const response = await fetch('/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(contactPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to send contact request');
      }

      const result = await response.json();
      
      // Send copy to user if requested
      if (sendCopy) {
        await sendUserCopy(data, contactInfo);
      }

      toast.success('Contact request sent successfully!');
      onSuccess?.(result);
      reset();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send contact request');
      toast.error('Failed to send contact request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendUserCopy = async (data: ContactFormData, contact: any) => {
    try {
      await fetch('/api/v1/contacts/send-copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userEmail: data.email,
          contactData: data,
          contactInfo: contact
        })
      });
    } catch (err) {
      console.error('Failed to send user copy:', err);
    }
  };

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
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Send Message" />
          <Tab label="Direct Contact" />
        </Tabs>

        {activeTab === 0 && (
          <form onSubmit={handleSubmit(onSubmit)}>
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

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Your Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.contactMethod}>
                  <InputLabel>Preferred Contact Method</InputLabel>
                  <Select
                    {...register('contactMethod')}
                    value={watchedContactMethod}
                    onChange={(e) => setValue('contactMethod', e.target.value as any)}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Phone Call</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.reason}>
                  <InputLabel>Reason for Contact</InputLabel>
                  <Select {...register('reason')}>
                    <MenuItem value="inquiry">General Inquiry</MenuItem>
                    <MenuItem value="viewing">Schedule Viewing</MenuItem>
                    <MenuItem value="price">Price Discussion</MenuItem>
                    <MenuItem value="general">General Question</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Urgency Level</InputLabel>
                  <Select {...register('urgency')}>
                    <MenuItem value="low">Low - No Rush</MenuItem>
                    <MenuItem value="medium">Medium - Within a few days</MenuItem>
                    <MenuItem value="high">High - Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  {...register('message')}
                  error={!!errors.message}
                  helperText={errors.message?.message}
                  placeholder="Please provide details about your inquiry..."
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={sendCopy}
                      onChange={(e) => setSendCopy(e.target.checked)}
                    />
                  }
                  label="Send me a copy of this message"
                />
              </Grid>
            </Grid>
          </form>
        )}

        {activeTab === 1 && (
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
                Contact information not available for direct contact. Please use the message form instead.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      {activeTab === 0 && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={onClose}
            disabled={loading}
            sx={{ color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{ 
              bgcolor: 'var(--color-primary)',
              '&:hover': {
                bgcolor: 'var(--color-primary-hover)',
              }
            }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ContactModal;
