import { routes } from '@/app/config/routes';
import { copy } from '@/lib/constants/copy';
import { cn } from '@/lib/utils/cn';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';

export function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  let technicalDetail: string | undefined;
  if (isDev) {
    if (isRouteErrorResponse(error)) {
      technicalDetail = `${error.status} ${error.statusText}: ${error.data}`;
    } else if (error instanceof Error) {
      technicalDetail = error.stack ?? error.message;
    } else {
      technicalDetail = String(error);
    }
  }

  return (
    <div
      className={cn(
        'flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center',
        'text-app-text',
      )}
    >
      <h1 className="text-2xl font-semibold">{copy.routeErrorTitle}</h1>
      <p className="max-w-md text-app-text-muted">{copy.routeErrorMessage}</p>
      {isDev && technicalDetail ? (
        <pre
          className={cn(
            'max-h-40 max-w-full overflow-auto rounded-lg border border-app-border-base',
            'bg-app-surface p-3 text-left text-xs text-app-text-muted',
          )}
        >
          {technicalDetail}
        </pre>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={cn(
            'rounded-lg border border-app-border-base px-4 py-2',
            'text-app-text transition hover:bg-app-surface',
          )}
        >
          {copy.goBack}
        </button>
        <Link
          to={routes.home}
          className={cn(
            'rounded-lg bg-app-accent px-4 py-2 font-medium text-app-accent-on',
            'transition hover:opacity-90',
          )}
        >
          {copy.goHome}
        </Link>
      </div>
    </div>
  );
}
