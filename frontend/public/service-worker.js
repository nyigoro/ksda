const CACHE_NAME = 'ksda-songs-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/src/components/SongList.tsx',
  '/src/components/SongCard.tsx',
  '/src/components/SongCardSkeleton.tsx',
  '/src/pages/Home.tsx',
  '/src/pages/AddSong.tsx',
  '/src/pages/SongDetails.tsx',
  '/src/pages/LyricsPage.tsx',
  '/src/pages/LyricsLibrary.tsx',
  '/src/pages/FavoritesPage.tsx',
  // Add other static assets like images, fonts, etc.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // For non-GET requests, just go to the network
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request to allow it to be read by both the cache and the browser
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone the response
            // so that we can consume it once to cache it and once for the browser
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          console.error('Fetch failed:', error);
          // Return a custom offline response or a generic network error
          return new Response('<h1>Offline</h1><p>Please check your network connection.</p>', { headers: { 'Content-Type': 'text/html' } });
        });
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});