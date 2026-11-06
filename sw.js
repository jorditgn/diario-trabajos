/* Service worker: deja la aplicación funcionando sin cobertura,
   pero sin quedarse pegada a una versión vieja. */
const VERSION  = 'v3';
const CACHE    = 'diario-' + VERSION;
const FICHEROS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/jspdf.umd.min.js',
  './vendor/jspdf.plugin.autotable.min.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* cache:'reload' es imprescindible: sin él el navegador puede meter en la
       caché nueva una copia vieja que tenga guardada por su cuenta. */
    await c.addAll(FICHEROS.map(u => new Request(u, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function conTiempo(promesa, ms) {
  return new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('tiempo agotado')), ms);
    promesa.then(v => { clearTimeout(t); res(v); },
                 e => { clearTimeout(t); rej(e); });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  /* Abrir la aplicación: primero la red, con 2,5 s de margen, para que las
     actualizaciones lleguen solas. Sin cobertura, la copia guardada. */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = await conTiempo(fetch(req, { cache: 'reload' }), 2500);
        if (res && res.ok) {
          const c = await caches.open(CACHE);
          c.put('./index.html', res.clone());
        }
        return res;
      } catch (err) {
        const hit = await caches.match('./index.html');
        if (hit) return hit;
        throw err;
      }
    })());
    return;
  }

  /* Lo demás (librerías, iconos): la copia guardada, que no cambia casi nunca. */
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    if (res && res.ok && new URL(req.url).origin === location.origin) {
      const c = await caches.open(CACHE);
      c.put(req, res.clone());
    }
    return res;
  })());
});
