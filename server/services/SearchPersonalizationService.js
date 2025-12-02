const Property = require('../models/Property');
const User = require('../models/User');
const SearchAnalytics = require('../models/SearchAnalytics');

/**
 * Search Personalization Service
 * Personalizes search results based on user preferences and history
 */
class SearchPersonalizationService {
  /**
   * Get user search preferences from their search history
   * @param {String} userId - User ID
   * @returns {Promise<Object>} User preferences
   */
  async getUserSearchPreferences(userId) {
    try {
      const userSearches = await SearchAnalytics.find({
        userId,
        timestamp: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Last 90 days
      }).sort({ timestamp: -1 }).limit(100);

      if (userSearches.length === 0) {
        return this.getDefaultPreferences();
      }

      // Extract preferences from search history
      const preferences = {
        preferredCities: new Set(),
        preferredStates: new Set(),
        preferredTypes: new Set(),
        priceRange: { min: null, max: null },
        avgBedrooms: null,
        avgBathrooms: null,
        preferredAmenities: new Set()
      };

      const prices = [];
      const bedrooms = [];
      const bathrooms = [];

      userSearches.forEach(search => {
        const filters = search.filters || {};

        // Extract city preferences
        if (filters.city) {
          preferences.preferredCities.add(filters.city);
        }

        // Extract state preferences
        if (filters.state) {
          preferences.preferredStates.add(filters.state);
        }

        // Extract property type preferences
        if (filters.propertyType && filters.propertyType !== 'ALL') {
          preferences.preferredTypes.add(filters.propertyType);
        }

        // Extract price range
        if (filters.priceMin) {
          prices.push(parseFloat(filters.priceMin));
        }
        if (filters.priceMax) {
          prices.push(parseFloat(filters.priceMax));
        }

        // Extract bedrooms
        if (filters.bedrooms) {
          bedrooms.push(parseInt(filters.bedrooms));
        }

        // Extract bathrooms
        if (filters.bathrooms) {
          bathrooms.push(parseInt(filters.bathrooms));
        }

        // Extract amenities
        if (filters.amenities && Array.isArray(filters.amenities)) {
          filters.amenities.forEach(amenity => {
            preferences.preferredAmenities.add(amenity);
          });
        }
      });

      // Calculate averages and ranges
      if (prices.length > 0) {
        preferences.priceRange = {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
      }

      if (bedrooms.length > 0) {
        preferences.avgBedrooms = Math.round(
          bedrooms.reduce((a, b) => a + b, 0) / bedrooms.length
        );
      }

      if (bathrooms.length > 0) {
        preferences.avgBathrooms = Math.round(
          bathrooms.reduce((a, b) => a + b, 0) / bathrooms.length
        );
      }

      return {
        preferredCities: Array.from(preferences.preferredCities),
        preferredStates: Array.from(preferences.preferredStates),
        preferredTypes: Array.from(preferences.preferredTypes),
        priceRange: preferences.priceRange,
        avgBedrooms: preferences.avgBedrooms,
        avgBathrooms: preferences.avgBathrooms,
        preferredAmenities: Array.from(preferences.preferredAmenities)
      };
    } catch (error) {
      console.error('Error getting user search preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default preferences (when user has no history)
   * @returns {Object} Default preferences
   */
  getDefaultPreferences() {
    return {
      preferredCities: [],
      preferredStates: [],
      preferredTypes: [],
      priceRange: { min: null, max: null },
      avgBedrooms: null,
      avgBathrooms: null,
      preferredAmenities: []
    };
  }

  /**
   * Calculate personalization boost for a property
   * @param {Object} property - Property document
   * @param {Object} preferences - User preferences
   * @returns {Number} Boost multiplier (1.0 = no boost, >1.0 = boosted)
   */
  calculatePersonalizationBoost(property, preferences) {
    let boost = 1.0;
    let matches = 0;

    // City match boost
    if (
      preferences.preferredCities.length > 0 &&
      property.address?.city &&
      preferences.preferredCities.includes(property.address.city)
    ) {
      boost *= 1.2;
      matches++;
    }

    // State match boost
    if (
      preferences.preferredStates.length > 0 &&
      property.address?.state &&
      preferences.preferredStates.includes(property.address.state)
    ) {
      boost *= 1.1;
      matches++;
    }

    // Property type match boost
    if (
      preferences.preferredTypes.length > 0 &&
      property.type &&
      preferences.preferredTypes.includes(property.type)
    ) {
      boost *= 1.15;
      matches++;
    }

    // Price range match boost
    if (
      preferences.priceRange.min !== null &&
      preferences.priceRange.max !== null &&
      property.price >= preferences.priceRange.min &&
      property.price <= preferences.priceRange.max
    ) {
      boost *= 1.1;
      matches++;
    }

    // Bedrooms match boost
    if (
      preferences.avgBedrooms !== null &&
      property.bedrooms &&
      Math.abs(property.bedrooms - preferences.avgBedrooms) <= 1
    ) {
      boost *= 1.05;
      matches++;
    }

    // Amenities match boost
    if (
      preferences.preferredAmenities.length > 0 &&
      property.amenities &&
      Array.isArray(property.amenities)
    ) {
      const matchingAmenities = property.amenities.filter(a =>
        preferences.preferredAmenities.includes(a)
      );
      if (matchingAmenities.length > 0) {
        const amenityMatchRatio = matchingAmenities.length / preferences.preferredAmenities.length;
        boost *= (1 + amenityMatchRatio * 0.1);
        matches++;
      }
    }

    // Only apply boost if there are meaningful matches
    if (matches === 0) {
      return 1.0;
    }

    // Cap the boost to prevent over-weighting
    return Math.min(boost, 1.5);
  }

  /**
   * Apply personalization to search results
   * @param {Array} properties - Array of property documents
   * @param {String} userId - User ID (optional)
   * @returns {Promise<Array>} Personalized and sorted properties
   */
  async personalizeResults(properties, userId = null) {
    if (!userId || properties.length === 0) {
      return properties;
    }

    try {
      const preferences = await this.getUserSearchPreferences(userId);

      // Apply personalization boost to each property
      const personalizedProperties = properties.map(property => {
        const boost = this.calculatePersonalizationBoost(property, preferences);
        const personalizedScore = (property.relevanceScore || 0.5) * boost;

        return {
          ...(property.toObject ? property.toObject() : property),
          relevanceScore: personalizedScore,
          personalizationBoost: boost
        };
      });

      // Re-sort by personalized score
      return personalizedProperties.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error('Error personalizing results:', error);
      return properties;
    }
  }
}

module.exports = new SearchPersonalizationService();

