import { cn } from '@/lib/utils/cn';

type InlineErrorStateProps = {
  title: string;
  message: string;
  retryLabel: string;
  onRetry?: () => void;
  attempt: number;
  maxAttempts: number;
  retryCountdownSeconds?: number;
};

export function InlineErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  attempt,
  maxAttempts,
  retryCountdownSeconds,
}: InlineErrorStateProps) {
  const showRetry = typeof onRetry === 'function';

  return (
    <div
      role="alert"
      className={cn('rounded-lg border border-app-border-base bg-app-surface p-4', 'text-app-text')}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-app-text-muted">{message}</p>
      <p className="mt-2 text-xs text-app-text-muted">
        Attempt {attempt} of {maxAttempts}
        {retryCountdownSeconds !== undefined && retryCountdownSeconds > 0
          ? ` · ${retryCountdownSeconds}s`
          : null}
      </p>
      {showRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'mt-3 rounded-lg bg-app-accent px-3 py-1.5 text-sm font-medium text-app-accent-on',
            'hover:opacity-90',
          )}
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
