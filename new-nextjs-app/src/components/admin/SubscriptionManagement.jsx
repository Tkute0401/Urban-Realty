import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from '@/lib/services/axios';

const SubscriptionManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planDialog, setPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [subscriptionDialog, setSubscriptionDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  
  // Plan form state
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    type: 'basic',
    features: {
      propertyListings: 0,
      advancedSearch: false,
      prioritySupport: false,
      analytics: false,
      customBranding: false,
      apiAccess: false
    },
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plansRes, subscriptionsRes] = await Promise.all([
        axios.get('/admin/subscription-plans'),
        axios.get('/admin/subscriptions')
      ]);
      
      if (plansRes.data.success) {
        setPlans(plansRes.data.data);
      }
      
      if (subscriptionsRes.data.success) {
        setSubscriptions(subscriptionsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSubmit = async () => {
    try {
      if (editingPlan) {
        await axios.put(`/admin/subscription-plans/${editingPlan._id}`, planForm);
      } else {
        await axios.post('/admin/subscription-plans', planForm);
      }
      
      setPlanDialog(false);
      setEditingPlan(null);
      resetPlanForm();
      fetchData();
    } catch (err) {
      setError('Failed to save plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await axios.delete(`/admin/subscription-plans/${planId}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete plan');
      }
    }
  };

  const handleUpdateSubscriptionStatus = async (subscriptionId, status) => {
    try {
      await axios.put(`/admin/subscriptions/${subscriptionId}/status`, { status });
      fetchData();
    } catch (err) {
      setError('Failed to update subscription status');
    }
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: '',
      description: '',
      price: '',
      billingCycle: 'monthly',
      type: 'basic',
      features: {
        propertyListings: 0,
        advancedSearch: false,
        prioritySupport: false,
        analytics: false,
        customBranding: false,
        apiAccess: false
      },
      isActive: true
    });
  };

  const openEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description,
      price: plan.price,
      billingCycle: plan.billingCycle,
      type: plan.type,
      features: plan.features,
      isActive: plan.isActive
    });
    setPlanDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'expired': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon color="success" />;
      case 'cancelled': return <CancelIcon color="error" />;
      case 'expired': return <WarningIcon color="warning" />;
      case 'pending': return <WarningIcon color="info" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: '#78CADC' }}>
          Subscription Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setPlanDialog(true)}
          sx={{ bgcolor: '#78CADC' }}
        >
          Add New Plan
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Subscription Plans" />
          <Tab label="All Subscriptions" />
        </Tabs>
      </Box>

      {/* Subscription Plans Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {plan.name}
                      </Typography>
                      <Chip 
                        label={plan.type.toUpperCase()} 
                        color="primary" 
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      {!plan.isActive && (
                        <Chip label="INACTIVE" color="error" size="small" sx={{ ml: 1 }} />
                      )}
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => openEditPlan(plan)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeletePlan(plan._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {plan.description}
                  </Typography>
                  
                  <Typography variant="h5" color="primary" gutterBottom>
                    ${plan.price}/{plan.billingCycle}
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {plan.features.propertyListings > 0 && (
                        <Chip label={`${plan.features.propertyListings} Listings`} size="small" />
                      )}
                      {plan.features.advancedSearch && (
                        <Chip label="Advanced Search" size="small" />
                      )}
                      {plan.features.prioritySupport && (
                        <Chip label="Priority Support" size="small" />
                      )}
                      {plan.features.analytics && (
                        <Chip label="Analytics" size="small" />
                      )}
                      {plan.features.customBranding && (
                        <Chip label="Custom Branding" size="small" />
                      )}
                      {plan.features.apiAccess && (
                        <Chip label="API Access" size="small" />
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* All Subscriptions Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {subscription.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subscription.user?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={subscription.plan?.name || 'Unknown Plan'} 
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        ${subscription.amount} {subscription.currency}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={subscription.status} 
                          color={getStatusColor(subscription.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small"
                            onClick={() => {
                              setSelectedSubscription(subscription);
                              setSubscriptionDialog(true);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {subscription.status === 'active' && (
                          <Tooltip title="Suspend Subscription">
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => handleUpdateSubscriptionStatus(subscription._id, 'suspended')}
                            >
                              <BlockIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {subscription.status === 'suspended' && (
                          <Tooltip title="Activate Subscription">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleUpdateSubscriptionStatus(subscription._id, 'active')}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Plan Dialog */}
      <Dialog open={planDialog} onClose={() => setPlanDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPlan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Plan Name"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Plan Type"
                select
                value={planForm.type}
                onChange={(e) => setPlanForm({ ...planForm, type: e.target.value })}
              >
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="basic">Basic</MenuItem>
                <MenuItem value="premium">Premium</MenuItem>
                <MenuItem value="enterprise">Enterprise</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Billing Cycle"
                select
                value={planForm.billingCycle}
                onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={planForm.description}
                onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Features</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Property Listings Limit"
                    type="number"
                    value={planForm.features.propertyListings}
                    onChange={(e) => setPlanForm({
                      ...planForm,
                      features: {
                        ...planForm.features,
                        propertyListings: parseInt(e.target.value) || 0
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={planForm.features.advancedSearch}
                        onChange={(e) => setPlanForm({
                          ...planForm,
                          features: {
                            ...planForm.features,
                            advancedSearch: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Advanced Search"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={planForm.features.prioritySupport}
                        onChange={(e) => setPlanForm({
                          ...planForm,
                          features: {
                            ...planForm.features,
                            prioritySupport: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Priority Support"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={planForm.features.analytics}
                        onChange={(e) => setPlanForm({
                          ...planForm,
                          features: {
                            ...planForm.features,
                            analytics: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Analytics & Insights"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={planForm.features.customBranding}
                        onChange={(e) => setPlanForm({
                          ...planForm,
                          features: {
                            ...planForm.features,
                            customBranding: e.target.checked
                          }
                        })}
                      />
                    }
                    label="Custom Branding"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={planForm.features.apiAccess}
                        onChange={(e) => setPlanForm({
                          ...planForm,
                          features: {
                            ...planForm.features,
                            apiAccess: e.target.checked
                          }
                        })}
                      />
                    }
                    label="API Access"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={planForm.isActive}
                    onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })}
                  />
                }
                label="Active Plan"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setPlanDialog(false);
            setEditingPlan(null);
            resetPlanForm();
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handlePlanSubmit}
            variant="contained"
            disabled={!planForm.name || !planForm.price}
          >
            {editingPlan ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subscription Details Dialog */}
      <Dialog open={subscriptionDialog} onClose={() => setSubscriptionDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Subscription Details</DialogTitle>
        <DialogContent>
          {selectedSubscription && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">User</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSubscription.user?.name || 'Unknown User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedSubscription.user?.email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Plan</Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedSubscription.plan?.name || 'Unknown Plan'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedSubscription.plan?.type}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                <Typography variant="body1" gutterBottom>
                  ${selectedSubscription.amount} {selectedSubscription.currency}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedSubscription.billingCycle}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={selectedSubscription.status} 
                  color={getStatusColor(selectedSubscription.status)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(selectedSubscription.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedSubscription.startDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedSubscription.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubscriptionDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionManagement;