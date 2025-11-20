const Property = require('../models/Property');
const UserInteraction = require('../models/UserInteraction');
const User = require('../models/User');

class RecommendationService {
  /**
   * Get personalized recommendations for a user
   * Uses hybrid approach: collaborative filtering + content-based filtering
   */
  async getPersonalizedRecommendations(userId, options = {}) {
    const {
      limit = 10,
      excludeProperties = [],
      type = 'hybrid' // 'collaborative', 'content', 'hybrid'
    } = options;

    try {
      let recommendations = [];

      if (type === 'collaborative' || type === 'hybrid') {
        const collaborativeRecs = await this.getCollaborativeFilteringRecommendations(
          userId,
          limit,
          excludeProperties
        );
        recommendations.push(...collaborativeRecs);
      }

      if (type === 'content' || type === 'hybrid') {
        const contentRecs = await this.getContentBasedRecommendations(
          userId,
          limit,
          excludeProperties
        );
        recommendations.push(...contentRecs);
      }

      // Merge and deduplicate recommendations
      const mergedRecs = this.mergeRecommendations(recommendations, limit);

      // Add relevance scores and reasoning
      return mergedRecs.map(rec => ({
        ...rec,
        relevanceScore: rec.score || 0,
        reasoning: rec.reasoning || 'Based on your preferences'
      }));
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  }

  /**
   * Collaborative Filtering: Find users with similar preferences
   */
  async getCollaborativeFilteringRecommendations(userId, limit, excludeProperties) {
    try {
      // Get user's interaction history
      const userInteractions = await UserInteraction.find({ user: userId })
        .populate('property')
        .sort({ createdAt: -1 })
        .limit(50);

      if (userInteractions.length === 0) {
        return [];
      }

      // Extract property IDs user has interacted with
      const userPropertyIds = userInteractions.map(i => i.property._id.toString());

      // Find other users who interacted with same properties
      const similarUsers = await UserInteraction.aggregate([
        {
          $match: {
            property: { $in: userPropertyIds.map(id => require('mongoose').Types.ObjectId(id)) },
            user: { $ne: require('mongoose').Types.ObjectId(userId) }
          }
        },
        {
          $group: {
            _id: '$user',
            commonProperties: { $addToSet: '$property' },
            interactionCount: { $sum: 1 }
          }
        },
        {
          $match: {
            interactionCount: { $gte: 2 } // At least 2 common properties
          }
        },
        {
          $sort: { interactionCount: -1 }
        },
        {
          $limit: 20
        }
      ]);

      if (similarUsers.length === 0) {
        return [];
      }

      // Get properties that similar users liked but current user hasn't seen
      const similarUserIds = similarUsers.map(u => u._id);
      const recommendedProperties = await UserInteraction.aggregate([
        {
          $match: {
            user: { $in: similarUserIds },
            property: { $nin: userPropertyIds.map(id => require('mongoose').Types.ObjectId(id)) },
            interactionType: { $in: ['view', 'favorite', 'contact'] }
          }
        },
        {
          $group: {
            _id: '$property',
            score: { $sum: 1 },
            users: { $addToSet: '$user' }
          }
        },
        {
          $sort: { score: -1 }
        },
        {
          $limit: limit * 2
        }
      ]);

      // Get full property details
      const propertyIds = recommendedProperties.map(p => p._id);
      const properties = await Property.find({
        _id: { $in: propertyIds, $nin: excludeProperties },
        status: { $in: ['For Sale', 'For Rent'] }
      })
        .populate('agent', 'name email phone')
        .populate('developer', 'name logo')
        .lean();

      // Map properties with scores
      return properties.map(property => {
        const recData = recommendedProperties.find(r => r._id.toString() === property._id.toString());
        return {
          ...property,
          score: recData?.score || 0,
          reasoning: `Users with similar preferences also liked this property`
        };
      });
    } catch (error) {
      console.error('Error in collaborative filtering:', error);
      return [];
    }
  }

  /**
   * Content-Based Filtering: Match properties based on features
   */
  async getContentBasedRecommendations(userId, limit, excludeProperties) {
    try {
      // Get user's favorite properties and their features
      const userInteractions = await UserInteraction.find({
        user: userId,
        interactionType: { $in: ['favorite', 'contact', 'view'] }
      })
        .populate('property')
        .sort({ createdAt: -1 })
        .limit(20);

      if (userInteractions.length === 0) {
        // If no history, return trending properties
        return await this.getTrendingProperties(limit, excludeProperties);
      }

      // Extract user preferences from interactions
      const userPreferences = this.extractUserPreferences(userInteractions);

      // Find similar properties
      const similarProperties = await Property.find({
        _id: { $nin: excludeProperties },
        status: { $in: ['For Sale', 'For Rent'] }
      })
        .populate('agent', 'name email phone')
        .populate('developer', 'name logo')
        .lean();

      // Score properties based on similarity
      const scoredProperties = similarProperties.map(property => {
        const score = this.calculateSimilarityScore(property, userPreferences);
        return {
          ...property,
          score,
          reasoning: this.generateReasoning(property, userPreferences)
        };
      });

      // Sort by score and return top results
      return scoredProperties
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('Error in content-based filtering:', error);
      return [];
    }
  }

  /**
   * Extract user preferences from interaction history
   */
  extractUserPreferences(interactions) {
    const preferences = {
      priceRange: { min: Infinity, max: 0 },
      areaRange: { min: Infinity, max: 0 },
      bedrooms: [],
      bathrooms: [],
      types: [],
      cities: [],
      amenities: [],
      constructionStatus: []
    };

    interactions.forEach(interaction => {
      const property = interaction.property;
      if (!property) return;

      // Price range
      if (property.price) {
        preferences.priceRange.min = Math.min(preferences.priceRange.min, property.price);
        preferences.priceRange.max = Math.max(preferences.priceRange.max, property.price);
      }

      // Area range
      if (property.area) {
        preferences.areaRange.min = Math.min(preferences.areaRange.min, property.area);
        preferences.areaRange.max = Math.max(preferences.areaRange.max, property.area);
      }

      // Bedrooms and bathrooms
      if (property.bedrooms) preferences.bedrooms.push(property.bedrooms);
      if (property.bathrooms) preferences.bathrooms.push(property.bathrooms);

      // Types
      if (property.type) preferences.types.push(property.type);

      // Cities
      if (property.address?.city) preferences.cities.push(property.address.city);

      // Amenities
      if (property.amenities && Array.isArray(property.amenities)) {
        preferences.amenities.push(...property.amenities);
      }

      // Construction status
      if (property.constructionStatus) {
        preferences.constructionStatus.push(property.constructionStatus);
      }
    });

    // Calculate averages and most common values
    return {
      priceRange: {
        min: preferences.priceRange.min === Infinity ? 0 : preferences.priceRange.min * 0.8,
        max: preferences.priceRange.max === 0 ? Infinity : preferences.priceRange.max * 1.2
      },
      areaRange: {
        min: preferences.areaRange.min === Infinity ? 0 : preferences.areaRange.min * 0.8,
        max: preferences.areaRange.max === 0 ? Infinity : preferences.areaRange.max * 1.2
      },
      avgBedrooms: this.getAverage(preferences.bedrooms),
      avgBathrooms: this.getAverage(preferences.bathrooms),
      preferredTypes: this.getMostCommon(preferences.types),
      preferredCities: this.getMostCommon(preferences.cities),
      preferredAmenities: this.getMostCommon(preferences.amenities),
      preferredConstructionStatus: this.getMostCommon(preferences.constructionStatus)
    };
  }

  /**
   * Calculate similarity score between property and user preferences
   */
  calculateSimilarityScore(property, preferences) {
    let score = 0;
    let factors = 0;

    // Price match (0-30 points)
    if (property.price >= preferences.priceRange.min && property.price <= preferences.priceRange.max) {
      const priceDiff = Math.abs(property.price - (preferences.priceRange.min + preferences.priceRange.max) / 2);
      const priceRange = preferences.priceRange.max - preferences.priceRange.min;
      score += 30 * (1 - Math.min(priceDiff / priceRange, 1));
      factors++;
    }

    // Area match (0-20 points)
    if (property.area >= preferences.areaRange.min && property.area <= preferences.areaRange.max) {
      score += 20;
      factors++;
    }

    // Bedrooms match (0-15 points)
    if (property.bedrooms && Math.abs(property.bedrooms - preferences.avgBedrooms) <= 1) {
      score += 15;
      factors++;
    }

    // Bathrooms match (0-10 points)
    if (property.bathrooms && Math.abs(property.bathrooms - preferences.avgBathrooms) <= 1) {
      score += 10;
      factors++;
    }

    // Type match (0-10 points)
    if (preferences.preferredTypes.includes(property.type)) {
      score += 10;
      factors++;
    }

    // City match (0-10 points)
    if (property.address?.city && preferences.preferredCities.includes(property.address.city)) {
      score += 10;
      factors++;
    }

    // Amenities match (0-5 points per matching amenity, max 15)
    if (property.amenities && Array.isArray(property.amenities)) {
      const matchingAmenities = property.amenities.filter(a => preferences.preferredAmenities.includes(a));
      score += Math.min(matchingAmenities.length * 5, 15);
      if (matchingAmenities.length > 0) factors++;
    }

    // Normalize score
    return factors > 0 ? score / factors : 0;
  }

  /**
   * Generate reasoning for recommendation
   */
  generateReasoning(property, preferences) {
    const reasons = [];

    if (property.price >= preferences.priceRange.min && property.price <= preferences.priceRange.max) {
      reasons.push('matches your price range');
    }
    if (preferences.preferredTypes.includes(property.type)) {
      reasons.push(`similar ${property.type.toLowerCase()} type`);
    }
    if (property.address?.city && preferences.preferredCities.includes(property.address.city)) {
      reasons.push(`in your preferred city`);
    }
    if (property.amenities && property.amenities.some(a => preferences.preferredAmenities.includes(a))) {
      reasons.push('has amenities you prefer');
    }

    return reasons.length > 0 
      ? `Recommended because it ${reasons.join(', ')}`
      : 'Similar to properties you viewed';
  }

  /**
   * Get trending properties (fallback when no user history)
   */
  async getTrendingProperties(limit, excludeProperties) {
    try {
      const trendingProperties = await Property.aggregate([
        {
          $match: {
            _id: { $nin: excludeProperties },
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $lookup: {
            from: 'userinteractions',
            localField: '_id',
            foreignField: 'property',
            as: 'interactions'
          }
        },
        {
          $addFields: {
            viewCount: { $size: '$interactions' },
            favoriteCount: {
              $size: {
                $filter: {
                  input: '$interactions',
                  as: 'interaction',
                  cond: { $eq: ['$$interaction.interactionType', 'favorite'] }
                }
              }
            },
            recentViews: {
              $size: {
                $filter: {
                  input: '$interactions',
                  as: 'interaction',
                  cond: {
                    $gte: ['$$interaction.createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)]
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            trendingScore: {
              $add: [
                { $multiply: ['$viewCount', 1] },
                { $multiply: ['$favoriteCount', 3] },
                { $multiply: ['$recentViews', 5] },
                { $multiply: ['$views', 0.5] }
              ]
            }
          }
        },
        {
          $sort: { trendingScore: -1, createdAt: -1 }
        },
        {
          $limit: limit
        }
      ]);

      // Populate agent and developer
      const propertyIds = trendingProperties.map(p => p._id);
      const properties = await Property.find({ _id: { $in: propertyIds } })
        .populate('agent', 'name email phone')
        .populate('developer', 'name logo')
        .lean();

      return properties.map(property => {
        const trendingData = trendingProperties.find(t => t._id.toString() === property._id.toString());
        return {
          ...property,
          score: trendingData?.trendingScore || 0,
          reasoning: 'Trending property based on recent views and favorites'
        };
      });
    } catch (error) {
      console.error('Error getting trending properties:', error);
      return [];
    }
  }

  /**
   * Merge and deduplicate recommendations
   */
  mergeRecommendations(recommendations, limit) {
    const seen = new Set();
    const merged = [];

    for (const rec of recommendations) {
      const id = rec._id?.toString() || rec.id?.toString();
      if (!id || seen.has(id)) continue;

      seen.add(id);
      merged.push(rec);

      if (merged.length >= limit) break;
    }

    return merged;
  }

  /**
   * Helper: Get average of array
   */
  getAverage(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  /**
   * Helper: Get most common values
   */
  getMostCommon(arr, limit = 3) {
    const counts = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .slice(0, limit);
  }
}

module.exports = new RecommendationService();

