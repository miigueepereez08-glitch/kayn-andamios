const CACHE_NAME = 'kayn-andamios-v11-2-ui-pro-logo';
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js",
  "/logo.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icons/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/vercel.json",
  "/README_VERCEL.txt"
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS.map(url => new Request(url, {cache: 'reload'}))).catch(() => cache.addAll(['/','/index.html'])))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        return response;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
