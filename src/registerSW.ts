/**
 * Registro de Service Worker para Nutribarrio v1.0.2 Pro
 * Diseñado y Desarrollado por: Ing. Joel Roldán Gómez
 */

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[Nutribarrio PWA] Service Worker registrado con éxito:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[Nutribarrio PWA] Nuevo contenido disponible, recarga para actualizar.');
                  } else {
                    console.log('[Nutribarrio PWA] Contenido en caché para uso offline.');
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[Nutribarrio PWA] Fallo en el registro del Service Worker:', error);
        });
    });
  }
}
