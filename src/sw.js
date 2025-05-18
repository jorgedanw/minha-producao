// src/sw.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';
// precache do manifest (cast para any)
precacheAndRoute(self.__WB_MANIFEST);
// Fallback para navegação SPA
registerRoute(({ request }) => request.mode === 'navigate', new NetworkFirst({ cacheName: 'html-cache' }));
