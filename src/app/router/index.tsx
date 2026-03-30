import { RootLayout } from '@/app/layout/RootLayout';
import { routes } from '@/app/config/routes';
import { LoadingState } from '@/components/ui/LoadingState';
import { RouteErrorFallback } from '@/components/ui/RouteErrorFallback';
import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

const FixturesPage = lazy(async () => {
  const module = await import('@/features/fixtures/pages/FixturesPage');

  return { default: module.FixturesPage };
});

const MatchDetailsPage = lazy(async () => {
  const module = await import('@/features/match/pages/MatchDetailsPage');

  return { default: module.MatchDetailsPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('@/pages/NotFoundPage');

  return { default: module.NotFoundPage };
});

function RouteLoadingFallback() {
  return (
    <section className="flex min-h-[220px] items-center justify-center rounded-lg border border-app-border-base bg-app-surface p-6">
      <LoadingState className="justify-center" />
    </section>
  );
}

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <FixturesPage />
          </Suspense>
        ),
      },
      {
        path: 'match/:eventId',
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <MatchDetailsPage />
          </Suspense>
        ),
      },
      {
        path: routes.notFound,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
