import { copy } from '@/lib/constants/copy';
import { cn } from '@/lib/utils/cn';

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({ label = copy.loading, className }: LoadingStateProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-sm text-app-text-muted', className)}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          'inline-block size-4 animate-spin rounded-full border-2 border-app-border-base',
          'border-t-app-accent',
        )}
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
