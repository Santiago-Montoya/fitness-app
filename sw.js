// Caches the app so it opens offline. Bump VERSION after changing files.
const VERSION = "daily-v4";
const FILES = ["./", "index.html", "figures.js", "manifest.json", "icon.svg", "icon-180.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // network first so updates show up; fall back to cache offline.
  // "no-cache" makes the phone ask GitHub for the latest file instead of reusing its own copy.
  const sameOrigin = new URL(e.request.url).origin === location.origin;
  e.respondWith(
    (sameOrigin ? fetch(e.request.url, { cache: "no-cache" }) : fetch(e.request)).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request))
  );
});
