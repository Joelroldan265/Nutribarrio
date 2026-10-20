/**
 * Nutribarrio v1.0.2 Pro - Service Worker
 * Diseñado y Desarrollado por: Ing. Joel Roldán Gómez
 * Estrategia de Caché Avanzada: Stale-While-Revalidate & Cache-First para PWA offline
 */

const CACHE_NAME = 'nutribarrio-cache-v1.0.2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Evento Install: Precarga los activos estáticos críticos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker Nutribarrio] Precaching de activos de la aplicación');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker Nutribarrio] Error en precaching parcial:', err);
      });
    })
  );
});

// Evento Activate: Limpia cachés de versiones antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker Nutribarrio] Purgando versión de caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: Estrategia híbrida según el tipo de recurso
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignorar peticiones que no sean GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Manejo de peticiones de imágenes (Unsplash u otros): Stale-While-Revalidate
  if (request.destination === 'image' || url.hostname.includes('unsplash.com')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Navegación (HTML): Network-First con fallback en caché
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  // Activos estáticos de scripts, estilos y fuentes: Cache-First con fallback a red
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        // Solo cachear respuestas exitosas de origen local
        if (networkResponse && networkResponse.status === 200 && url.origin === location.origin) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // En caso de fallo de red y sin caché, retornar respuesta vacía adecuada
        if (request.destination === 'image') {
          return new Response('', { headers: { 'Content-Type': 'image/svg+xml' } });
        }
        return new Response('Offline - Nutribarrio v1.0.2 Pro', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

// Comunicación con la aplicación para forzar actualización
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
