import { copy } from '@/lib/constants/copy';
import { cn } from '@/utils/cn';

type LoadingStateProps = {
  label?: string;
  className?: string;
  size?: 'default' | 'large';
};

export function LoadingState({
  label = copy.loading,
  className,
  size = 'default',
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-app-text-muted',
        size === 'large' ? 'text-base' : 'text-sm',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          'loading loading-spinner text-app-brand-secondary',
          size === 'large' ? 'loading-lg' : 'loading-sm',
        )}
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
