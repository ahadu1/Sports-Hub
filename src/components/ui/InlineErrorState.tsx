import { copy } from '@/lib/constants/copy';
import { cn } from '@/utils/cn';

type InlineErrorStateProps = {
  title: string;
  message: string;
  retryLabel?: string | undefined;
  onRetry?: (() => void) | undefined;
  attempt?: number | undefined;
  maxAttempts?: number | undefined;
  retryCountdownSeconds?: number | undefined;
  className?: string | undefined;
};

export function InlineErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  attempt,
  maxAttempts,
  retryCountdownSeconds,
  className,
}: InlineErrorStateProps) {
  const showRetry = typeof onRetry === 'function';
  const showAttemptMeta = attempt !== undefined && maxAttempts !== undefined;

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border border-app-border-base bg-app-surface p-4 text-app-text',
        className,
      )}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-app-text-muted">{message}</p>
      {showAttemptMeta ? (
        <p className="mt-2 text-xs text-app-text-muted">
          Attempt {attempt} of {maxAttempts}
          {retryCountdownSeconds !== undefined && retryCountdownSeconds > 0
            ? ` · ${retryCountdownSeconds}s`
            : null}
        </p>
      ) : null}
      {showRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={cn(
            'mt-3 rounded-lg bg-app-accent px-3 py-1.5 text-sm font-medium text-app-accent-on',
            'hover:opacity-90',
          )}
        >
          {retryLabel ?? copy.retry}
        </button>
      ) : null}
    </div>
  );
}
