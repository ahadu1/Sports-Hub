import { DEMO_MATCH_EVENT_ID } from '@/app/config/app-config';
import { matchDetails, routes } from '@/app/config/routes';
import { copy } from '@/lib/constants/copy';
import { cn } from '@/lib/utils/cn';
import { Link, Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <header
        className={cn(
          'border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]',
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-semibold">{copy.appTitle}</span>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link
              to={routes.home}
              className="text-[var(--color-accent)] underline-offset-4 hover:underline"
            >
              {copy.navHome}
            </Link>
            <Link
              to={matchDetails(DEMO_MATCH_EVENT_ID)}
              className="text-[var(--color-accent)] underline-offset-4 hover:underline"
            >
              {copy.navDemoMatch}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
