// React hook for analytics tracking

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '../services/analyticsService';
import { useAuth } from './useAuth';

export const useAnalytics = () => {
  const location = useLocation();
  const { user } = useAuth();
  const previousLocation = useRef();

  // Initialize analytics when user changes
  useEffect(() => {
    analyticsService.initialize(user?.id);
  }, [user?.id]);

  // Track page views on route changes
  useEffect(() => {
    if (previousLocation.current !== location.pathname) {
      analyticsService.trackPageView(location.pathname, {
        search: location.search,
        hash: location.hash
      });
      previousLocation.current = location.pathname;
    }
  }, [location]);

  // Track property view
  const trackPropertyView = useCallback((propertyId, propertyData = {}) => {
    analyticsService.trackPropertyInteraction(propertyId, 'view', {
      ...propertyData,
      page: location.pathname
    });
  }, [location.pathname]);

  // Track property favorite
  const trackPropertyFavorite = useCallback((propertyId, isFavorited) => {
    analyticsService.trackPropertyInteraction(propertyId, 'favorite', {
      action: isFavorited ? 'add' : 'remove',
      page: location.pathname
    });
  }, [location.pathname]);

  // Track property contact
  const trackPropertyContact = useCallback((propertyId, contactData = {}) => {
    analyticsService.trackPropertyInteraction(propertyId, 'contact', {
      ...contactData,
      page: location.pathname
    });
  }, [location.pathname]);

  // Track search
  const trackSearch = useCallback((query, filters = {}, results = 0) => {
    analyticsService.trackSearch(query, filters, results);
  }, []);

  // Track form submission
  const trackFormSubmission = useCallback((formName, success = true, data = {}) => {
    analyticsService.trackFormSubmission(formName, success, data);
  }, []);

  // Track button click
  const trackButtonClick = useCallback((buttonName, data = {}) => {
    analyticsService.trackButtonClick(buttonName, location.pathname, data);
  }, [location.pathname]);

  // Track error
  const trackError = useCallback((error, context = {}) => {
    analyticsService.trackError(error, {
      ...context,
      page: location.pathname
    });
  }, [location.pathname]);

  // Track conversion
  const trackConversion = useCallback((conversionType, value = 0, data = {}) => {
    analyticsService.trackConversion(conversionType, value, data);
  }, []);

  // Track engagement
  const trackEngagement = useCallback((action, data = {}) => {
    analyticsService.trackEngagement(action, {
      ...data,
      page: location.pathname
    });
  }, [location.pathname]);

  // Track performance
  const trackPerformance = useCallback((metricName, value, data = {}) => {
    analyticsService.trackPerformance(metricName, value, data);
  }, []);

  // Get analytics data
  const getAnalyticsData = useCallback(() => {
    return analyticsService.getAnalyticsData();
  }, []);

  // Get user insights
  const getUserInsights = useCallback(() => {
    return analyticsService.getUserInsights();
  }, []);

  return {
    trackPropertyView,
    trackPropertyFavorite,
    trackPropertyContact,
    trackSearch,
    trackFormSubmission,
    trackButtonClick,
    trackError,
    trackConversion,
    trackEngagement,
    trackPerformance,
    getAnalyticsData,
    getUserInsights
  };
};

// Hook for tracking specific events
export const useEventTracking = (eventName, data = {}) => {
  const { trackEngagement } = useAnalytics();

  const trackEvent = useCallback((additionalData = {}) => {
    trackEngagement(eventName, { ...data, ...additionalData });
  }, [eventName, data, trackEngagement]);

  return trackEvent;
};

// Hook for tracking page performance
export const usePerformanceTracking = () => {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Track page load time
    const loadTime = performance.now();
    trackPerformance('page_load_time', loadTime);

    // Track largest contentful paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        trackPerformance('largest_contentful_paint', lastEntry.startTime);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      return () => observer.disconnect();
    }
  }, [trackPerformance]);

  const trackCustomPerformance = useCallback((metricName, value) => {
    trackPerformance(metricName, value);
  }, [trackPerformance]);

  return { trackCustomPerformance };
};

// Hook for tracking form interactions
export const useFormTracking = (formName) => {
  const { trackFormSubmission, trackEngagement } = useAnalytics();

  const trackFormStart = useCallback(() => {
    trackEngagement('form_start', { formName });
  }, [formName, trackEngagement]);

  const trackFormFieldFocus = useCallback((fieldName) => {
    trackEngagement('form_field_focus', { formName, fieldName });
  }, [formName, trackEngagement]);

  const trackFormFieldBlur = useCallback((fieldName, hasValue) => {
    trackEngagement('form_field_blur', { formName, fieldName, hasValue });
  }, [formName, trackEngagement]);

  const trackFormSubmit = useCallback((success = true, data = {}) => {
    trackFormSubmission(formName, success, data);
  }, [formName, trackFormSubmission]);

  const trackFormAbandon = useCallback((data = {}) => {
    trackEngagement('form_abandon', { formName, ...data });
  }, [formName, trackEngagement]);

  return {
    trackFormStart,
    trackFormFieldFocus,
    trackFormFieldBlur,
    trackFormSubmit,
    trackFormAbandon
  };
};

// Hook for tracking search interactions
export const useSearchTracking = () => {
  const { trackSearch, trackEngagement } = useAnalytics();

  const trackSearchQuery = useCallback((query, filters = {}) => {
    trackSearch(query, filters);
  }, [trackSearch]);

  const trackSearchFilter = useCallback((filterType, filterValue) => {
    trackEngagement('search_filter', { filterType, filterValue });
  }, [trackEngagement]);

  const trackSearchResultClick = useCallback((resultId, position, query) => {
    trackEngagement('search_result_click', { resultId, position, query });
  }, [trackEngagement]);

  const trackSearchNoResults = useCallback((query, filters = {}) => {
    trackEngagement('search_no_results', { query, filters });
  }, [trackEngagement]);

  return {
    trackSearchQuery,
    trackSearchFilter,
    trackSearchResultClick,
    trackSearchNoResults
  };
};