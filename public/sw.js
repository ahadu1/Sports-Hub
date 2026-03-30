/* global URL, caches, fetch, self */

const TEAM_ASSET_CACHE_NAME = 'sports-hub-team-assets-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith('sports-hub-team-assets-') &&
                cacheName !== TEAM_ASSET_CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isCacheableTeamAsset(request) {
  if (request.method !== 'GET' || request.destination !== 'image') {
    return false;
  }

  const url = new URL(request.url);

  if (url.hostname !== 'r2.thesportsdb.com') {
    return false;
  }

  return (
    url.pathname.includes('/images/media/team/') || url.pathname.includes('/images/media/league/')
  );
}

function shouldCacheResponse(response) {
  return response.ok || response.type === 'opaque';
}

async function fetchAndCache(request, cache) {
  const networkResponse = await fetch(request);

  if (shouldCacheResponse(networkResponse)) {
    await cache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

self.addEventListener('fetch', (event) => {
  if (!isCacheableTeamAsset(event.request)) {
    return;
  }

  event.respondWith(
    caches.open(TEAM_ASSET_CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);

      if (cachedResponse) {
        event.waitUntil(fetchAndCache(event.request, cache).catch(() => undefined));
        return cachedResponse;
      }

      try {
        return await fetchAndCache(event.request, cache);
      } catch (error) {
        if (cachedResponse) {
          return cachedResponse;
        }

        throw error;
      }
    }),
  );
});
