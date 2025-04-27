const CACHE_NAME = 'form-scanner-cache-v1';
const URLsToCache = [
  '.',
  'index.html',
  'style.css',
  'app.js',
  'manifest.webmanifest'
];

self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated.');
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
