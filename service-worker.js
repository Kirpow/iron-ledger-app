const CACHE_VERSION = 'v3';
const CACHE_NAME = 'iron-ledger-' + CACHE_VERSION;

// Only static assets that rarely change — the app's own HTML/JS is fetched
// network-first below so a new deploy is picked up right away instead of
// being stuck behind whatever got cached at install time.
const STATIC_SHELL = [
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_SHELL))
      .catch(() => {}) // don't block install if one asset fails to pre-cache
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isAppDocument = event.request.mode === 'navigate'
    || url.pathname.endsWith('/index.html')
    || url.pathname.endsWith('/service-worker.js');

  if (isAppDocument) {
    // Network-first: always try to get the latest version when online, and
    // keep the cache updated as a fallback for offline use. GitHub Pages
    // sends Cache-Control: max-age=600 on these files, which a plain
    // fetch() would honor and silently serve from the browser's HTTP
    // cache instead of actually hitting the network — defeating the
    // point of "network-first" for up to 10 minutes after every deploy.
    // cache: 'no-store' forces a real network round-trip every time.
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for everything else (icons, fonts, etc.), with opportunistic
  // caching of same-origin responses. Cross-origin requests (Google Fonts,
  // Open Food Facts, USDA) just pass through to the network and fail
  // quietly offline.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response && response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
