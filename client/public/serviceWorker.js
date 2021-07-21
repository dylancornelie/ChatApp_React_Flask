const CACHE_NAME = 'cache-v1';
const urlsToCache = ['/', '/index.html', 'offline.html'];

// self = service worker
const self = this;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log(`Cached opened`);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (!(event.request.url.indexOf('http') === 0)) return;
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
        const responseToCache = response.clone();

        caches
          .open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          })
          .catch((err) => console.log('erreur : ', err));

        return response;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
});
