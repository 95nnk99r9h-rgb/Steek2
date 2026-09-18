'use strict';

// Nach Änderungen v1 auf v2 usw. erhöhen. Nur Caches dieser Website werden entfernt.
const VERSION = 'v1';
const ROOT = new URL(self.registration.scope);
const PREFIX = `marcel-steek-${ROOT.pathname}-`;
const CACHE = PREFIX + VERSION;
const CORE = [
  './', 'index.html', 'projekte.html', 'profil.html', 'kontakt.html',
  'rechtliches.html', 'offline.html', 'assets/styles.css', 'assets/app.js',
  'site-config.js', 'manifest.webmanifest', 'assets/icons/favicon.svg',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png', 'assets/icons/apple-touch-icon.png',
  'assets/images/marcel-steek.png',
  ...['hofhaus','holzhaus','weiterbauen','stadthaus','lichtraum','kulturhaus'].flatMap((name) => [
    `assets/images/${name}.webp`, `assets/images/${name}-small.webp`
  ])
].map((path) => new URL(path, ROOT).href);

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(PREFIX) && key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  // Niemals Formular-POSTs, fremde Dienste oder andere GitHub-Projekte cachen.
  if (request.method !== 'GET' || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  const path = url.pathname.slice(ROOT.pathname.length);
  const isPage = request.mode === 'navigate';
  const isCode = /\.(?:js|css|webmanifest)$/.test(path);
  const isImage = /\.(?:webp|png|svg)$/.test(path);
  if (!isPage && !isCode && !isImage) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = new URL(url.href);
    key.search = '';
    key.hash = '';
    if (isImage) {
      const existing = await cache.match(key.href);
      if (existing) return existing;
    }
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(key.href, response.clone());
      return response;
    } catch {
      const existing = await cache.match(key.href);
      if (existing) return existing;
      if (isPage) return await cache.match(new URL('offline.html', ROOT).href);
      return Response.error();
    }
  })());
});
