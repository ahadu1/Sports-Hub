import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type StatePanelProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
};

export function StatePanel({ children, className, compact = false }: StatePanelProps) {
  return (
    <div className={cn('statePanel', compact && 'statePanel--compact', className)}>{children}</div>
  );
}
