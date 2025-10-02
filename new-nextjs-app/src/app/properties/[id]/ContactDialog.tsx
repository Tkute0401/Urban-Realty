'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider
} from '@mui/material';
import { useState } from 'react';

interface Property {
  title: string;
  agent: {
    name: string;
    email: string;
    phone: string;
  };
}

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  contactForm: {
    name: string;
    email: string;
    phone: string;
    message: string;
    inquiryType: string;
  };
  setContactForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  property: Property;
}

const ContactDialog = ({
  open,
  onClose,
  contactForm,
  setContactForm,
  onSubmit,
  property
}: ContactDialogProps) => {
  const handleInputChange = (field: string) => (event: any) => {
    setContactForm({
      ...contactForm,
      [field]: event.target.value
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Contact Agent
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Send an inquiry about "{property.title}"
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Your Name"
              value={contactForm.name}
              onChange={handleInputChange('name')}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={contactForm.email}
              onChange={handleInputChange('email')}
              required
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={contactForm.phone}
              onChange={handleInputChange('phone')}
              variant="outlined"
            />
            <FormControl fullWidth>
              <InputLabel>Inquiry Type</InputLabel>
              <Select
                value={contactForm.inquiryType}
                onChange={handleInputChange('inquiryType')}
                label="Inquiry Type"
              >
                <MenuItem value="general">General Inquiry</MenuItem>
                <MenuItem value="viewing">Schedule Viewing</MenuItem>
                <MenuItem value="price">Price Negotiation</MenuItem>
                <MenuItem value="financing">Financing Options</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <TextField
            fullWidth
            label="Message"
            multiline
            rows={4}
            value={contactForm.message}
            onChange={handleInputChange('message')}
            placeholder="Tell the agent about your requirements and any specific questions you have..."
            variant="outlined"
          />
          
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Agent Details:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {property.agent.name} • {property.agent.email} • {property.agent.phone}
            </Typography>
          </Box>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Send Inquiry
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactDialog;
