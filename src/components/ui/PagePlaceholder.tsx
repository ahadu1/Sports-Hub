import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

type PagePlaceholderProps = {
  title: string;
  description: ReactNode;
  className?: string;
};

export function PagePlaceholder({ title, description, className }: PagePlaceholderProps) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]',
        className,
      )}
    >
      <h1 className="mb-2 text-xl font-semibold text-[var(--color-text)]">{title}</h1>
      <div className="text-[var(--color-text-muted)]">{description}</div>
    </section>
  );
}
