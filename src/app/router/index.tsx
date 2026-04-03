import { RootLayout } from '@/app/layout/RootLayout';
import { routes } from '@/app/config/routes';
import { RouteErrorFallback } from '@/components/ui/RouteErrorFallback';
import { RouteLoadingFallback } from '@/app/router/RouteLoadingFallback';
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

const TopMenuComingSoonPage = lazy(async () => {
  const module = await import('@/pages/TopMenuComingSoonPage');

  return { default: module.TopMenuComingSoonPage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('@/pages/NotFoundPage');

  return { default: module.NotFoundPage };
});

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
        path: routes.matchPath,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <MatchDetailsPage />
          </Suspense>
        ),
      },
      {
        path: routes.live,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <TopMenuComingSoonPage title="Live" />
          </Suspense>
        ),
      },
      {
        path: routes.standings,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <TopMenuComingSoonPage title="Standings" />
          </Suspense>
        ),
      },
      {
        path: routes.teams,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <TopMenuComingSoonPage title="Teams" />
          </Suspense>
        ),
      },
      {
        path: routes.comparison,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <TopMenuComingSoonPage title="Comparison" />
          </Suspense>
        ),
      },
      {
        path: routes.statistics,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <TopMenuComingSoonPage title="Statistics" />
          </Suspense>
        ),
      },
      {
        path: routes.venues,
        element: (
          <Suspense fallback={<RouteLoadingFallback />}>
            <TopMenuComingSoonPage title="Venues" />
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
