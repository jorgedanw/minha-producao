/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

declare module 'virtual:pwa-register' {
  interface RegisterSWOptions {
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegisterError?: (error: any) => void;
    immediate?: boolean;
  }
  export function registerSW(options?: RegisterSWOptions): () => void;
}

// Para o precache manifest injetado pelo Workbox
declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<unknown>;
};
