import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

type StatePanelProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

export function StatePanel({ children, className, compact = false }: StatePanelProps) {
  return (
    <div className={cn('app-state-panel', compact && 'app-state-panel--compact', className)}>
      {children}
    </div>
  );
}
