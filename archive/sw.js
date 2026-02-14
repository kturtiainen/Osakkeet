const CACHE_NAME = 'osakesalkku-v1';
const urlsToCache = [
  '/Osakkeet/',
  '/Osakkeet/index.html',
  '/Osakkeet/manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', event => {
  // Skip API calls - always fetch fresh
  // Use URL parsing to properly check the hostname
  try {
    const url = new URL(event.request.url);
    // Check for exact match or subdomain of rapidapi.com
    if (url.hostname === 'rapidapi.com' || url.hostname.endsWith('.rapidapi.com')) {
      return event.respondWith(fetch(event.request));
    }
  } catch (e) {
    // Invalid URL, continue with normal caching
  }
  
  // Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request);
      })
  );
});