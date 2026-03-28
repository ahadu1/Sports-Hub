import { DEMO_MATCH_EVENT_ID } from '@/app/config/app-config';
import { matchDetails, routes } from '@/app/config/routes';
import { copy } from '@/lib/constants/copy';
import { Link, Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-app-canvas text-app-text">
      <header className="app-brand-bar border-b border-app-border-base">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-semibold text-app-brand-on-primary">{copy.appTitle}</span>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link
              to={routes.home}
              className="text-app-brand-on-primary underline-offset-4 hover:underline"
            >
              {copy.navHome}
            </Link>
            <Link
              to={matchDetails(DEMO_MATCH_EVENT_ID)}
              className="text-app-brand-on-primary underline-offset-4 hover:underline"
            >
              {copy.navDemoMatch}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <section aria-label="Theme token verification" className="space-y-6">
          <h2 className="text-lg font-semibold text-app-text-strong">Theme Token Verification</h2>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg px-4 py-3 text-sm font-medium bg-app-brand-primary text-app-brand-on-primary">
              Brand primary
            </div>
            <div className="rounded-lg px-4 py-3 text-sm font-medium bg-app-brand-secondary text-app-brand-on-secondary">
              Brand secondary
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="app-panel p-4 text-sm text-app-text-muted">
              Surface panel (app-panel)
            </div>
            <div className="app-panel-muted p-4 text-sm text-app-text-muted">
              Muted panel (app-panel-muted)
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="app-chip-active px-3 py-1 text-sm">Active chip</span>
            <span className="app-chip-inactive px-3 py-1 text-sm">Inactive chip</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-app-text">text-app-text</span>
            <span className="text-app-text-strong">text-app-text-strong</span>
            <span className="text-app-text-muted">text-app-text-muted</span>
            <span className="text-app-text-subtle">text-app-text-subtle</span>
            <span className="text-app-text-subtle-static">text-app-text-subtle-static</span>
            <span className="text-app-text-disabled">text-app-text-disabled</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <span className="text-app-success">text-app-success</span>
            <span className="text-app-danger">text-app-danger</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-lg px-3 py-2 text-xs font-medium bg-app-accent text-app-accent-on">
              accent
            </div>
            <div className="rounded-lg px-3 py-2 text-xs font-medium bg-app-accent-moderate text-app-accent-on">
              moderate
            </div>
            <div className="rounded-lg px-3 py-2 text-xs font-medium bg-app-accent-bold text-app-accent-on">
              bold
            </div>
            <div className="rounded-lg px-3 py-2 text-xs font-medium bg-app-accent-dim text-app-accent-on">
              dim
            </div>
          </div>

          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="inline-block cursor-pointer rounded-lg border border-app-border-base bg-app-surface px-3 py-2 text-sm text-app-text"
            >
              DaisyUI dropdown (demo)
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu menu-sm z-[1] mt-2 w-52 rounded-box border border-app-border-base bg-base-200 p-2"
            >
              <li>
                <span className="text-app-text">Item one</span>
              </li>
              <li>
                <span className="text-app-text">Item two</span>
              </li>
            </ul>
          </div>
        </section>

        <Outlet />
      </main>
    </div>
  );
}
