import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, CalendarIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import subscriptionService from '../../services/subscriptionService';

const SubscriptionChange = () => {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [changeDetails, setChangeDetails] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subscriptionResponse, plansResponse] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getSubscriptions()
      ]);

      setCurrentSubscription(subscriptionResponse.data);
      setAvailablePlans(plansResponse.data);
    } catch (err) {
      setError('Failed to fetch subscription data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
    setError(null);
  };

  const handleBillingCycleChange = (cycle) => {
    setSelectedBillingCycle(cycle);
  };

  const calculateProration = () => {
    if (!currentSubscription?.currentSubscription || !selectedPlan) return null;

    const current = currentSubscription.currentSubscription;
    const now = new Date();
    const endDate = new Date(current.endDate);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    const totalDays = Math.ceil((endDate - new Date(current.startDate)) / (1000 * 60 * 60 * 24));
    
    const unusedAmount = (current.amount / totalDays) * daysRemaining;
    const newAmount = selectedBillingCycle === 'yearly' ? selectedPlan.price * 12 * 0.8 : selectedPlan.price;
    const prorationCredit = unusedAmount;
    const finalAmount = Math.max(0, newAmount - prorationCredit);

    return {
      unusedAmount,
      prorationCredit,
      newAmount,
      finalAmount,
      daysRemaining
    };
  };

  const isUpgrade = () => {
    if (!currentSubscription?.currentSubscription || !selectedPlan) return false;
    
    const subscriptionLevels = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    const currentLevel = subscriptionLevels[currentSubscription.currentSubscription.subscription?.type] || 0;
    const newLevel = subscriptionLevels[selectedPlan.type] || 0;
    
    return newLevel > currentLevel;
  };

  const isDowngrade = () => {
    if (!currentSubscription?.currentSubscription || !selectedPlan) return false;
    
    const subscriptionLevels = { free: 0, basic: 1, premium: 2, enterprise: 3 };
    const currentLevel = subscriptionLevels[currentSubscription.currentSubscription.subscription?.type] || 0;
    const newLevel = subscriptionLevels[selectedPlan.type] || 0;
    
    return newLevel < currentLevel;
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

    try {
      setChanging(true);
      setError(null);

      const response = await subscriptionService.changePlan(selectedPlan._id, selectedBillingCycle);
      
      setChangeDetails(response.data);
      setShowConfirmation(true);
      
      // Refresh subscription data
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change subscription plan');
      console.error('Error changing plan:', err);
    } finally {
      setChanging(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentSubscription?.currentSubscription) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No active subscription found.</p>
        <Button onClick={() => window.location.href = '/subscriptions'} className="mt-4">
          View Subscription Plans
        </Button>
      </div>
    );
  }

  const proration = calculateProration();
  const upgrade = isUpgrade();
  const downgrade = isDowngrade();

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCardIcon className="h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-lg">
                {currentSubscription.currentSubscription.subscription?.name}
              </h4>
              <p className="text-gray-600">
                {currentSubscription.currentSubscription.subscription?.type} Plan
              </p>
              <Badge variant="outline" className="mt-2">
                {currentSubscription.currentSubscription.billingCycle}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(currentSubscription.currentSubscription.amount)}
              </p>
              <p className="text-sm text-gray-500">per billing cycle</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Expires</p>
              <p className="font-semibold">
                {formatDate(currentSubscription.currentSubscription.endDate)}
              </p>
              <Badge variant="default" className="mt-2">
                {currentSubscription.currentSubscription.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Change Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Available Plans */}
          <div>
            <h4 className="font-semibold mb-4">Select New Plan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availablePlans
                .filter(plan => plan.type !== 'free')
                .map((plan) => {
                  const isCurrentPlan = currentSubscription.currentSubscription.subscription?._id === plan._id;
                  const isSelected = selectedPlan?._id === plan._id;
                  
                  return (
                    <Card
                      key={plan._id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary' : 'hover:shadow-md'
                      } ${isCurrentPlan ? 'opacity-50' : ''}`}
                      onClick={() => !isCurrentPlan && handlePlanSelection(plan)}
                    >
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h5 className="font-semibold">{plan.name}</h5>
                          <p className="text-sm text-gray-600 mb-2">{plan.type}</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(plan.price)}
                          </p>
                          <p className="text-sm text-gray-500">per month</p>
                          
                          {isCurrentPlan && (
                            <Badge variant="secondary" className="mt-2">
                              Current Plan
                            </Badge>
                          )}
                          
                          {isSelected && (
                            <Badge variant="default" className="mt-2">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>

          {/* Billing Cycle Selection */}
          {selectedPlan && (
            <div>
              <h4 className="font-semibold mb-4">Billing Cycle</h4>
              <RadioGroup
                value={selectedBillingCycle}
                onValueChange={handleBillingCycleChange}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                  <Label
                    htmlFor="monthly"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <CalendarIcon className="mb-3 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">Monthly</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(selectedPlan.price)} per month
                      </p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="yearly" id="yearly" className="sr-only" />
                  <Label
                    htmlFor="yearly"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <CalendarIcon className="mb-3 h-6 w-6" />
                    <div className="space-y-1 text-center">
                      <p className="text-sm font-medium leading-none">Yearly</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(selectedPlan.price * 12 * 0.8)} per year
                        <br />
                        <span className="text-green-600">Save 20%</span>
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Change Summary */}
          {selectedPlan && proration && (
            <div>
              <h4 className="font-semibold mb-4">Change Summary</h4>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Current Plan:</span>
                      <span className="font-semibold">
                        {currentSubscription.currentSubscription.subscription?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New Plan:</span>
                      <span className="font-semibold">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Billing Cycle:</span>
                      <span className="font-semibold capitalize">{selectedBillingCycle}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span>New Plan Cost:</span>
                      <span>{formatCurrency(proration.newAmount)}</span>
                    </div>
                    
                    {upgrade && (
                      <>
                        <div className="flex justify-between items-center text-green-600">
                          <span>Proration Credit:</span>
                          <span>-{formatCurrency(proration.prorationCredit)}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Final Amount:</span>
                          <span>{formatCurrency(proration.finalAmount)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Credit based on {proration.daysRemaining} days remaining
                        </div>
                      </>
                    )}
                    
                    {downgrade && (
                      <div className="text-blue-600 text-sm">
                        <AlertTriangleIcon className="h-4 w-4 inline mr-1" />
                        Downgrade will take effect at the end of your current billing period
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {selectedPlan && (
            <div className="flex justify-end">
              <Button
                onClick={handleChangePlan}
                disabled={changing}
                className={`${
                  upgrade ? 'bg-blue-600 hover:bg-blue-700' :
                  downgrade ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-primary hover:bg-primary/90'
                }`}
              >
                {changing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <>
                    {upgrade && <ArrowUpIcon className="h-4 w-4 mr-2" />}
                    {downgrade && <ArrowDownIcon className="h-4 w-4 mr-2" />}
                  </>
                )}
                {changing ? 'Processing...' : 
                  upgrade ? 'Upgrade Plan' : 
                  downgrade ? 'Downgrade Plan' : 
                  'Change Plan'
                }
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              Plan Change Successful
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Your subscription has been successfully changed to{' '}
              <span className="font-semibold">{changeDetails?.userSubscription?.subscription?.name}</span>.
            </p>
            
            {changeDetails?.invoice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Invoice Generated</h5>
                <p className="text-sm text-gray-600">
                  Invoice #{changeDetails.invoice.invoiceNumber} has been created.
                </p>
                <p className="text-sm text-gray-600">
                  Amount: {formatCurrency(changeDetails.invoice.total)}
                </p>
              </div>
            )}
            
            {changeDetails?.prorationCredit && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-2">Proration Applied</h5>
                <p className="text-sm text-green-700">
                  Credit applied: {formatCurrency(changeDetails.prorationCredit)}
                </p>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  window.location.href = '/billing';
                }}
              >
                View Billing
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionChange;