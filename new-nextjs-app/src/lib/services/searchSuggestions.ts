import { api } from './api';

export interface SearchSuggestion {
  text: string;
  type: 'city' | 'property' | 'amenity';
  icon?: React.ReactNode;
  category?: string;
}

export interface SearchSuggestionsResponse {
  success: boolean;
  data: {
    cities: string[];
    properties: string[];
    amenities: string[];
  };
}

/**
 * Centralized search suggestions service
 * Replaces duplicate fetch calls across search components
 */
export const searchSuggestionsService = {
  /**
   * Get search suggestions based on query
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await api.properties.searchSuggestions(query);
      
      const data: SearchSuggestionsResponse = response.data;
      
      if (!data.success) {
        return [];
      }

      const allSuggestions: SearchSuggestion[] = [];
      
      // Add cities with location icon
      data.data.cities.forEach(city => {
        allSuggestions.push({
          text: city,
          type: 'city',
          category: 'Cities'
        });
      });
      
      // Add properties
      data.data.properties.forEach(property => {
        allSuggestions.push({
          text: property,
          type: 'property',
          category: 'Properties'
        });
      });
      
      // Add amenities
      data.data.amenities.forEach(amenity => {
        allSuggestions.push({
          text: amenity,
          type: 'amenity',
          category: 'Amenities'
        });
      });
      
      return allSuggestions;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      return [];
    }
  }
};
