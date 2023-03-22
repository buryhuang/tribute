let CACHE_NAME = 'next-app-cache-v1';

/**
 * The install event is fired when the registration succeeds.
 * After the install step, the browser tries to activate the service worker.
 * Generally, we cache static resources that allow the website to run offline
 */
self.addEventListener('install', async function() {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([])
});

self.addEventListener('fetch', function(event) {});