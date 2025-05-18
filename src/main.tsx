import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

const _updateSW = registerSW({
  onOfflineReady: () => {
    console.log('✓ App ready for OFFLINE');
  },
  onNeedRefresh: () => {
    console.log('🔄 New version available');
  },
  onRegistered: (registration) => {
    if (registration) console.log('SW registrado:', registration);
  },
  onRegisterError: (err: unknown) => {
    console.error('SW registration error:', err);
  },
  immediate: true,  // registra na inicialização do app
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
