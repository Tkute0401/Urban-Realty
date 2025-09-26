import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import http from '../../lib/services/http';

interface EditData {
  name?: string;
  mobile?: string;
  occupation?: string;
  professionalInfo?: {
    licenseNumber?: string;
    yearsOfExperience?: number | string;
    businessName?: string;
    businessAddress?: string;
    specializations?: string[];
    certifications?: string[];
  };
}

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<EditData>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscription();
      setEditData({
        name: user.name || '',
        mobile: user.mobile || '',
        occupation: user.occupation || '',
        professionalInfo: user.professionalInfo || {}
      });
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await http.get('/subscriptions/my-subscription');
      setSubscription(response.data.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load subscription information');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditDialog(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Use normalized API path (baseURL already includes /api/v1)
      await http.put('/auth/update', editData);
      
      // Update local user state
      updateUser({
        name: editData.name,
        mobile: editData.mobile,
        occupation: editData.occupation,
        professionalInfo: editData.professionalInfo
      });
      
      setEditDialog(false);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        await http.put('/subscriptions/cancel');
        fetchSubscription();
        // Refresh user data
        window.location.reload();
      } catch (err) {
        setError('Failed to cancel subscription');
      }
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      buyer: 'Property Buyer',
      agent: 'Real Estate Agent',
      painter: 'Painter',
      interior_designer: 'Interior Designer',
      lawyer: 'Lawyer',
      admin: 'Administrator'
    };
    return roleNames[role] || role;
  };

  const getSubscriptionStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, color: 'var(--color-primary)' }}>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* User Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'var(--color-primary)', mr: 2, width: 56, height: 56 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {user?.name}
                  </Typography>
                  <Chip 
                    label={getRoleDisplayName(user?.role)} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
                
                {/* Role-specific Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {user?.role === 'admin' && (
                    <Button
                      variant="contained"
                      size="small"
                      href="/admin"
                      sx={{ 
                        bgcolor: 'var(--color-primary)', 
                        color: '#0B1011',
                        '&:hover': { 
                          bgcolor: 'var(--color-primary)', 
                          opacity: 0.9 
                        }
                      }}
                    >
                      Admin Panel
                    </Button>
                  )}
                  
                  {user?.role === 'agent' && (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        href="/agent"
                        sx={{ 
                          bgcolor: 'var(--color-primary)', 
                          color: '#0B1011',
                          '&:hover': { 
                            bgcolor: 'var(--color-primary)', 
                            opacity: 0.9 
                          }
                        }}
                      >
                        Agent Dashboard
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        href="/add-property"
                        sx={{ 
                          borderColor: 'var(--color-primary)', 
                          color: 'var(--color-primary)',
                          '&:hover': { 
                            borderColor: 'var(--color-primary)',
                            bgcolor: 'var(--color-primary)',
                            color: '#0B1011'
                          }
                        }}
                      >
                        Add Property
                      </Button>
                    </>
                  )}
                  
                  {user?.role === 'developer' && (
                    <>
                      <Button
                        variant="contained"
                        size="small"
                        href="/developers"
                        sx={{ 
                          bgcolor: 'var(--color-primary)', 
                          color: '#0B1011',
                          '&:hover': { 
                            bgcolor: 'var(--color-primary)', 
                            opacity: 0.9 
                          }
                        }}
                      >
                        Developer Dashboard
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        href="/developers/add"
                        sx={{ 
                          borderColor: 'var(--color-primary)', 
                          color: 'var(--color-primary)',
                          '&:hover': { 
                            borderColor: 'var(--color-primary)',
                            bgcolor: 'var(--color-primary)',
                            color: '#0B1011'
                          }
                        }}
                      >
                        Add Project
                      </Button>
                    </>
                  )}
                </Box>
                
                <Button
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  sx={{ ml: 'auto' }}
                >
                  Edit
                </Button>
              </Box>

              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Email"
                    secondary={user?.email}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Mobile"
                    secondary={user?.mobile || 'Not provided'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Occupation"
                    secondary={user?.occupation || 'Not specified'}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Member Since"
                    secondary={new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Subscription Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />
                Subscription Status
              </Typography>

              {subscription ? (
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {subscription.subscription?.name}
                  </Typography>
                  
                  <Chip 
                    label={subscription.status.toUpperCase()} 
                    color={getSubscriptionStatusColor(subscription.status)}
                    sx={{ mb: 2 }}
                  />
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Billing Cycle"
                        secondary={subscription.billingCycle}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Amount"
                        secondary={`$${subscription.amount} ${subscription.currency}`}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="Start Date"
                        secondary={new Date(subscription.startDate).toLocaleDateString()}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemText 
                        primary="End Date"
                        secondary={new Date(subscription.endDate).toLocaleDateString()}
                      />
                    </ListItem>
                  </List>

                  {subscription.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelSubscription}
                      sx={{ mt: 2 }}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </Box>
              ) : (
                <Box>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No active subscription
                  </Typography>
                  <Chip label="FREE PLAN" color="default" />
                  <Button
                    variant="contained"
                    sx={{ mt: 2, bgcolor: 'var(--color-primary)' }}
                    href="/subscriptions"
                  >
                    View Plans
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Professional Information */}
        {user?.professionalInfo && Object.keys(user.professionalInfo).some(key => user.professionalInfo[key]) && (
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />
                  Professional Information
                </Typography>

                <Grid container spacing={3}>
                  {user.professionalInfo.licenseNumber && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        License Number
                      </Typography>
                      <Typography variant="body1">
                        {user.professionalInfo.licenseNumber}
                      </Typography>
                    </Grid>
                  )}
                  
                  {user.professionalInfo.yearsOfExperience && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Years of Experience
                      </Typography>
                      <Typography variant="body1">
                        {user.professionalInfo.yearsOfExperience} years
                      </Typography>
                    </Grid>
                  )}
                  
                  {user.professionalInfo.businessName && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Business Name
                      </Typography>
                      <Typography variant="body1">
                        {user.professionalInfo.businessName}
                      </Typography>
                    </Grid>
                  )}
                  
                  {user.professionalInfo.businessAddress && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Business Address
                      </Typography>
                      <Typography variant="body1">
                        {user.professionalInfo.businessAddress}
                      </Typography>
                    </Grid>
                  )}
                  
                  {user.professionalInfo.specializations && user.professionalInfo.specializations.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Specializations
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {user.professionalInfo.specializations.map((spec, index) => (
                          <Chip key={index} label={spec} size="small" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                  
                  {user.professionalInfo.certifications && user.professionalInfo.certifications.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Certifications
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {user.professionalInfo.certifications.map((cert, index) => (
                          <Chip key={index} label={cert} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={editData.mobile}
                onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Occupation"
                value={editData.occupation}
                onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
              />
            </Grid>
            
            {/* Professional Info Fields */}
            {['painter', 'interior_designer', 'lawyer', 'agent'].includes(user?.role) && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 2, color: 'var(--color-primary)' }}>
                    Professional Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="License Number"
                    value={editData.professionalInfo?.licenseNumber || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      professionalInfo: {
                        ...editData.professionalInfo,
                        licenseNumber: e.target.value
                      }
                    })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    value={editData.professionalInfo?.yearsOfExperience || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      professionalInfo: {
                        ...editData.professionalInfo,
                        yearsOfExperience: e.target.value
                      }
                    })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={editData.professionalInfo?.businessName || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      professionalInfo: {
                        ...editData.professionalInfo,
                        businessName: e.target.value
                      }
                    })}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Address"
                    value={editData.professionalInfo?.businessAddress || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      professionalInfo: {
                        ...editData.professionalInfo,
                        businessAddress: e.target.value
                      }
                    })}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile;