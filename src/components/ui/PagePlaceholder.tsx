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
      className={cn('rounded-lg border border-app-border-base bg-app-surface p-6', className)}
    >
      <h1 className="mb-2 text-xl font-semibold text-app-text">{title}</h1>
      <div className="text-app-text-muted">{description}</div>
    </section>
  );
}
