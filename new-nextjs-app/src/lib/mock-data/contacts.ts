// Mock Contact Data - Based on audit requirements
export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  agentId?: string;
  type: 'inquiry' | 'viewing' | 'general' | 'complaint' | 'feedback';
  status: 'new' | 'contacted' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: 'website' | 'phone' | 'email' | 'referral' | 'walk-in';
  assignedTo?: string;
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockContactRequests: ContactRequest[] = [
  {
    id: 'contact1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-1001',
    message: 'I am interested in viewing the Modern Apartment in Downtown. Could you please schedule a viewing for this weekend?',
    propertyId: 'prop1',
    agentId: 'agent1',
    type: 'viewing',
    status: 'new',
    priority: 'medium',
    source: 'website',
    assignedTo: 'agent1',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 'contact2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-1002',
    message: 'I would like to know more about the pricing and financing options for the Luxury House with Garden.',
    propertyId: 'prop2',
    agentId: 'agent1',
    type: 'inquiry',
    status: 'contacted',
    priority: 'high',
    source: 'email',
    assignedTo: 'agent1',
    notes: 'Customer is pre-approved for mortgage, very interested in the property.',
    followUpDate: '2024-01-16T14:00:00Z',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
  },
  {
    id: 'contact3',
    name: 'Mike Davis',
    email: 'mike.davis@email.com',
    phone: '+1-555-1003',
    message: 'I am looking for a commercial space for my new business. The Modern Commercial Space looks perfect. Can we discuss the lease terms?',
    propertyId: 'prop5',
    agentId: 'agent1',
    type: 'inquiry',
    status: 'in-progress',
    priority: 'high',
    source: 'phone',
    assignedTo: 'agent1',
    notes: 'Business owner looking for 5-year lease, has good credit history.',
    followUpDate: '2024-01-17T11:00:00Z',
    createdAt: '2024-01-13T11:20:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: 'contact4',
    name: 'Emily Wilson',
    email: 'emily.wilson@email.com',
    message: 'I am interested in becoming a real estate agent with your company. Could you please provide more information about the opportunities available?',
    type: 'general',
    status: 'new',
    priority: 'medium',
    source: 'website',
    assignedTo: 'admin',
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
  {
    id: 'contact5',
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '+1-555-1005',
    message: 'I had a great experience working with your agent Sarah Smith. She was very professional and helpful throughout the entire process.',
    agentId: 'agent2',
    type: 'feedback',
    status: 'resolved',
    priority: 'low',
    source: 'email',
    assignedTo: 'agent2',
    notes: 'Positive feedback, customer was very satisfied with the service.',
    createdAt: '2024-01-12T10:15:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
  },
  {
    id: 'contact6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    phone: '+1-555-1006',
    message: 'I am looking for a 2-bedroom apartment in the downtown area. My budget is around $400,000. Do you have any properties that match my criteria?',
    type: 'inquiry',
    status: 'new',
    priority: 'medium',
    source: 'website',
    assignedTo: 'agent2',
    createdAt: '2024-01-15T16:45:00Z',
    updatedAt: '2024-01-15T16:45:00Z',
  },
];

// Mock contact API responses
export const mockContactAPI = {
  list: (filters?: {
    status?: string;
    type?: string;
    priority?: string;
    agentId?: string;
    propertyId?: string;
  }) => {
    let filteredContacts = [...mockContactRequests];
    
    if (filters) {
      if (filters.status) {
        filteredContacts = filteredContacts.filter(c => c.status === filters.status);
      }
      if (filters.type) {
        filteredContacts = filteredContacts.filter(c => c.type === filters.type);
      }
      if (filters.priority) {
        filteredContacts = filteredContacts.filter(c => c.priority === filters.priority);
      }
      if (filters.agentId) {
        filteredContacts = filteredContacts.filter(c => c.agentId === filters.agentId);
      }
      if (filters.propertyId) {
        filteredContacts = filteredContacts.filter(c => c.propertyId === filters.propertyId);
      }
    }
    
    return {
      success: true,
      contacts: filteredContacts,
      total: filteredContacts.length,
    };
  },
  
  get: (id: string) => {
    const contact = mockContactRequests.find(c => c.id === id);
    if (contact) {
      return {
        success: true,
        contact,
      };
    }
    return {
      success: false,
      error: 'Contact not found',
    };
  },
  
  create: (contactData: Partial<ContactRequest>) => {
    const newContact: ContactRequest = {
      id: `contact-${Date.now()}`,
      name: contactData.name || 'New Contact',
      email: contactData.email || 'contact@example.com',
      message: contactData.message || '',
      type: contactData.type || 'general',
      status: 'new',
      priority: contactData.priority || 'medium',
      source: contactData.source || 'website',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...contactData,
    };
    
    mockContactRequests.push(newContact);
    
    return {
      success: true,
      contact: newContact,
    };
  },
  
  update: (id: string, updates: Partial<ContactRequest>) => {
    const contactIndex = mockContactRequests.findIndex(c => c.id === id);
    if (contactIndex !== -1) {
      const updatedContact = {
        ...mockContactRequests[contactIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      mockContactRequests[contactIndex] = updatedContact;
      return {
        success: true,
        contact: updatedContact,
      };
    }
    return {
      success: false,
      error: 'Contact not found',
    };
  },
  
  delete: (id: string) => {
    const contactIndex = mockContactRequests.findIndex(c => c.id === id);
    if (contactIndex !== -1) {
      mockContactRequests.splice(contactIndex, 1);
      return {
        success: true,
        message: 'Contact deleted successfully',
      };
    }
    return {
      success: false,
      error: 'Contact not found',
    };
  },
  
  assign: (id: string, agentId: string) => {
    const contactIndex = mockContactRequests.findIndex(c => c.id === id);
    if (contactIndex !== -1) {
      mockContactRequests[contactIndex] = {
        ...mockContactRequests[contactIndex],
        assignedTo: agentId,
        agentId: agentId,
        updatedAt: new Date().toISOString(),
      };
      return {
        success: true,
        contact: mockContactRequests[contactIndex],
      };
    }
    return {
      success: false,
      error: 'Contact not found',
    };
  },
};

export default mockContactRequests;