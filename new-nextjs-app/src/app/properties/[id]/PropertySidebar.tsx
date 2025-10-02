'use client';

import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Avatar, 
  Stack, 
  Divider,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Phone, 
  Email, 
  WhatsApp, 
  Edit, 
  Delete, 
  Share,
  LocationOn,
  CalendarToday
} from '@mui/icons-material';
import { formatPrice } from '@/lib/utils/format';

interface Property {
  _id: string;
  title: string;
  price: number;
  type: string;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    locality: string;
  };
  agent: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
}

interface PropertySidebarProps {
  property: Property;
  onContactClick: () => void;
  onDeleteClick: () => void;
  canEdit: boolean;
  canDelete: boolean;
}

const PropertySidebar = ({ 
  property, 
  onContactClick, 
  onDeleteClick, 
  canEdit, 
  canDelete 
}: PropertySidebarProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in this property: ${property.title}`;
    const url = `https://wa.me/91${property.agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${property.agent.phone}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${property.agent.email}`);
  };

  return (
    <Box sx={{ position: 'sticky', top: 20 }}>
      <Stack spacing={3}>
        {/* Price Card */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
            {formatPrice(property.price)}
          </Typography>
          
          <Chip 
            label={property.status}
            color={property.status === 'For Sale' ? 'success' : 'info'}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {property.type} • {property.address.locality}, {property.address.city}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {property.address.street}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Listed {new Date(property.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onContactClick}
            sx={{ mb: 2 }}
          >
            Contact Agent
          </Button>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              onClick={handleCall}
              sx={{ flex: 1 }}
            >
              Call
            </Button>
            <Button
              variant="outlined"
              startIcon={<WhatsApp />}
              onClick={handleWhatsApp}
              sx={{ flex: 1 }}
            >
              WhatsApp
            </Button>
          </Stack>
        </Paper>

        {/* Agent Card */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Contact Agent
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={property.agent.avatar}
              alt={property.agent.name}
              sx={{ width: 50, height: 50 }}
            >
              {property.agent.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {property.agent.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real Estate Agent
              </Typography>
            </Box>
          </Stack>
          
          <Stack spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              onClick={handleCall}
              fullWidth
            >
              {property.agent.phone}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleEmail}
              fullWidth
            >
              {property.agent.email}
            </Button>
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Actions
          </Typography>
          
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShare}
              fullWidth
            >
              Share Property
            </Button>
            
            {canEdit && (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                fullWidth
                href={`/properties/${property._id}/edit`}
              >
                Edit Property
              </Button>
            )}
            
            {canDelete && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={onDeleteClick}
                fullWidth
              >
                Delete Property
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Property Stats */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Property Stats
          </Typography>
          
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Views
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {property.views}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Listed
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {new Date(property.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default PropertySidebar;
