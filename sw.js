const CACHE_NAME = 'pallet-tracker-cache-v3';
const DATA_CACHE_NAME = 'pallet-tracker-data-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx', // Assuming this is served directly by a dev server or similar
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.44.4/+esm'
];

const supabaseApiUrl = 'https://kbsgklmcpuprxqykzirz.supabase.co/rest/v1/pallets';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Handle Supabase API calls with a network-first strategy
  if (requestUrl.href.startsWith(supabaseApiUrl)) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            // If we get a valid response, cache it and return it
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // If the network request fails (offline), try to get it from the cache
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // Handle App Shell assets with a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || !networkResponse.ok) {
              return networkResponse;
            }

            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
          // Optional: You could return a custom offline page here
        });
      })
  );
});