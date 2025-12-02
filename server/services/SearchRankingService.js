const Property = require('../models/Property');

/**
 * Search Ranking Service
 * Implements multi-factor relevance scoring for property search results
 */
class SearchRankingService {
  /**
   * Calculate relevance score for a property based on search query and filters
   * @param {Object} property - Property document
   * @param {Object} searchParams - Search parameters (query, filters, userLocation)
   * @returns {Number} Relevance score (0-1)
   */
  calculateRelevanceScore(property, searchParams) {
    const {
      searchQuery = '',
      priceMin = null,
      priceMax = null,
      city = null,
      state = null,
      userLocation = null,
      bedrooms = null,
      bathrooms = null,
      propertyType = null
    } = searchParams;

    let score = 0;
    let factors = 0;

    // 1. Text Match Score (40% weight)
    if (searchQuery) {
      const textScore = this.calculateTextMatchScore(property, searchQuery);
      score += textScore * 0.4;
      factors += 0.4;
    }

    // 2. Location Match Score (25% weight)
    const locationScore = this.calculateLocationMatchScore(
      property,
      { city, state, userLocation }
    );
    score += locationScore * 0.25;
    factors += 0.25;

    // 3. Price Match Score (15% weight)
    if (priceMin !== null || priceMax !== null) {
      const priceScore = this.calculatePriceMatchScore(
        property,
        { priceMin, priceMax }
      );
      score += priceScore * 0.15;
      factors += 0.15;
    }

    // 4. Recency Score (10% weight)
    const recencyScore = this.calculateRecencyScore(property);
    score += recencyScore * 0.1;
    factors += 0.1;

    // 5. Popularity Score (10% weight)
    const popularityScore = this.calculatePopularityScore(property);
    score += popularityScore * 0.1;
    factors += 0.1;

    // Apply boost multipliers
    let boostMultiplier = 1.0;

    // Verified property boost
    if (property.verified) {
      boostMultiplier *= 1.2;
    }

    // Featured property boost
    if (property.featured) {
      boostMultiplier *= 1.15;
    }

    // Property type match boost
    if (propertyType && property.type === propertyType) {
      boostMultiplier *= 1.1;
    }

    // Bedrooms match boost
    if (bedrooms && property.bedrooms === parseInt(bedrooms)) {
      boostMultiplier *= 1.05;
    }

    // Bathrooms match boost
    if (bathrooms && property.bathrooms === parseInt(bathrooms)) {
      boostMultiplier *= 1.05;
    }

    // Normalize score
    const normalizedScore = factors > 0 ? score / factors : 0;
    return Math.min(normalizedScore * boostMultiplier, 1.0);
  }

  /**
   * Calculate text match score using TF-IDF-like approach
   * @param {Object} property - Property document
   * @param {String} query - Search query
   * @returns {Number} Text match score (0-1)
   */
  calculateTextMatchScore(property, query) {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    if (queryTerms.length === 0) return 0.5; // Default score if no query

    const searchableText = [
      property.title || '',
      property.description || '',
      property.address?.city || '',
      property.address?.state || '',
      property.address?.locality || '',
      property.buildingName || '',
      property.type || ''
    ].join(' ').toLowerCase();

    let matchScore = 0;
    let exactMatches = 0;
    let partialMatches = 0;

    queryTerms.forEach(term => {
      // Exact match (highest score)
      if (searchableText.includes(term)) {
        // Check if it's a word boundary match (exact word)
        const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
        if (wordBoundaryRegex.test(searchableText)) {
          exactMatches++;
          // Title matches are more important
          if (property.title && property.title.toLowerCase().includes(term)) {
            matchScore += 0.3;
          } else if (property.description && property.description.toLowerCase().includes(term)) {
            matchScore += 0.2;
          } else if (property.address?.city?.toLowerCase().includes(term)) {
            matchScore += 0.25;
          } else {
            matchScore += 0.15;
          }
        } else {
          partialMatches++;
          matchScore += 0.1;
        }
      }
    });

    // Normalize based on number of query terms
    const baseScore = matchScore / queryTerms.length;

    // Bonus for matching all terms
    if (exactMatches === queryTerms.length) {
      return Math.min(baseScore * 1.5, 1.0);
    }

    // Bonus for matching most terms
    if (exactMatches + partialMatches >= queryTerms.length * 0.7) {
      return Math.min(baseScore * 1.2, 1.0);
    }

    return Math.min(baseScore, 1.0);
  }

  /**
   * Calculate location match score
   * @param {Object} property - Property document
   * @param {Object} locationParams - Location parameters
   * @returns {Number} Location match score (0-1)
   */
  calculateLocationMatchScore(property, locationParams) {
    const { city, state, userLocation } = locationParams;
    let score = 0.5; // Default score

    // Exact city match
    if (city && property.address?.city?.toLowerCase() === city.toLowerCase()) {
      score = 1.0;
    }
    // Exact state match (lower priority)
    else if (state && property.address?.state?.toLowerCase() === state.toLowerCase()) {
      score = 0.7;
    }
    // User location proximity (if available)
    else if (userLocation && property.location?.coordinates) {
      const distance = this.calculateDistance(
        userLocation.coordinates,
        property.location.coordinates
      );
      // Score based on distance (closer = higher score)
      // Within 5km = 0.9, 10km = 0.7, 20km = 0.5, >20km = 0.3
      if (distance <= 5) {
        score = 0.9;
      } else if (distance <= 10) {
        score = 0.7;
      } else if (distance <= 20) {
        score = 0.5;
      } else {
        score = 0.3;
      }
    }

    return score;
  }

  /**
   * Calculate price match score
   * @param {Object} property - Property document
   * @param {Object} priceParams - Price range parameters
   * @returns {Number} Price match score (0-1)
   */
  calculatePriceMatchScore(property, priceParams) {
    const { priceMin, priceMax } = priceParams;
    const propertyPrice = property.price || 0;

    // If no price filter, return neutral score
    if (priceMin === null && priceMax === null) {
      return 0.5;
    }

    // Within range (perfect match)
    if (
      (priceMin === null || propertyPrice >= priceMin) &&
      (priceMax === null || propertyPrice <= priceMax)
    ) {
      // Bonus for being in the middle of the range
      if (priceMin !== null && priceMax !== null) {
        const range = priceMax - priceMin;
        const midPoint = priceMin + range / 2;
        const distanceFromMid = Math.abs(propertyPrice - midPoint);
        const normalizedDistance = range > 0 ? distanceFromMid / range : 0;
        return Math.max(0.9, 1.0 - normalizedDistance * 0.2);
      }
      return 1.0;
    }

    // Close to range (partial match)
    if (priceMin !== null && propertyPrice < priceMin) {
      const diff = priceMin - propertyPrice;
      const percentageDiff = diff / priceMin;
      if (percentageDiff <= 0.1) { // Within 10%
        return 0.7;
      } else if (percentageDiff <= 0.2) { // Within 20%
        return 0.5;
      }
    }

    if (priceMax !== null && propertyPrice > priceMax) {
      const diff = propertyPrice - priceMax;
      const percentageDiff = diff / priceMax;
      if (percentageDiff <= 0.1) { // Within 10%
        return 0.7;
      } else if (percentageDiff <= 0.2) { // Within 20%
        return 0.5;
      }
    }

    return 0.2; // Far from range
  }

  /**
   * Calculate recency score (newer properties ranked higher)
   * @param {Object} property - Property document
   * @returns {Number} Recency score (0-1)
   */
  calculateRecencyScore(property) {
    if (!property.createdAt) return 0.5;

    const now = new Date();
    const created = new Date(property.createdAt);
    const daysSinceCreation = (now - created) / (1000 * 60 * 60 * 24);

    // Properties less than 7 days old get highest score
    if (daysSinceCreation <= 7) {
      return 1.0;
    }
    // Properties less than 30 days old
    else if (daysSinceCreation <= 30) {
      return 0.9;
    }
    // Properties less than 90 days old
    else if (daysSinceCreation <= 90) {
      return 0.7;
    }
    // Properties less than 180 days old
    else if (daysSinceCreation <= 180) {
      return 0.5;
    }
    // Older properties
    else {
      return 0.3;
    }
  }

  /**
   * Calculate popularity score based on views and engagement
   * @param {Object} property - Property document
   * @returns {Number} Popularity score (0-1)
   */
  calculatePopularityScore(property) {
    const views = property.views || 0;

    // Normalize views (assuming max views is around 10000)
    // Using logarithmic scale for better distribution
    if (views === 0) return 0.3;
    if (views <= 10) return 0.4;
    if (views <= 50) return 0.5;
    if (views <= 100) return 0.6;
    if (views <= 500) return 0.7;
    if (views <= 1000) return 0.8;
    if (views <= 5000) return 0.9;
    return 1.0;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * @param {Array} coord1 - [longitude, latitude]
   * @param {Array} coord2 - [longitude, latitude]
   * @returns {Number} Distance in kilometers
   */
  calculateDistance(coord1, coord2) {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;

    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   * @param {Number} degrees
   * @returns {Number} Radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Rank and sort properties by relevance
   * @param {Array} properties - Array of property documents
   * @param {Object} searchParams - Search parameters
   * @returns {Array} Sorted properties with relevance scores
   */
  rankProperties(properties, searchParams) {
    return properties
      .map(property => {
        const relevanceScore = this.calculateRelevanceScore(property, searchParams);
        return {
          ...property.toObject ? property.toObject() : property,
          relevanceScore
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

module.exports = new SearchRankingService();

