// Client-side analytics service for tracking user behavior

class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.startTime = Date.now();
    this.pageViews = [];
    this.events = [];
    this.isInitialized = false;
  }

  // Initialize analytics
  initialize(userId = null) {
    this.userId = userId;
    this.isInitialized = true;
    
    // Track session start
    this.trackEvent('session_start', {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language
    });
    
    // Track page view for current page
    this.trackPageView(window.location.pathname);
    
    // Set up automatic tracking
    this.setupAutomaticTracking();
  }

  // Track page views
  trackPageView(page, data = {}) {
    if (!this.isInitialized) return;
    
    const pageView = {
      id: this.generateId(),
      page,
      timestamp: new Date().toISOString(),
      referrer: document.referrer,
      title: document.title,
      url: window.location.href,
      ...data
    };
    
    this.pageViews.push(pageView);
    
    // Send to server
    this.sendToServer('page_view', pageView);
    
    // Track with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_TRACKING_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  // Track user events
  trackEvent(eventName, data = {}) {
    if (!this.isInitialized) return;
    
    const event = {
      id: this.generateId(),
      name: eventName,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId,
      page: window.location.pathname,
      ...data
    };
    
    this.events.push(event);
    
    // Send to server
    this.sendToServer('event', event);
    
    // Track with Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: data.category || 'general',
        event_label: data.label || '',
        value: data.value || 0
      });
    }
  }

  // Track property interactions
  trackPropertyInteraction(propertyId, interactionType, data = {}) {
    this.trackEvent('property_interaction', {
      propertyId,
      type: interactionType,
      ...data
    });
  }

  // Track search queries
  trackSearch(query, filters = {}, results = 0) {
    this.trackEvent('search', {
      query,
      filters,
      results,
      category: 'search'
    });
  }

  // Track form submissions
  trackFormSubmission(formName, success = true, data = {}) {
    this.trackEvent('form_submission', {
      formName,
      success,
      ...data,
      category: 'form'
    });
  }

  // Track button clicks
  trackButtonClick(buttonName, location, data = {}) {
    this.trackEvent('button_click', {
      buttonName,
      location,
      ...data,
      category: 'interaction'
    });
  }

  // Track errors
  trackError(error, context = {}) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
      category: 'error'
    });
  }

  // Track performance metrics
  trackPerformance(metricName, value, data = {}) {
    this.trackEvent('performance', {
      metric: metricName,
      value,
      ...data,
      category: 'performance'
    });
  }

  // Track conversion events
  trackConversion(conversionType, value = 0, data = {}) {
    this.trackEvent('conversion', {
      type: conversionType,
      value,
      ...data,
      category: 'conversion'
    });
  }

  // Track user engagement
  trackEngagement(action, data = {}) {
    this.trackEvent('engagement', {
      action,
      ...data,
      category: 'engagement'
    });
  }

  // Set up automatic tracking
  setupAutomaticTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', {
          timeOnPage: Date.now() - this.startTime
        });
      } else {
        this.trackEvent('page_visible', {
          timeOnPage: Date.now() - this.startTime
        });
      }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90, 100].includes(scrollDepth)) {
          this.trackEvent('scroll_depth', {
            depth: scrollDepth,
            category: 'engagement'
          });
        }
      }
    });

    // Track time on page
    setInterval(() => {
      const timeOnPage = Date.now() - this.startTime;
      if (timeOnPage > 0 && timeOnPage % 30000 === 0) { // Every 30 seconds
        this.trackEvent('time_on_page', {
          duration: timeOnPage,
          category: 'engagement'
        });
      }
    }, 30000);

    // Track clicks on external links
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && link.hostname !== window.location.hostname) {
        this.trackEvent('external_link_click', {
          url: link.href,
          text: link.textContent,
          category: 'navigation'
        });
      }
    });

    // Track form field interactions
    document.addEventListener('focus', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.trackEvent('form_field_focus', {
          fieldName: event.target.name || event.target.id,
          formName: event.target.closest('form')?.name || 'unknown',
          category: 'form'
        });
      }
    }, true);
  }

  // Send data to server
  async sendToServer(action, data) {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/v1/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          action,
          data
        })
      });

      if (!response.ok) {
        console.warn('Analytics tracking failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }

  // Get analytics data
  getAnalyticsData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.startTime,
      pageViews: this.pageViews,
      events: this.events,
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length
    };
  }

  // Get user insights
  getUserInsights() {
    const events = this.events;
    const pageViews = this.pageViews;
    
    return {
      mostViewedPages: this.getMostViewedPages(pageViews),
      topEvents: this.getTopEvents(events),
      engagementScore: this.calculateEngagementScore(events),
      sessionDuration: Date.now() - this.startTime,
      bounceRate: this.calculateBounceRate(pageViews)
    };
  }

  // Helper methods
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateId() {
    return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getMostViewedPages(pageViews) {
    const pageCounts = {};
    pageViews.forEach(view => {
      pageCounts[view.page] = (pageCounts[view.page] || 0) + 1;
    });
    
    return Object.entries(pageCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));
  }

  getTopEvents(events) {
    const eventCounts = {};
    events.forEach(event => {
      eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
    });
    
    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));
  }

  calculateEngagementScore(events) {
    const engagementEvents = events.filter(e => 
      ['button_click', 'form_submission', 'property_interaction', 'search'].includes(e.name)
    );
    
    const timeOnPage = Date.now() - this.startTime;
    const score = Math.min(100, (engagementEvents.length * 10) + (timeOnPage / 1000 / 60 * 5));
    
    return Math.round(score);
  }

  calculateBounceRate(pageViews) {
    return pageViews.length <= 1 ? 100 : 0;
  }

  // Clean up on page unload
  cleanup() {
    this.trackEvent('session_end', {
      sessionDuration: Date.now() - this.startTime,
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length
    });
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  analyticsService.cleanup();
});

export default analyticsService;