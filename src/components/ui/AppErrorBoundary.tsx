import { copy } from '@/lib/constants/copy';
import { logError } from '@/lib/utils/logger';
import { cn } from '@/lib/utils/cn';
import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError('AppErrorBoundary', error);
    logError('AppErrorBoundary.componentStack', errorInfo.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className={cn('rounded-lg border border-app-danger bg-app-surface p-4', 'text-app-text')}
        >
          <h2 className="font-semibold">{copy.errorBoundaryTitle}</h2>
          <p className="mt-1 text-sm text-app-text-muted">{copy.errorBoundaryMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
