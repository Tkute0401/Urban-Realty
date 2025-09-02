// Analytics middleware for tracking user behavior and system metrics

const analytics = require('@sentry/node');
const { v4: uuidv4 } = require('uuid');

// User behavior tracking
const trackUserAction = (req, res, next) => {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  // Add request ID to headers for tracing
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  // Track request metrics
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Log request metrics
    console.log({
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    });
    
    // Track performance metrics
    if (duration > 1000) {
      analytics.addBreadcrumb({
        message: 'Slow request detected',
        category: 'performance',
        level: 'warning',
        data: {
          url: req.url,
          duration,
          method: req.method
        }
      });
    }
    
    // Track error rates
    if (res.statusCode >= 400) {
      analytics.addBreadcrumb({
        message: 'Error response',
        category: 'error',
        level: 'error',
        data: {
          url: req.url,
          statusCode: res.statusCode,
          method: req.method
        }
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// API usage tracking
const trackApiUsage = (req, res, next) => {
  const apiKey = req.get('X-API-Key');
  const userId = req.user?.id;
  
  // Track API usage patterns
  const usageData = {
    endpoint: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    userId: userId || 'anonymous',
    apiKey: apiKey ? 'present' : 'none',
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };
  
  // Log API usage (in production, this would go to a database or analytics service)
  console.log('API Usage:', usageData);
  
  // Track with Sentry for monitoring
  analytics.addBreadcrumb({
    message: 'API endpoint accessed',
    category: 'api',
    level: 'info',
    data: usageData
  });
  
  next();
};

// Property view tracking
const trackPropertyView = (req, res, next) => {
  if (req.method === 'GET' && req.path.includes('/properties/') && !req.path.includes('/search')) {
    const propertyId = req.params.id;
    const userId = req.user?.id || 'anonymous';
    
    // Track property views
    const viewData = {
      propertyId,
      userId,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer')
    };
    
    console.log('Property View:', viewData);
    
    // In production, this would be stored in a database
    // For now, we'll just log it
    analytics.addBreadcrumb({
      message: 'Property viewed',
      category: 'engagement',
      level: 'info',
      data: viewData
    });
  }
  
  next();
};

// Search tracking
const trackSearch = (req, res, next) => {
  if (req.method === 'GET' && req.path.includes('/search')) {
    const searchParams = req.query;
    const userId = req.user?.id || 'anonymous';
    
    const searchData = {
      query: searchParams,
      userId,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    console.log('Search Query:', searchData);
    
    analytics.addBreadcrumb({
      message: 'Search performed',
      category: 'engagement',
      level: 'info',
      data: searchData
    });
  }
  
  next();
};

// User registration/login tracking
const trackAuthEvents = (req, res, next) => {
  const authEvents = ['/register', '/login', '/logout'];
  
  if (authEvents.some(event => req.path.includes(event))) {
    const eventType = req.path.includes('/register') ? 'registration' :
                     req.path.includes('/login') ? 'login' : 'logout';
    
    const authData = {
      eventType,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      success: res.statusCode < 400
    };
    
    console.log('Auth Event:', authData);
    
    analytics.addBreadcrumb({
      message: `User ${eventType}`,
      category: 'auth',
      level: 'info',
      data: authData
    });
  }
  
  next();
};

// Error tracking
const trackErrors = (err, req, res, next) => {
  const errorData = {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  };
  
  console.error('Error occurred:', errorData);
  
  // Send to Sentry
  analytics.captureException(err, {
    tags: {
      section: 'api',
      userId: req.user?.id || 'anonymous'
    },
    extra: errorData
  });
  
  next(err);
};

// Performance monitoring
const trackPerformance = (req, res, next) => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
    
    // Track slow requests
    if (duration > 2000) {
      analytics.addBreadcrumb({
        message: 'Very slow request',
        category: 'performance',
        level: 'warning',
        data: {
          url: req.url,
          method: req.method,
          duration: `${duration}ms`,
          statusCode: res.statusCode
        }
      });
    }
    
    // Track memory usage
    const memUsage = process.memoryUsage();
    if (memUsage.heapUsed > 100 * 1024 * 1024) { // 100MB
      analytics.addBreadcrumb({
        message: 'High memory usage',
        category: 'performance',
        level: 'warning',
        data: {
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
        }
      });
    }
  });
  
  next();
};

module.exports = {
  trackUserAction,
  trackApiUsage,
  trackPropertyView,
  trackSearch,
  trackAuthEvents,
  trackErrors,
  trackPerformance
};