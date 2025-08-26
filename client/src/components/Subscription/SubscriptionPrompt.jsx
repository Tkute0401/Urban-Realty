import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPrompt = ({ 
  open, 
  onClose, 
  feature, 
  requiredPlan, 
  currentPlan = 'free',
  plans = [],
  onUpgrade 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const planFeatures = {
    free: [
      'Browse properties',
      'Basic search',
      'Contact agents (limited)',
      'View property details'
    ],
    basic: [
      'All Free features',
      'Advanced search filters',
      'Unlimited contact requests',
      'Property alerts',
      'Saved searches',
      '5 property listings',
      'Professional services access',
      'Neighborhood insights',
      'School ratings',
      'Transportation data',
      'Walkability scores',
      'Property history',
      'HOA information',
      'Utility information',
      'Basic calculators'
    ],
    premium: [
      'All Basic features',
      '25 property listings',
      'Priority support',
      'Analytics & insights',
      'Market insights',
      'Comparative market analysis',
      'Investment analysis',
      'Property valuation tools',
      'Document management',
      'Commission tracking',
      'Performance analytics',
      'Marketing tools',
      'Social media integration',
      'Email marketing',
      'Virtual tour features',
      'Drone photography',
      'Professional photography',
      'Staging services',
      'Home inspection services',
      'Legal services',
      'Insurance services',
      'Financing services',
      'Security services',
      'Smart home features',
      'Energy efficiency tools',
      'Sustainability features',
      'Crime statistics',
      'Air quality data',
      'Flood risk data',
      'Earthquake risk data',
      'Tax information',
      'Permit information',
      'Zoning information',
      'Development plans',
      'Market trends',
      'Investment opportunities',
      'Rental yield analysis',
      'ROI calculations',
      'Cash flow analysis',
      'Advanced cost estimators'
    ],
    enterprise: [
      'All Premium features',
      '100 property listings',
      'Custom branding',
      'API access',
      'Multi-user support',
      'Advanced analytics',
      'White-label features',
      'Integration features',
      'Workflow automation',
      'Customer relationship management',
      'SMS marketing',
      '3D property visualization',
      'E-signature features',
      'Transaction management',
      'Team management',
      'Bulk operations',
      'Import features',
      'Price predictions'
    ]
  };

  const planColors = {
    free: 'default',
    basic: 'primary',
    premium: 'secondary',
    enterprise: 'success'
  };

  const planPrices = {
    free: '$0',
    basic: '$9.99/month',
    premium: '$29.99/month',
    enterprise: '$99.99/month'
  };

  const handleUpgrade = () => {
    if (selectedPlan) {
      if (onUpgrade) {
        onUpgrade(selectedPlan);
      } else {
        navigate('/subscriptions');
      }
    } else {
      navigate('/subscriptions');
    }
    onClose();
  };

  const getCurrentPlanIndex = () => {
    const planOrder = ['free', 'basic', 'premium', 'enterprise'];
    return planOrder.indexOf(currentPlan);
  };

  const getRequiredPlanIndex = () => {
    const planOrder = ['free', 'basic', 'premium', 'enterprise'];
    return planOrder.indexOf(requiredPlan);
  };

  const canUpgrade = getCurrentPlanIndex() < getRequiredPlanIndex();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <LockIcon color="warning" />
          <Typography variant="h6">
            Upgrade Required
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>{feature}</strong> requires a <strong>{requiredPlan}</strong> subscription or higher.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Your current plan: <Chip label={currentPlan} color={planColors[currentPlan]} size="small" />
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom>
          Available Plans
        </Typography>

        <Grid container spacing={2}>
          {['free', 'basic', 'premium', 'enterprise'].map((plan) => {
            const isCurrentPlan = plan === currentPlan;
            const isRequiredPlan = plan === requiredPlan;
            const isHigherPlan = getCurrentPlanIndex() < ['free', 'basic', 'premium', 'enterprise'].indexOf(plan);
            
            return (
              <Grid item xs={12} sm={6} md={3} key={plan}>
                <Card 
                  variant={isCurrentPlan ? "outlined" : "elevation"}
                  sx={{
                    height: '100%',
                    cursor: isHigherPlan ? 'pointer' : 'default',
                    border: isCurrentPlan ? 2 : 1,
                    borderColor: isCurrentPlan ? 'primary.main' : 'divider',
                    position: 'relative',
                    '&:hover': isHigherPlan ? {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    } : {}
                  }}
                  onClick={() => isHigherPlan && setSelectedPlan(plan)}
                >
                  {isCurrentPlan && (
                    <Chip
                      label="Current Plan"
                      color="primary"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    />
                  )}
                  
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="h6" component="div">
                        {plan.charAt(0).toUpperCase() + plan.slice(1)}
                      </Typography>
                      {plan === 'premium' && <StarIcon color="secondary" />}
                      {plan === 'enterprise' && <StarIcon color="success" />}
                    </Box>
                    
                    <Typography variant="h4" color="primary" gutterBottom>
                      {planPrices[plan]}
                    </Typography>

                    <List dense>
                      {planFeatures[plan].slice(0, 5).map((feature, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <CheckIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                      {planFeatures[plan].length > 5 && (
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={`+${planFeatures[plan].length - 5} more features`}
                            primaryTypographyProps={{ 
                              variant: 'body2', 
                              color: 'text.secondary',
                              fontStyle: 'italic'
                            }}
                          />
                        </ListItem>
                      )}
                    </List>

                    {isHigherPlan && (
                      <Button
                        variant="contained"
                        color={selectedPlan === plan ? "secondary" : "primary"}
                        fullWidth
                        startIcon={<UpgradeIcon />}
                        sx={{ mt: 2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan(plan);
                        }}
                      >
                        {selectedPlan === plan ? 'Selected' : 'Upgrade'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {selectedPlan && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              You've selected the <strong>{selectedPlan}</strong> plan. Click "Upgrade Now" to proceed.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleUpgrade}
          variant="contained"
          color="primary"
          disabled={!canUpgrade}
          startIcon={<UpgradeIcon />}
        >
          {selectedPlan ? `Upgrade to ${selectedPlan}` : 'View Plans'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionPrompt;