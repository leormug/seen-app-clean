// src/serviceWorkerRegistration.js
export function register() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Optional: log simple lifecycle
        registration.onupdatefound = () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.onstatechange = () => {
            if (installing.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[SW] Updated. Next load will use new cache.');
              } else {
                console.log('[SW] Ready. App is cached for offline.');
              }
            }
          };
        };
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  }
}
