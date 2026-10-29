const CACHE_NAME = 'lexicon-roguelike-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './assets/monsters/tung_tung.png',
  './assets/monsters/strawberry_elephant.jpg',
  './assets/monsters/shark_shoes.png',
  './assets/monsters/teacup_ballerina.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Cache-first falling back to network strategy for offline support
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Return cached index if offline navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
