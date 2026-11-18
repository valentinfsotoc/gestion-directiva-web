/* Guarda la aplicación en el PC para que abra sin conexión. La página principal se pide primero a la red para recibir las actualizaciones. */
const CACHE = 'gd-db9fde59b159';
const BASE = ['./', 'index.html', 'docx.umd.js', 'manifest.webmanifest', 'icono-192.png', 'icono-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('gd-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  if (r.mode === 'navigate') {
    if (!/\/(index\.html)?$/.test(new URL(r.url).pathname)) return;   // otras páginas (como la de prueba) no se guardan como la aplicación
    e.respondWith(fetch(r).then(x => { const c = x.clone(); caches.open(CACHE).then(k => k.put('index.html', c)); return x; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(x => x || fetch(r)));
});
