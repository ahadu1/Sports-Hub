import { Header } from '@/components/header/Header';
import { FixturesCompetitionProvider } from '@/features/fixtures/context/FixturesCompetitionContext';
import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-app-canvas text-app-text">
      <FixturesCompetitionProvider>
        <Header />
        <main className="mx-auto max-w-5xl p-4">
          <Outlet />
        </main>
      </FixturesCompetitionProvider>
    </div>
  );
}
