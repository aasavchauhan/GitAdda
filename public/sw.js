const CACHE_NAME = 'gitadda-v1'
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192.svg',
    '/icons/icon-512.svg',
]

// Install — pre-cache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    )
    self.clients.claim()
})

// Fetch — network-first for HTML/API, cache-first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') return

    // Skip external requests (Supabase, GitHub API, etc.)
    if (url.origin !== self.location.origin) return

    // Static assets: cache-first
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ico)$/) ||
        url.pathname.startsWith('/_next/static/')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    }
                    return response
                })
            })
        )
        return
    }

    // HTML pages: network-first with offline fallback
    if (request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone()
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
                    return response
                })
                .catch(() => {
                    return caches.match(request).then((cached) => {
                        return cached || caches.match('/')
                    })
                })
        )
        return
    }
})
