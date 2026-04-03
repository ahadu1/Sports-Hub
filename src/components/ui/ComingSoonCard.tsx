import { FootballIcon } from '@/components/icons';
import { cn } from '@/utils/cn';

type ComingSoonCardProps = {
  title: string;
  className?: string;
  messageClassName?: string;
  footballClassName?: string;
  showTitle?: boolean;
};

export function ComingSoonCard({
  title,
  className,
  messageClassName,
  footballClassName,
  showTitle = true,
}: ComingSoonCardProps) {
  return (
    <section
      className={cn('rounded-lg border border-app-border-base bg-app-surface p-6', className)}
    >
      {showTitle ? (
        <h2 className="text-center text-xl font-semibold text-app-text">{title}</h2>
      ) : null}
      <div
        className={cn(
          'flex items-end justify-center text-app-brand-secondary',
          showTitle && 'mt-6',
        )}
      >
        <span className={cn('font-bold leading-none', messageClassName ?? 'text-4xl sm:text-5xl')}>
          Coming soon
        </span>
        <FootballIcon
          className={cn('mb-1 ml-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5', footballClassName)}
        />
      </div>
    </section>
  );
}
