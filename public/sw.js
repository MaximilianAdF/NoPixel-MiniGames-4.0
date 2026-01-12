// Basic Service Worker for PWA functionality
// This file is intentionally minimal - no third-party ad services

const CACHE_NAME = 'nphacks-v1';

// Install event - cache essential files
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event - pass through (no caching strategy)
self.addEventListener('fetch', (event) => {
  // Let requests pass through normally
  // Add caching strategy here if needed for offline support
});
