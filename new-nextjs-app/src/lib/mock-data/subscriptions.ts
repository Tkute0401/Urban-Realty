// Mock Subscription Data - Based on audit requirements
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxProperties: number;
  maxAgents: number;
  maxUsers: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'plan1',
    name: 'Basic',
    description: 'Perfect for individual agents and small teams',
    price: 29,
    billingCycle: 'monthly',
    features: [
      'Up to 10 property listings',
      'Basic analytics',
      'Email support',
      'Mobile app access',
      'Standard templates',
    ],
    maxProperties: 10,
    maxAgents: 1,
    maxUsers: 5,
    isPopular: false,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'plan2',
    name: 'Professional',
    description: 'Ideal for growing real estate agencies',
    price: 79,
    billingCycle: 'monthly',
    features: [
      'Up to 50 property listings',
      'Advanced analytics',
      'Priority support',
      'Mobile app access',
      'Premium templates',
      'Lead management',
      'CRM integration',
      'Custom branding',
    ],
    maxProperties: 50,
    maxAgents: 5,
    maxUsers: 25,
    isPopular: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'plan3',
    name: 'Enterprise',
    description: 'Complete solution for large real estate companies',
    price: 199,
    billingCycle: 'monthly',
    features: [
      'Unlimited property listings',
      'Advanced analytics & reporting',
      '24/7 phone support',
      'Mobile app access',
      'Premium templates',
      'Advanced lead management',
      'Full CRM integration',
      'Custom branding',
      'API access',
      'White-label options',
      'Dedicated account manager',
    ],
    maxProperties: -1, // Unlimited
    maxAgents: -1, // Unlimited
    maxUsers: -1, // Unlimited
    isPopular: false,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
];

export const mockUserSubscriptions: UserSubscription[] = [
  {
    id: 'sub1',
    userId: 'agent1',
    planId: 'plan2',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-02-01T00:00:00Z',
    autoRenew: true,
    paymentMethod: 'card_ending_4242',
    lastPaymentDate: '2024-01-01T00:00:00Z',
    nextPaymentDate: '2024-02-01T00:00:00Z',
    totalPaid: 79,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'sub2',
    userId: 'agent2',
    planId: 'plan1',
    status: 'active',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-02-15T00:00:00Z',
    autoRenew: true,
    paymentMethod: 'card_ending_5555',
    lastPaymentDate: '2024-01-15T00:00:00Z',
    nextPaymentDate: '2024-02-15T00:00:00Z',
    totalPaid: 29,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
  },
  {
    id: 'sub3',
    userId: 'user1',
    planId: 'plan1',
    status: 'cancelled',
    startDate: '2023-12-01T00:00:00Z',
    endDate: '2024-01-01T00:00:00Z',
    autoRenew: false,
    paymentMethod: 'card_ending_1234',
    lastPaymentDate: '2023-12-01T00:00:00Z',
    nextPaymentDate: '2024-01-01T00:00:00Z',
    totalPaid: 29,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Mock subscription API responses
export const mockSubscriptionAPI = {
  getPlans: () => {
    return {
      success: true,
      plans: mockSubscriptionPlans,
      total: mockSubscriptionPlans.length,
    };
  },
  
  getPlan: (id: string) => {
    const plan = mockSubscriptionPlans.find(p => p.id === id);
    if (plan) {
      return {
        success: true,
        plan,
      };
    }
    return {
      success: false,
      error: 'Plan not found',
    };
  },
  
  getUserSubscription: (userId: string) => {
    const subscription = mockUserSubscriptions.find(s => s.userId === userId);
    if (subscription) {
      return {
        success: true,
        subscription,
      };
    }
    return {
      success: false,
      error: 'No subscription found',
    };
  },
  
  subscribe: (userId: string, planId: string, paymentMethod: string) => {
    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      return {
        success: false,
        error: 'Plan not found',
      };
    }
    
    const newSubscription: UserSubscription = {
      id: `sub-${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      autoRenew: true,
      paymentMethod,
      lastPaymentDate: new Date().toISOString(),
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalPaid: plan.price,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockUserSubscriptions.push(newSubscription);
    
    return {
      success: true,
      subscription: newSubscription,
      paymentIntent: {
        id: `pi_${Date.now()}`,
        status: 'succeeded',
        amount: plan.price * 100, // Amount in cents
        currency: 'usd',
      },
    };
  },
  
  cancelSubscription: (userId: string) => {
    const subscriptionIndex = mockUserSubscriptions.findIndex(s => s.userId === userId);
    if (subscriptionIndex !== -1) {
      mockUserSubscriptions[subscriptionIndex] = {
        ...mockUserSubscriptions[subscriptionIndex],
        status: 'cancelled',
        autoRenew: false,
        updatedAt: new Date().toISOString(),
      };
      return {
        success: true,
        message: 'Subscription cancelled successfully',
      };
    }
    return {
      success: false,
      error: 'Subscription not found',
    };
  },
  
  updateSubscription: (userId: string, planId: string) => {
    const subscriptionIndex = mockUserSubscriptions.findIndex(s => s.userId === userId);
    const plan = mockSubscriptionPlans.find(p => p.id === planId);
    
    if (subscriptionIndex !== -1 && plan) {
      mockUserSubscriptions[subscriptionIndex] = {
        ...mockUserSubscriptions[subscriptionIndex],
        planId,
        updatedAt: new Date().toISOString(),
      };
      return {
        success: true,
        subscription: mockUserSubscriptions[subscriptionIndex],
      };
    }
    return {
      success: false,
      error: 'Subscription or plan not found',
    };
  },
};

export default mockSubscriptionPlans;