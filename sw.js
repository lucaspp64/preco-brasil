// PreçoManaus Service Worker v3 - Network-First + Caching Modular & Notificações de Alertas
const CACHE_NAME = 'precomanaus-v9';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/web/styles/main.css',
  '/web/data/manausCatalog.js',
  '/web/services/distanceService.js',
  '/web/services/shoppingOptimizer.js',
  '/web/services/apiClient.js',
  '/web/app.js',
  '/web/assets/logo.jpg',
  '/web/assets/teatro_amazonas.jpg',
  '/web/assets/hero_shopping.jpg',
  '/web/assets/cat_staples.jpg',
  '/web/assets/cat_meats.jpg',
  '/web/assets/cat_fruits.jpg',
  '/web/assets/cat_dairy.jpg',
  '/web/assets/cat_cleaning.jpg',
  '/web/assets/cat_pets.jpg'
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
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First para atualizar imediatamente o visual no navegador, com fallback offline
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => cached || caches.match('/index.html'));
      })
  );
});

// Listener para disparar notificações locais de preço baixo
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRICE_ALERT_NOTIFICATION') {
    const { title, body, icon } = event.data;
    if (self.registration && self.registration.showNotification) {
      self.registration.showNotification(title, {
        body: body,
        icon: icon || '/web/assets/logo.jpg',
        badge: icon || '/web/assets/logo.jpg',
        vibrate: [200, 100, 200],
        tag: 'price-drop-alert'
      });
    }
  }
});
