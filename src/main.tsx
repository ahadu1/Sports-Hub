import { registerAppServiceWorker } from '@/app/browser/register-service-worker';
import '@/lib/env/env';
import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router';
import '@/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);

registerAppServiceWorker();
