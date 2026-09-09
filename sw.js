const CACHE_PREFIX = 'bju-pwa-';
const CACHE = `${CACHE_PREFIX}v4`;
const APP_SHELL = [
  './', './index.html', './styles.css', './core.js', './app.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    const online = fetch(event.request).then(response => {
      if (!response.ok) return response;
      const copy = response.clone();
      return caches.open(CACHE).then(cache => cache.put('./index.html', copy)).then(() => response);
    });
    event.respondWith(online.catch(() => caches.match('./index.html')));
    return;
  }

  const update = fetch(event.request).then(response => {
    if (!response.ok) return response;
    const copy = response.clone();
    return caches.open(CACHE).then(cache => cache.put(event.request, copy)).then(() => response);
  });
  event.waitUntil(update.catch(() => undefined));
  event.respondWith(caches.match(event.request).then(cached => cached || update));
});
