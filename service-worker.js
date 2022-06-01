let cacheName = 'v1';
let filesToCache = [
  '/',
  'index.html', 
  'style.css', 
  'index.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting()
  console.log('Installed sevice worker', new Date().toLocaleTimeString());
});

self.addEventListener('activate', (event) => {
    self.skipWaiting()
    console.log('Activated sevice worker', new Date().toLocaleTimeString());
})

self.addEventListener('fetch', async (event) => {
  if (!navigator.onLine) {
    console.log('Offline');
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response 
      })
    )
  } else {
    console.log('Online');
    const response = await updateCache(event.request);
    return response;
  }
});

const updateCache = async (request) => {
    const response = await fetch(request)
    const cache = await caches.open(cacheName)
    if (request.method === 'GET') {
      cache.put(request, response.clone())
    }
    return response
}


