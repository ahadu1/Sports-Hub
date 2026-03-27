import { RootLayout } from '@/app/layout/RootLayout';
import { routes } from '@/app/config/routes';
import { RouteErrorFallback } from '@/components/ui/RouteErrorFallback';
import { FixturesPage } from '@/features/fixtures/pages/FixturesPage';
import { MatchDetailsPage } from '@/features/match/pages/MatchDetailsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <FixturesPage /> },
      { path: 'match/:eventId', element: <MatchDetailsPage /> },
      { path: routes.notFound, element: <NotFoundPage /> },
    ],
  },
]);
