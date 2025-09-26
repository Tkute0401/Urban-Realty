// Service Worker for Squarefooot - Real Estate Caching Strategy
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `squarefooot-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `squarefooot-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `squarefooot-images-${CACHE_VERSION}`;

// Cache different types of assets with different strategies
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/js/',
  '/_next/static/media/',
  '/fonts/',
  '/icons/'
];

const PROPERTY_ROUTES = [
  '/properties',
  '/developers',
  '/about',
  '/contact',
  '/help',
  '/terms',
  '/trust',
  '/privacy-policy'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll([
          '/',
          '/manifest.json'
        ]);
      }),
      
      // Pre-cache important property pages
      caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.addAll(PROPERTY_ROUTES);
      })
    ]).then(() => {
      console.log('Service Worker: Install complete');
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Clean up old caches
          if (cacheName.startsWith('urban-realty-') && 
              !cacheName.includes(CACHE_VERSION)) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;
  
  // Handle different types of requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return IMAGE_EXTENSIONS.some(ext => 
    request.url.includes(ext) || 
    request.destination === 'image'
  );
}

// Check if request is for a static asset
function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
         request.destination === 'script' ||
         request.destination === 'style' ||
         request.destination === 'font';
}

// Check if request is for API
function isAPIRequest(request) {
  return request.url.includes('/api/');
}

// Check if request is for navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Serve from cache and update in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore network errors
      });
      
      return cachedResponse;
    }
    
    // Fetch from network and cache
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Image request failed:', error);
    
    // Return fallback image for property images
    if (request.url.includes('/properties/') || request.url.includes('property')) {
      const cache = await caches.open(IMAGE_CACHE);
      const fallback = await cache.match('/images/property-placeholder.jpg');
      if (fallback) return fallback;
    }
    
    return new Response('', { status: 404 });
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Static asset request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful GET requests
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('API request failed, trying cache:', error);
    
    // Try to serve from cache
    if (request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    return new Response(JSON.stringify({ error: 'Network unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle navigation requests with network-first, cache fallback
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Navigation request failed, trying cache:', error);
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or basic HTML
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Squarefooot - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline-message { max-width: 400px; margin: 0 auto; }
            .retry-button { 
              background: #1976d2; color: white; padding: 10px 20px; 
              border: none; border-radius: 5px; margin-top: 20px; cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="offline-message">
            <h1>You're Offline</h1>
            <p>Squarefooot is currently unavailable. Please check your internet connection and try again.</p>
            <button class="retry-button" onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle other requests
async function handleOtherRequests(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('Request failed:', error);
    return new Response('', { status: 404 });
  }
}

// Background sync for property favorites and user preferences
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync property favorites
    const favoritesData = await getStoredData('favorites');
    if (favoritesData) {
      await syncFavorites(favoritesData);
    }
    
    // Sync user preferences
    const preferencesData = await getStoredData('preferences');
    if (preferencesData) {
      await syncPreferences(preferencesData);
    }
    
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Utility functions
function getStoredData(key) {
  return new Promise((resolve) => {
    // This would typically access IndexedDB or another storage mechanism
    resolve(null);
  });
}

async function syncFavorites(data) {
  // Sync favorites with server
  try {
    const response = await fetch('/api/user/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to sync favorites:', error);
    return false;
  }
}

async function syncPreferences(data) {
  // Sync user preferences with server
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to sync preferences:', error);
    return false;
  }
}

// Push notification handling for property alerts
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Property'
      },
      {
        action: 'save',
        title: 'Save for Later'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  let url = '/';
  
  if (data && data.propertyId) {
    url = `/properties/${data.propertyId}`;
  }
  
  if (action === 'save') {
    // Handle save action
    event.waitUntil(
      savePropertyForLater(data.propertyId)
    );
    return;
  }
  
  event.waitUntil(
    clients.openWindow(url)
  );
});

async function savePropertyForLater(propertyId) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    // Store property for offline access
    const propertyResponse = await fetch(`/api/properties/${propertyId}`);
    if (propertyResponse.ok) {
      await cache.put(`/api/properties/${propertyId}`, propertyResponse);
    }
  } catch (error) {
    console.error('Failed to save property:', error);
  }
}