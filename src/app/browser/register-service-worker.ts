import { APP_SERVICE_WORKER_PATH } from '@/app/config/app-config';

export function registerAppServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const register = async () => {
    try {
      await navigator.serviceWorker.register(APP_SERVICE_WORKER_PATH);
    } catch {
      // Badge/logo caching is a progressive enhancement.
    }
  };

  if (document.readyState === 'complete') {
    void register();
    return;
  }

  window.addEventListener('load', () => void register(), { once: true });
}
