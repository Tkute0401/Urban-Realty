'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '@/lib/services/api';

export interface ContactRequest {
  _id: string;
  property?: {
    _id: string;
    title: string;
    price: number;
  };
  agent?: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
    mobile?: string;
  };
  message: string;
  contactMethod: 'email' | 'phone' | 'whatsapp';
  status: 'pending' | 'contacted' | 'completed' | 'spam';
  reason: 'initial' | 'followup' | 'question' | 'viewing' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequestData {
  propertyId?: string;
  agentId?: string;
  developerId?: string;
  message: string;
  contactMethod: 'email' | 'phone' | 'whatsapp';
  reason?: 'initial' | 'followup' | 'question' | 'viewing' | 'other';
  urgency?: 'low' | 'medium' | 'high';
  preferredTime?: string;
  userInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const useContactRequests = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['contactRequests', params],
    queryFn: () => api.contacts.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAgentContactRequests = () => {
  return useQuery({
    queryKey: ['agentContactRequests'],
    queryFn: () => api.contacts.list({ type: 'agent' }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDeveloperContactRequests = () => {
  return useQuery({
    queryKey: ['developerContactRequests'],
    queryFn: () => api.contacts.list({ type: 'developer' }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateContactRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateContactRequestData) => {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'web_contact_modal'
      };
      
      return api.contacts.create(payload);
    },
    onSuccess: (data) => {
      // Invalidate and refetch contact requests
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
      queryClient.invalidateQueries({ queryKey: ['agentContactRequests'] });
      queryClient.invalidateQueries({ queryKey: ['developerContactRequests'] });
      
      toast.success('Contact request sent successfully!');
    },
    onError: (error: any) => {
      console.error('Contact request error:', error);
      toast.error(error?.message || 'Failed to send contact request');
    }
  });
};

export const useUpdateContactRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      response 
    }: { 
      id: string; 
      status: string; 
      response?: string; 
    }) => {
      return api.contacts.update(id, { status, response });
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch contact requests
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
      queryClient.invalidateQueries({ queryKey: ['agentContactRequests'] });
      queryClient.invalidateQueries({ queryKey: ['developerContactRequests'] });
      
      toast.success('Contact request updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update contact request error:', error);
      toast.error(error?.message || 'Failed to update contact request');
    }
  });
};

export const useDeleteContactRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return api.contacts.delete(id);
    },
    onSuccess: () => {
      // Invalidate and refetch contact requests
      queryClient.invalidateQueries({ queryKey: ['contactRequests'] });
      queryClient.invalidateQueries({ queryKey: ['agentContactRequests'] });
      queryClient.invalidateQueries({ queryKey: ['developerContactRequests'] });
      
      toast.success('Contact request deleted successfully!');
    },
    onError: (error: any) => {
      console.error('Delete contact request error:', error);
      toast.error(error?.message || 'Failed to delete contact request');
    }
  });
};

export const useContactStats = () => {
  return useQuery({
    queryKey: ['contactStats'],
    queryFn: async () => {
      const [total, pending, contacted, completed] = await Promise.all([
        api.contacts.list({ count: true }),
        api.contacts.list({ status: 'pending', count: true }),
        api.contacts.list({ status: 'contacted', count: true }),
        api.contacts.list({ status: 'completed', count: true })
      ]);
      
      return {
        total: total.count || 0,
        pending: pending.count || 0,
        contacted: contacted.count || 0,
        completed: completed.count || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for managing contact modal state
export const useContactModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [contactType, setContactType] = useState<'agent' | 'developer' | 'general'>('general');
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [propertyInfo, setPropertyInfo] = useState<any>(null);
  const [projectInfo, setProjectInfo] = useState<any>(null);

  const openModal = (type: 'agent' | 'developer' | 'general', info: any, property?: any, project?: any) => {
    setContactType(type);
    setContactInfo(info);
    setPropertyInfo(property);
    setProjectInfo(project);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContactInfo(null);
    setPropertyInfo(null);
    setProjectInfo(null);
  };

  return {
    isOpen,
    contactType,
    contactInfo,
    propertyInfo,
    projectInfo,
    openModal,
    closeModal
  };
};
