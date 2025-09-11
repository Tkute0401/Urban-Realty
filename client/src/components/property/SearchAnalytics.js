// Search Analytics Utility
class SearchAnalytics {
  constructor() {
    this.storageKey = 'searchAnalytics';
    this.maxPopularSearches = 20;
    this.loadAnalytics();
  }

  // Load analytics from localStorage
  loadAnalytics() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      this.analytics = saved ? JSON.parse(saved) : {
        totalSearches: 0,
        searchCounts: {},
        recentSearches: [],
        popularSearches: [],
        lastUpdated: Date.now()
      };
    } catch (error) {
      console.error('Error loading search analytics:', error);
      this.analytics = {
        totalSearches: 0,
        searchCounts: {},
        recentSearches: [],
        popularSearches: [],
        lastUpdated: Date.now()
      };
    }
  }

  // Track a search
  trackSearch(searchTerm) {
    if (!searchTerm || searchTerm.trim().length === 0) return;

    const term = searchTerm.trim().toLowerCase();
    
    // Update total searches
    this.analytics.totalSearches++;
    
    // Update search count for this term
    this.analytics.searchCounts[term] = (this.analytics.searchCounts[term] || 0) + 1;
    
    // Update recent searches
    this.updateRecentSearches(term);
    
    // Update popular searches
    this.updatePopularSearches();
    
    // Update last updated timestamp
    this.analytics.lastUpdated = Date.now();
    
    // Save to localStorage
    this.saveAnalytics();
  }

  // Update recent searches
  updateRecentSearches(term) {
    // Remove if already exists
    this.analytics.recentSearches = this.analytics.recentSearches.filter(item => item !== term);
    
    // Add to beginning
    this.analytics.recentSearches.unshift(term);
    
    // Keep only last 10
    this.analytics.recentSearches = this.analytics.recentSearches.slice(0, 10);
  }

  // Update popular searches
  updatePopularSearches() {
    // Convert search counts to array and sort by count
    const sortedSearches = Object.entries(this.analytics.searchCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, this.maxPopularSearches)
      .map(([term]) => term);
    
    this.analytics.popularSearches = sortedSearches;
  }

  // Get recent searches
  getRecentSearches(limit = 5) {
    return this.analytics.recentSearches.slice(0, limit);
  }

  // Get popular searches
  getPopularSearches(limit = 10) {
    return this.analytics.popularSearches.slice(0, limit);
  }

  // Get search suggestions based on input
  getSearchSuggestions(input, limit = 8) {
    if (!input || input.length < 2) return [];
    
    const inputLower = input.toLowerCase();
    const suggestions = [];
    
    // Add exact matches from popular searches
    const exactMatches = this.analytics.popularSearches
      .filter(term => term.startsWith(inputLower))
      .slice(0, limit / 2);
    
    suggestions.push(...exactMatches);
    
    // Add partial matches from popular searches
    const partialMatches = this.analytics.popularSearches
      .filter(term => term.includes(inputLower) && !exactMatches.includes(term))
      .slice(0, limit - suggestions.length);
    
    suggestions.push(...partialMatches);
    
    // Add recent searches that match
    const recentMatches = this.analytics.recentSearches
      .filter(term => term.includes(inputLower) && !suggestions.includes(term))
      .slice(0, limit - suggestions.length);
    
    suggestions.push(...recentMatches);
    
    return suggestions;
  }

  // Get search statistics
  getSearchStats() {
    return {
      totalSearches: this.analytics.totalSearches,
      uniqueSearches: Object.keys(this.analytics.searchCounts).length,
      mostPopular: this.analytics.popularSearches[0] || null,
      lastUpdated: this.analytics.lastUpdated
    };
  }

  // Clear analytics
  clearAnalytics() {
    this.analytics = {
      totalSearches: 0,
      searchCounts: {},
      recentSearches: [],
      popularSearches: [],
      lastUpdated: Date.now()
    };
    this.saveAnalytics();
  }

  // Save analytics to localStorage
  saveAnalytics() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.analytics));
    } catch (error) {
      console.error('Error saving search analytics:', error);
    }
  }

  // Export analytics data
  exportAnalytics() {
    return {
      ...this.analytics,
      exportDate: new Date().toISOString()
    };
  }

  // Import analytics data
  importAnalytics(data) {
    try {
      if (data && typeof data === 'object') {
        this.analytics = {
          ...this.analytics,
          ...data,
          lastUpdated: Date.now()
        };
        this.saveAnalytics();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing search analytics:', error);
      return false;
    }
  }
}

// Create singleton instance
const searchAnalytics = new SearchAnalytics();

export default searchAnalytics;