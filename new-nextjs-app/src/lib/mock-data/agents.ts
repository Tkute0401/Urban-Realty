// Agent Mock Data - Comprehensive agent-specific data for testing

export const mockAgents = {
  agent1: {
    id: 'agent1',
    name: 'John Agent',
    email: 'john@urbanrealty.com',
    phone: '+1-555-0101',
    mobile: '+1-555-0102',
    role: 'agent',
    avatar: '/avatars/agent1.jpg',
    licenseNumber: 'RE123456',
    specializations: ['Residential', 'Commercial', 'Luxury Properties'],
    experience: 8,
    rating: 4.8,
    totalSales: 125,
    totalValue: 45000000,
    joinDate: '2020-03-15',
    status: 'active',
    properties: ['prop1', 'prop2', 'prop3'],
    leads: ['lead1', 'lead2', 'lead3', 'lead4'],
    performance: {
      monthlyLeads: 45,
      monthlyViews: 1200,
      conversionRate: 12.5,
      avgResponseTime: 2.5,
      clientSatisfaction: 4.9
    },
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        sms: true,
        leadAlerts: true,
        propertyUpdates: true
      }
    }
  },
  agent2: {
    id: 'agent2',
    name: 'Sarah Smith',
    email: 'sarah@urbanrealty.com',
    phone: '+1-555-0201',
    mobile: '+1-555-0202',
    role: 'agent',
    avatar: '/avatars/agent2.jpg',
    licenseNumber: 'RE789012',
    specializations: ['Luxury Properties', 'Investment Properties'],
    experience: 12,
    rating: 4.9,
    totalSales: 200,
    totalValue: 85000000,
    joinDate: '2018-06-10',
    status: 'active',
    properties: ['prop2', 'prop4', 'prop5'],
    leads: ['lead5', 'lead6'],
    performance: {
      monthlyLeads: 38,
      monthlyViews: 980,
      conversionRate: 15.2,
      avgResponseTime: 1.8,
      clientSatisfaction: 4.95
    },
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        sms: false,
        leadAlerts: true,
        propertyUpdates: false
      }
    }
  }
};

export const mockAgentProperties = [
  {
    id: 'agent-prop1',
    agentId: 'agent1',
    propertyId: 'prop1',
    title: 'Modern Apartment in Downtown',
    price: 500000,
    location: 'Downtown, New York',
    status: 'active',
    views: 45,
    leads: 8,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    performance: {
      viewsThisMonth: 45,
      leadsThisMonth: 8,
      conversionRate: 17.8,
      avgTimeOnPage: 3.2
    }
  },
  {
    id: 'agent-prop2',
    agentId: 'agent1',
    propertyId: 'prop2',
    title: 'Luxury Villa with Pool',
    price: 1200000,
    location: 'Beverly Hills, CA',
    status: 'active',
    views: 32,
    leads: 5,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
    performance: {
      viewsThisMonth: 32,
      leadsThisMonth: 5,
      conversionRate: 15.6,
      avgTimeOnPage: 4.1
    }
  },
  {
    id: 'agent-prop3',
    agentId: 'agent1',
    propertyId: 'prop3',
    title: 'Cozy Family Home',
    price: 750000,
    location: 'Suburbia, TX',
    status: 'sold',
    views: 28,
    leads: 3,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
    performance: {
      viewsThisMonth: 28,
      leadsThisMonth: 3,
      conversionRate: 10.7,
      avgTimeOnPage: 2.8
    }
  }
];

export const mockAgentLeads = [
  {
    id: 'agent-lead1',
    agentId: 'agent1',
    contactId: 'lead1',
    user: {
      name: 'Jane User',
      email: 'jane@example.com',
      phone: '+1-555-1001'
    },
    property: {
      id: 'prop1',
      title: 'Modern Apartment in Downtown',
      price: 500000
    },
    status: 'pending',
    contactMethod: 'email',
    message: 'I am interested in viewing this property. When would be a good time?',
    priority: 'high',
    source: 'website',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastContact: null,
    nextFollowUp: '2024-01-17T10:30:00Z',
    notes: 'Interested in 2-bedroom units, budget flexible'
  },
  {
    id: 'agent-lead2',
    agentId: 'agent1',
    contactId: 'lead2',
    user: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1-555-1002'
    },
    property: {
      id: 'prop2',
      title: 'Luxury Villa with Pool',
      price: 1200000
    },
    status: 'contacted',
    contactMethod: 'phone',
    message: 'Looking for a luxury property with pool and garden',
    priority: 'medium',
    source: 'referral',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    lastContact: '2024-01-16T09:15:00Z',
    nextFollowUp: '2024-01-20T14:20:00Z',
    notes: 'Scheduled viewing for next week, very interested'
  },
  {
    id: 'agent-lead3',
    agentId: 'agent1',
    contactId: 'lead3',
    user: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1-555-1003'
    },
    property: {
      id: 'prop1',
      title: 'Modern Apartment in Downtown',
      price: 500000
    },
    status: 'followup',
    contactMethod: 'whatsapp',
    message: 'Can you send me more details about the amenities?',
    priority: 'low',
    source: 'social_media',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-17T11:30:00Z',
    lastContact: '2024-01-17T11:30:00Z',
    nextFollowUp: '2024-01-19T16:45:00Z',
    notes: 'Sent amenity details, waiting for response'
  },
  {
    id: 'agent-lead4',
    agentId: 'agent1',
    contactId: 'lead4',
    user: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+1-555-1004'
    },
    property: {
      id: 'prop3',
      title: 'Cozy Family Home',
      price: 750000
    },
    status: 'closed',
    contactMethod: 'email',
    message: 'This property looks perfect for our family',
    priority: 'high',
    source: 'website',
    createdAt: '2024-01-12T08:30:00Z',
    updatedAt: '2024-01-25T15:45:00Z',
    lastContact: '2024-01-25T15:45:00Z',
    nextFollowUp: null,
    notes: 'Successfully closed the deal!'
  }
];

export const mockAgentAnalytics = {
  agent1: {
    overview: {
      totalProperties: 3,
      activeProperties: 2,
      totalLeads: 4,
      conversionRate: 25.0,
      avgResponseTime: 2.5,
      monthlyRevenue: 15000,
      clientSatisfaction: 4.8
    },
    trends: {
      monthlyLeads: [12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48],
      monthlyViews: [800, 920, 1050, 1180, 1320, 1450, 1580, 1720, 1850, 1980, 2100, 2250],
      monthlyRevenue: [8000, 9200, 10500, 11800, 13200, 14500, 15800, 17200, 18500, 19800, 21000, 22500]
    },
    performance: {
      topPerformingProperties: [
        { id: 'prop1', title: 'Modern Apartment in Downtown', views: 45, leads: 8, conversionRate: 17.8 },
        { id: 'prop2', title: 'Luxury Villa with Pool', views: 32, leads: 5, conversionRate: 15.6 },
        { id: 'prop3', title: 'Cozy Family Home', views: 28, leads: 3, conversionRate: 10.7 }
      ],
      leadSources: {
        website: 45,
        referral: 30,
        social_media: 15,
        direct: 10
      },
      leadStatusBreakdown: {
        pending: 1,
        contacted: 1,
        followup: 1,
        closed: 1
      }
    }
  },
  agent2: {
    overview: {
      totalProperties: 3,
      activeProperties: 2,
      totalLeads: 2,
      conversionRate: 50.0,
      avgResponseTime: 1.8,
      monthlyRevenue: 25000,
      clientSatisfaction: 4.9
    },
    trends: {
      monthlyLeads: [8, 10, 12, 15, 18, 22, 25, 28, 30, 33, 35, 38],
      monthlyViews: [600, 720, 850, 980, 1120, 1250, 1380, 1520, 1650, 1780, 1900, 2030],
      monthlyRevenue: [12000, 14400, 17000, 19600, 22400, 25000, 27600, 30400, 33000, 35600, 38000, 40600]
    },
    performance: {
      topPerformingProperties: [
        { id: 'prop2', title: 'Luxury Villa with Pool', views: 32, leads: 5, conversionRate: 15.6 },
        { id: 'prop4', title: 'Penthouse with City View', views: 28, leads: 4, conversionRate: 14.3 },
        { id: 'prop5', title: 'Beachfront Condo', views: 25, leads: 3, conversionRate: 12.0 }
      ],
      leadSources: {
        referral: 60,
        website: 25,
        direct: 10,
        social_media: 5
      },
      leadStatusBreakdown: {
        pending: 0,
        contacted: 1,
        followup: 0,
        closed: 1
      }
    }
  }
};

// Agent API Mock Functions
export const mockAgentAPI = {
  // Get agent dashboard data
  getDashboard: (agentId: string) => {
    const agent = mockAgents[agentId];
    const analytics = mockAgentAnalytics[agentId];
    const properties = mockAgentProperties.filter(p => p.agentId === agentId);
    const leads = mockAgentLeads.filter(l => l.agentId === agentId);
    
    return {
      agent,
      analytics,
      properties,
      leads,
      stats: {
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.status === 'active').length,
        totalLeads: leads.length,
        activeLeads: leads.filter(l => ['pending', 'contacted', 'followup'].includes(l.status)).length,
        totalViews: properties.reduce((sum, p) => sum + p.views, 0),
        monthlyRevenue: analytics.overview.monthlyRevenue,
        conversionRate: analytics.overview.conversionRate,
        avgResponseTime: analytics.overview.avgResponseTime
      }
    };
  },

  // Get agent properties
  getProperties: (agentId: string, filters?: any) => {
    let properties = mockAgentProperties.filter(p => p.agentId === agentId);
    
    if (filters?.status && filters.status !== 'all') {
      properties = properties.filter(p => p.status === filters.status);
    }
    
    if (filters?.search) {
      properties = properties.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return {
      data: properties,
      total: properties.length,
      page: 1,
      limit: 10
    };
  },

  // Get agent leads
  getLeads: (agentId: string, filters?: any) => {
    let leads = mockAgentLeads.filter(l => l.agentId === agentId);
    
    if (filters?.status && filters.status !== 'all') {
      leads = leads.filter(l => l.status === filters.status);
    }
    
    if (filters?.contactMethod && filters.contactMethod !== 'all') {
      leads = leads.filter(l => l.contactMethod === filters.contactMethod);
    }
    
    if (filters?.search) {
      leads = leads.filter(l => 
        l.user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        l.user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        l.property.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return {
      data: leads,
      total: leads.length,
      page: 1,
      limit: 10
    };
  },

  // Get agent analytics
  getAnalytics: (agentId: string) => {
    return mockAgentAnalytics[agentId] || mockAgentAnalytics.agent1;
  },

  // Update lead status
  updateLeadStatus: (leadId: string, status: string) => {
    const lead = mockAgentLeads.find(l => l.id === leadId);
    if (lead) {
      lead.status = status;
      lead.updatedAt = new Date().toISOString();
      lead.lastContact = new Date().toISOString();
    }
    return { success: true, lead };
  },

  // Get agent performance metrics
  getPerformance: (agentId: string) => {
    const agent = mockAgents[agentId];
    const analytics = mockAgentAnalytics[agentId];
    
    return {
      agent,
      performance: {
        monthlyLeads: analytics.overview.totalLeads,
        monthlyViews: analytics.trends.monthlyViews[analytics.trends.monthlyViews.length - 1],
        conversionRate: analytics.overview.conversionRate,
        avgResponseTime: analytics.overview.avgResponseTime,
        clientSatisfaction: analytics.overview.clientSatisfaction,
        totalSales: agent.totalSales,
        totalValue: agent.totalValue,
        experience: agent.experience,
        rating: agent.rating
      }
    };
  }
};

export default {
  mockAgents,
  mockAgentProperties,
  mockAgentLeads,
  mockAgentAnalytics,
  mockAgentAPI
};