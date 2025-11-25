'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Property {
  _id: string;
  title?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  images?: Array<{ url: string }>;
  address?: {
    city?: string;
    locality?: string;
  };
  amenities?: string[];
  [key: string]: any;
}

interface ComparisonContextType {
  comparisonProperties: Property[];
  addToComparison: (property: Property) => boolean;
  removeFromComparison: (propertyId: string) => void;
  clearComparison: () => void;
  isInComparison: (propertyId: string) => boolean;
  canAddMore: boolean;
  maxProperties: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_PROPERTIES = 4;
const STORAGE_KEY = 'property_comparison';

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setComparisonProperties(parsed);
      }
    } catch (error) {
      console.error('Error loading comparison from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever comparison changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonProperties));
    } catch (error) {
      console.error('Error saving comparison to localStorage:', error);
    }
  }, [comparisonProperties]);

  const addToComparison = (property: Property): boolean => {
    if (comparisonProperties.length >= MAX_COMPARISON_PROPERTIES) {
      return false; // Cannot add more
    }

    if (comparisonProperties.some(p => p._id === property._id)) {
      return false; // Already in comparison
    }

    setComparisonProperties(prev => [...prev, property]);
    return true;
  };

  const removeFromComparison = (propertyId: string) => {
    setComparisonProperties(prev => prev.filter(p => p._id !== propertyId));
  };

  const clearComparison = () => {
    setComparisonProperties([]);
  };

  const isInComparison = (propertyId: string): boolean => {
    return comparisonProperties.some(p => p._id === propertyId);
  };

  const canAddMore = comparisonProperties.length < MAX_COMPARISON_PROPERTIES;

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProperties,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
        maxProperties: MAX_COMPARISON_PROPERTIES
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};



