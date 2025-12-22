const CACHE_NAME="sbpsc-color-v9";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>{
 e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>x!==CACHE_NAME&&caches.delete(x)))));
 self.clients.claim();
});
self.addEventListener("fetch",e=>{
 e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});
