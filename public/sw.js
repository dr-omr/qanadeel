const CACHE_NAME = "qandeel-v1";
const OFFLINE_URL = "/offline";

// Resources to cache immediately on install
const PRECACHE_ASSETS = [
  "/",
  "/offline",
  "/about",
  "/gallery",
  "/fees",
  "/admission",
  "/contact",
  "/policies",
  "/branding/logo-full.png",
  "/branding/logo-mark.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Install: cache all essential pages
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Silently fail if some assets can't be cached
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network-first for pages, Cache-first for assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip API routes — always network
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    // Pages: network-first, fallback to offline
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match(OFFLINE_URL)
          )
        )
    );
  } else {
    // Assets (images, fonts, JS, CSS): cache-first
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
  }
});
